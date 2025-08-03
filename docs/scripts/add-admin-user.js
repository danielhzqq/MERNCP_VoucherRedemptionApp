#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('👨‍💼 Add Admin User Script\n');

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/voucher-redeem-merncp';

// User Schema (matching the updated model)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 5,
    maxLength: 150,
    index: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    index: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    minLength: 10,
    maxLength: 20,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 300,
    index: true,
    trim: true,
  },
  profileImage: {
    type: String,
    required: false,
    maxLength: 500,
    trim: true,
  },
  isActive: { 
    type: Boolean, 
    required: false, 
    default: true 
  },
  points: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
    max: 999999999,
  },
  address: {
    type: String,
    required: false,
    maxLength: 500,
    trim: true,
  },
  aboutMe: {
    type: String,
    required: false,
    maxLength: 1000,
    trim: true,
  },
  role: {
    type: String,
    required: false,
    default: "customer",
    enum: ["customer", "admin"],
    index: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('users', userSchema);

async function addAdminUser() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully\n');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@voucher-redeem.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.isActive}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      
      // Ask if user wants to update the existing admin
      console.log('\n📝 Options:');
      console.log('1. Keep existing admin user (no changes)');
      console.log('2. Update existing admin user with new password');
      console.log('3. Delete existing admin and create new one');
      
      // For now, we'll just update the password if it exists
      if (existingAdmin) {
        console.log('\n🔄 Updating existing admin user password...');
        
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await User.updateOne(
          { _id: existingAdmin._id },
          { 
            $set: { 
              password: hashedPassword,
              role: 'admin',
              isActive: true,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log('✅ Admin user password updated successfully');
      }
      
    } else {
      console.log('👨‍💼 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create admin user
      const adminUser = new User({
        email: 'admin@voucher-redeem.com',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        points: 0,
        aboutMe: 'System Administrator',
        address: 'System Address',
        phoneNumber: '+1234567890'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    // Verify the admin user
    console.log('\n🔍 Verifying admin user...');
    const adminUser = await User.findOne({ email: 'admin@voucher-redeem.com' });
    
    if (adminUser) {
      console.log('✅ Admin user verified:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Username: ${adminUser.username}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Active: ${adminUser.isActive}`);
      console.log(`   Points: ${adminUser.points}`);
      console.log(`   Created: ${adminUser.createdAt}`);
    } else {
      console.log('❌ Admin user not found after creation');
    }

    // Show all users
    console.log('\n📊 All Users in Database:');
    const allUsers = await User.find({}, { email: 1, username: 1, role: 1, isActive: 1, _id: 0 });
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.username} (${user.role}) - Active: ${user.isActive}`);
    });

    // Role distribution
    const customerCount = await User.countDocuments({ role: 'customer' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    console.log('\n📈 Role Distribution:');
    console.log(`👥 Customers: ${customerCount}`);
    console.log(`👨‍💼 Admins: ${adminCount}`);

  } catch (error) {
    console.error('❌ Error adding admin user:', error.message);
    
    if (error.code === 11000) {
      console.log('💡 This error usually means the email already exists.');
      console.log('   Try running the script again to update the existing user.');
    }
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Main execution
async function main() {
  try {
    await addAdminUser();
    
    console.log('\n🎉 Admin user setup completed!');
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@voucher-redeem.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test admin login at: http://localhost:3000/admin/login');
    console.log('3. Verify admin dashboard access');
    
  } catch (error) {
    console.error('❌ Main execution failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 