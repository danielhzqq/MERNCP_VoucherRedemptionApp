const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/nodejs-backend';

async function updateRoleStatus() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    console.log('\n📊 Current Users and Roles:');
    console.log('============================');
    
    // Get all users with their roles
    const users = await usersCollection.find({}, { 
      projection: { email: 1, role: 1, isActive: 1, _id: 0 } 
    }).toArray();
    
    if (users.length === 0) {
      console.log('❌ No users found in the database');
      return;
    }
    
    // Display current users
    users.forEach((user, index) => {
      const role = user.role || 'no role';
      const status = user.isActive ? '✅ Active' : '❌ Inactive';
      console.log(`${index + 1}. ${user.email} | Role: ${role} | Status: ${status}`);
    });
    
    console.log('\n🔄 Role Status Update Options:');
    console.log('==============================');
    console.log('1. Add role field to users without role');
    console.log('2. Update specific user role');
    console.log('3. Update all users to customer role');
    console.log('4. Update all users to admin role');
    console.log('5. Toggle user active status');
    console.log('6. View detailed user information');
    
    // Get command from command line arguments
    const command = process.argv[2];
    const email = process.argv[3];
    const newRole = process.argv[4];
    
    switch (command) {
      case 'add-roles':
        await addRoleFieldToUsers(usersCollection);
        break;
        
      case 'update-role':
        if (email && newRole) {
          await updateSpecificUserRole(usersCollection, email, newRole);
        } else {
          console.log('❌ Usage: node update-role-status.js update-role <email> <role>');
          console.log('   Example: node update-role-status.js update-role danielhzq@gmail.com admin');
        }
        break;
        
      case 'all-customer':
        await updateAllUsersToRole(usersCollection, 'customer');
        break;
        
      case 'all-admin':
        await updateAllUsersToRole(usersCollection, 'admin');
        break;
        
      case 'toggle-status':
        if (email) {
          await toggleUserStatus(usersCollection, email);
        } else {
          console.log('❌ Usage: node update-role-status.js toggle-status <email>');
        }
        break;
        
      case 'details':
        if (email) {
          await showUserDetails(usersCollection, email);
        } else {
          console.log('❌ Usage: node update-role-status.js details <email>');
        }
        break;
        
      default:
        console.log('\n📋 Available Commands:');
        console.log('======================');
        console.log('node update-role-status.js add-roles                    # Add role field to users without role');
        console.log('node update-role-status.js update-role <email> <role>   # Update specific user role');
        console.log('node update-role-status.js all-customer                 # Set all users to customer role');
        console.log('node update-role-status.js all-admin                    # Set all users to admin role');
        console.log('node update-role-status.js toggle-status <email>        # Toggle user active status');
        console.log('node update-role-status.js details <email>              # Show detailed user information');
        console.log('\n💡 Examples:');
        console.log('node update-role-status.js update-role danielhzq@gmail.com admin');
        console.log('node update-role-status.js toggle-status danielhzq@gmail.com');
        console.log('node update-role-status.js details danielhzq@gmail.com');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

async function addRoleFieldToUsers(usersCollection) {
  console.log('\n🔄 Adding role field to users without role...');
  
  const result = await usersCollection.updateMany(
    { role: { $exists: false } },
    { $set: { role: "customer" } }
  );
  
  console.log(`✅ Added role field to ${result.modifiedCount} users`);
  
  // Show updated users
  const users = await usersCollection.find({}, { 
    projection: { email: 1, role: 1, _id: 0 } 
  }).toArray();
  
  console.log('\n📊 Updated Users:');
  users.forEach(user => {
    console.log(`- ${user.email}: ${user.role}`);
  });
}

async function updateSpecificUserRole(usersCollection, email, newRole) {
  console.log(`\n🔄 Updating role for ${email} to ${newRole}...`);
  
  if (!['customer', 'admin'].includes(newRole)) {
    console.log('❌ Invalid role. Use "customer" or "admin"');
    return;
  }
  
  const result = await usersCollection.updateOne(
    { email: email },
    { $set: { role: newRole } }
  );
  
  if (result.matchedCount === 0) {
    console.log(`❌ User with email ${email} not found`);
  } else if (result.modifiedCount === 0) {
    console.log(`ℹ️ User ${email} already has role: ${newRole}`);
  } else {
    console.log(`✅ Successfully updated ${email} to ${newRole} role`);
  }
}

async function updateAllUsersToRole(usersCollection, role) {
  console.log(`\n🔄 Updating all users to ${role} role...`);
  
  const result = await usersCollection.updateMany(
    {},
    { $set: { role: role } }
  );
  
  console.log(`✅ Updated ${result.modifiedCount} users to ${role} role`);
}

async function toggleUserStatus(usersCollection, email) {
  console.log(`\n🔄 Toggling active status for ${email}...`);
  
  // First, get current status
  const user = await usersCollection.findOne({ email: email });
  
  if (!user) {
    console.log(`❌ User with email ${email} not found`);
    return;
  }
  
  const newStatus = !user.isActive;
  
  const result = await usersCollection.updateOne(
    { email: email },
    { $set: { isActive: newStatus } }
  );
  
  console.log(`✅ Updated ${email} status to: ${newStatus ? 'Active' : 'Inactive'}`);
}

async function showUserDetails(usersCollection, email) {
  console.log(`\n📋 User Details for ${email}:`);
  console.log('================================');
  
  const user = await usersCollection.findOne({ email: email });
  
  if (!user) {
    console.log(`❌ User with email ${email} not found`);
    return;
  }
  
  console.log(`Email: ${user.email}`);
  console.log(`Username: ${user.username || 'Not set'}`);
  console.log(`Role: ${user.role || 'Not set'}`);
  console.log(`Status: ${user.isActive ? '✅ Active' : '❌ Inactive'}`);
  console.log(`Points: ${user.points || 0}`);
  console.log(`Phone: ${user.phoneNumber || 'Not set'}`);
  console.log(`Address: ${user.address || 'Not set'}`);
  console.log(`Created: ${user.createdAt || 'Not set'}`);
  console.log(`Updated: ${user.updatedAt || 'Not set'}`);
}

// Run the script
updateRoleStatus(); 