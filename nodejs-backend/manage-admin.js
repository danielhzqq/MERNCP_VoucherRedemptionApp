const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Load models
const userModel = require('./src/models/users.model');
const roleModel = require('./src/models/roles.model');
const profileModel = require('./src/models/profiles.model');
const positionModel = require('./src/models/positions.model');

async function manageAdminAccounts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/voucher-redeem-merncp');
    console.log('✅ Connected to MongoDB successfully!');

    // Create a mock app object to register models
    const mockApp = {
      get: (key) => {
        if (key === 'mongooseClient') return mongoose;
        return null;
      }
    };

    // Register models
    const User = userModel(mockApp);
    const Role = roleModel(mockApp);
    const Profile = profileModel(mockApp);
    const Position = positionModel(mockApp);

    console.log('✅ Models registered successfully!\n');

    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'list':
        await listAdminAccounts(User, Profile, Role, Position);
        break;
      case 'add':
        await addAdminAccount(User, Profile, Role, Position, args);
        break;
      case 'update':
        await updateAdminAccount(User, Profile, args);
        break;
      case 'delete':
        await deleteAdminAccount(User, Profile, args);
        break;
      default:
        console.log('📋 Admin Account Management Tool');
        console.log('Usage: node manage-admin.js <command> [options]');
        console.log('\nCommands:');
        console.log('  list                    - List all admin accounts');
        console.log('  add [email] [password]  - Add new admin account');
        console.log('  update [email] [field] [value] - Update admin account');
        console.log('  delete [email]          - Delete admin account');
        console.log('\nExamples:');
        console.log('  node manage-admin.js list');
        console.log('  node manage-admin.js add admin2@example.com password123');
        console.log('  node manage-admin.js update admin@example.com password newpassword123');
        console.log('  node manage-admin.js delete admin2@example.com');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function listAdminAccounts(User, Profile, Role, Position) {
  console.log('📋 Listing all admin accounts...\n');
  
  const adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole) {
    console.log('❌ No admin role found');
    return;
  }

  const adminProfiles = await Profile.find({ role: adminRole._id }).populate('userId');
  
  if (adminProfiles.length === 0) {
    console.log('❌ No admin accounts found');
    return;
  }

  console.log(`Found ${adminProfiles.length} admin account(s):\n`);
  
  for (const profile of adminProfiles) {
    const user = profile.userId;
    console.log(`👤 Admin Account:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Name: ${profile.name}`);
    console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
    console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
    console.log(`   Profile ID: ${profile._id}`);
    console.log(`   User ID: ${user._id}`);
    console.log('');
  }
}

async function addAdminAccount(User, Profile, Role, Position, args) {
  const email = args[1];
  const password = args[2] || 'admin123';
  const username = args[3] || email.split('@')[0];

  if (!email) {
    console.log('❌ Email is required');
    console.log('Usage: node manage-admin.js add <email> [password] [username]');
    return;
  }

  console.log(`🔄 Adding admin account for: ${email}`);

  // Check if admin role exists, if not create it
  let adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole) {
    console.log('🔄 Creating admin role...');
    adminRole = await Role.create({
      name: 'admin',
      description: 'Administrator with full system access',
      isDefault: false
    });
    console.log('✅ Admin role created:', adminRole._id);
  }

  // Check if admin position exists, if not create it
  let adminPosition = await Position.findOne({ name: 'Administrator' });
  if (!adminPosition) {
    console.log('🔄 Creating admin position...');
    adminPosition = await Position.create({
      name: 'Administrator',
      description: 'System Administrator Position',
      isDefault: false
    });
    console.log('✅ Admin position created:', adminPosition._id);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('⚠️  User already exists with this email');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    email,
    username,
    password: hashedPassword,
    phoneNumber: '+1234567890',
    isActive: true,
    points: 0,
    address: 'Admin Address',
    aboutMe: 'System Administrator'
  });

  // Create profile
  const newProfile = await Profile.create({
    name: `Admin - ${username}`,
    userId: newUser._id,
    role: adminRole._id,
    position: adminPosition._id,
    hod: false,
    hos: false
  });

  console.log('✅ Admin account created successfully!');
  console.log('📋 Credentials:');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Username: ${username}`);
  console.log(`   User ID: ${newUser._id}`);
  console.log(`   Profile ID: ${newProfile._id}`);
}

async function updateAdminAccount(User, Profile, args) {
  const email = args[1];
  const field = args[2];
  const value = args[3];

  if (!email || !field || !value) {
    console.log('❌ Email, field, and value are required');
    console.log('Usage: node manage-admin.js update <email> <field> <value>');
    return;
  }

  console.log(`🔄 Updating admin account: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found');
    return;
  }

  switch (field.toLowerCase()) {
    case 'password':
      const hashedPassword = await bcrypt.hash(value, 10);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      console.log('✅ Password updated successfully');
      break;
    case 'username':
      await User.findByIdAndUpdate(user._id, { username: value });
      console.log('✅ Username updated successfully');
      break;
    case 'active':
      const isActive = value.toLowerCase() === 'true';
      await User.findByIdAndUpdate(user._id, { isActive });
      console.log(`✅ Active status updated to: ${isActive}`);
      break;
    default:
      console.log('❌ Invalid field. Supported fields: password, username, active');
  }
}

async function deleteAdminAccount(User, Profile, args) {
  const email = args[1];

  if (!email) {
    console.log('❌ Email is required');
    console.log('Usage: node manage-admin.js delete <email>');
    return;
  }

  console.log(`🔄 Deleting admin account: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found');
    return;
  }

  // Delete profile first
  await Profile.deleteMany({ userId: user._id });
  console.log('✅ Profile deleted');

  // Delete user
  await User.findByIdAndDelete(user._id);
  console.log('✅ User deleted successfully');
}

manageAdminAccounts(); 