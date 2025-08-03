#!/usr/bin/env node

const mongoose = require('mongoose');

console.log('🔧 Fix User Roles Script\n');

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/voucher-redeem-merncp';

async function fixUserRoles() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully\n');

    // Get the database connection
    const db = mongoose.connection.db;
    
    // Find users without role field
    const usersWithoutRole = await db.collection('users').find({ role: { $exists: false } }).toArray();
    console.log(`📊 Found ${usersWithoutRole.length} users without role field\n`);

    if (usersWithoutRole.length > 0) {
      console.log('🔧 Adding role field to users...\n');
      
      for (const user of usersWithoutRole) {
        // Determine role based on email
        let role = 'customer';
        if (user.email && user.email.includes('admin')) {
          role = 'admin';
        }
        
        // Update the user
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { role: role } }
        );
        
        console.log(`✅ Updated user "${user.email}" → role: ${role}`);
      }
    }

    // Find users with invalid roles
    const usersWithInvalidRole = await db.collection('users').find({ 
      role: { $exists: true, $nin: ['customer', 'admin'] } 
    }).toArray();
    
    console.log(`\n📊 Found ${usersWithInvalidRole.length} users with invalid roles\n`);

    if (usersWithInvalidRole.length > 0) {
      console.log('🔧 Fixing invalid roles...\n');
      
      for (const user of usersWithInvalidRole) {
        // Convert invalid roles to admin or customer
        let newRole = 'customer';
        if (user.role === 'staff' || user.role === 'manager' || user.role === 'supervisor' || 
            (user.email && user.email.includes('admin'))) {
          newRole = 'admin';
        }
        
        // Update the user
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { role: newRole } }
        );
        
        console.log(`✅ Updated user "${user.email}" role: ${user.role} → ${newRole}`);
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...\n');
    
    const allUsers = await db.collection('users').find({}).toArray();
    const customerCount = allUsers.filter(u => u.role === 'customer').length;
    const adminCount = allUsers.filter(u => u.role === 'admin').length;
    const invalidCount = allUsers.filter(u => u.role && !['customer', 'admin'].includes(u.role)).length;
    const noRoleCount = allUsers.filter(u => !u.role).length;

    console.log('📊 Final Role Distribution:');
    console.log(`👥 Customers: ${customerCount}`);
    console.log(`👨‍💼 Admins: ${adminCount}`);
    console.log(`❌ Invalid Roles: ${invalidCount}`);
    console.log(`❓ No Role: ${noRoleCount}`);

    if (invalidCount === 0 && noRoleCount === 0) {
      console.log('\n✅ All users now have valid roles!');
    } else {
      console.log('\n❌ Some users still need role updates');
    }

    // Show all users
    console.log('\n📋 All Users:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - Role: ${user.role || 'undefined'}`);
    });

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the script
fixUserRoles(); 