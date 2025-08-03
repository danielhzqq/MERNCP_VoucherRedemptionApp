#!/usr/bin/env node

const mongoose = require('mongoose');

console.log('🔍 User Role Verification Script\n');

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/voucher-redeem-merncp';

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  role: String,
  isActive: Boolean,
  points: Number
}, { strict: false });

const User = mongoose.model('users', userSchema);

async function verifyRoles() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully\n');

    // Find all users
    const users = await User.find({}, { email: 1, username: 1, role: 1, isActive: 1, points: 1, _id: 0 });
    
    console.log(`📊 Found ${users.length} users in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Role: ${user.role || 'undefined'}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Points: ${user.points || 0}`);
      console.log('');
    });

    // Check role distribution
    const customerCount = users.filter(u => u.role === 'customer').length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const invalidRoles = users.filter(u => u.role && !['customer', 'admin'].includes(u.role));
    const noRole = users.filter(u => !u.role).length;

    console.log('📊 Role Distribution:');
    console.log(`👥 Customers: ${customerCount}`);
    console.log(`👨‍💼 Admins: ${adminCount}`);
    console.log(`❌ Invalid Roles: ${invalidRoles.length}`);
    console.log(`❓ No Role: ${noRole}`);

    if (invalidRoles.length > 0) {
      console.log('\n❌ Users with invalid roles:');
      invalidRoles.forEach(user => {
        console.log(`   - ${user.email}: ${user.role}`);
      });
    }

    if (noRole > 0) {
      console.log('\n❓ Users without roles:');
      users.filter(u => !u.role).forEach(user => {
        console.log(`   - ${user.email}: no role`);
      });
    }

    // Summary
    console.log('\n📋 Summary:');
    if (invalidRoles.length === 0 && noRole === 0) {
      console.log('✅ All users have valid roles (customer or admin only)');
    } else {
      console.log('❌ Some users need role updates');
    }

    if (adminCount === 0) {
      console.log('⚠️  No admin users found');
    } else {
      console.log('✅ Admin users exist');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run verification
verifyRoles(); 