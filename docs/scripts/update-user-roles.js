#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('🔄 User Role Update Script\n');

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

async function updateUserRoles() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully\n');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const user of users) {
      try {
        const originalRole = user.role;
        let newRole = user.role;

        // Check if role is missing or invalid
        if (!user.role || !['customer', 'admin'].includes(user.role)) {
          // Determine new role based on email or other criteria
          if (user.email && user.email.includes('admin')) {
            newRole = 'admin';
          } else {
            newRole = 'customer';
          }

          // Update user role
          await User.updateOne(
            { _id: user._id },
            { $set: { role: newRole } }
          );

          const roleStatus = originalRole ? `role "${originalRole}"` : 'no role';
          console.log(`✅ Updated user "${user.email}" ${roleStatus} → ${newRole}`);
          updatedCount++;
        } else {
          console.log(`⏭️  Skipped user "${user.email}" - role "${user.role}" is already valid`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating user "${user.email}":`, error.message);
        errorCount++;
      }
    }

    // Summary
    console.log('\n📋 Update Summary:');
    console.log(`✅ Updated: ${updatedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);

    // Verify the update
    console.log('\n🔍 Verifying update...');
    const invalidUsers = await User.find({ role: { $nin: ['customer', 'admin'] } });
    const usersWithoutRole = await User.find({ role: { $exists: false } });
    
    if (invalidUsers.length === 0 && usersWithoutRole.length === 0) {
      console.log('✅ All users now have valid roles (customer or admin only)');
    } else {
      if (invalidUsers.length > 0) {
        console.log(`❌ Found ${invalidUsers.length} users with invalid roles:`);
        invalidUsers.forEach(user => {
          console.log(`   - ${user.email}: ${user.role}`);
        });
      }
      if (usersWithoutRole.length > 0) {
        console.log(`❌ Found ${usersWithoutRole.length} users without roles:`);
        usersWithoutRole.forEach(user => {
          console.log(`   - ${user.email}: no role`);
        });
      }
    }

    // Show role distribution
    const customerCount = await User.countDocuments({ role: 'customer' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    console.log('\n📊 Role Distribution:');
    console.log(`👥 Customers: ${customerCount}`);
    console.log(`👨‍💼 Admins: ${adminCount}`);

    return { customerCount, adminCount };

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    throw error;
  }
}

// Create default admin user if none exists
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('\n👨‍💼 Creating default admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const defaultAdmin = new User({
        email: 'admin@voucher-redeem.com',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        points: 0,
        aboutMe: 'System Administrator'
      });

      await defaultAdmin.save();
      console.log('✅ Default admin user created: admin@voucher-redeem.com / admin123');
    } else {
      console.log('\n⏭️  Admin user already exists, skipping default admin creation');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
}

// Main execution
async function main() {
  try {
    const roleCounts = await updateUserRoles();
    await createDefaultAdmin();
    
    console.log('\n🎉 User role update completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test admin login with: admin@voucher-redeem.com / admin123');
    console.log('3. Verify customer login functionality');
    
  } catch (error) {
    console.error('❌ Main execution failed:', error.message);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the script
main(); 