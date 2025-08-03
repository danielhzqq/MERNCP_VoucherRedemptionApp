const mongoose = require('mongoose');
const config = require('../config/default.json');

// Connect to MongoDB
mongoose.connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Role schema
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    unique: false,
    lowercase: false,
    uppercase: false,
    minLength: 3,
    maxLength: 1000000,
    index: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    unique: false,
    lowercase: false,
    uppercase: false,
    minLength: 3,
    maxLength: 1000000,
    index: true,
    trim: true,
  },
  isDefault: { type: Boolean, required: false, default: false },
}, {
  timestamps: true,
});

const Role = mongoose.model('roles', roleSchema);

// New roles to add
const newRoles = [
  {
    name: "Manager",
    description: "Department managers with elevated permissions for team management.",
    isDefault: false
  },
  {
    name: "Supervisor", 
    description: "Team supervisors with limited administrative access.",
    isDefault: false
  },
  {
    name: "Analyst",
    description: "Data analysts with access to reporting and analytics features.",
    isDefault: false
  },
  {
    name: "Support",
    description: "Customer support representatives with limited system access.",
    isDefault: false
  }
];

async function addRoles() {
  try {
    console.log('Connecting to database...');
    await mongoose.connection.asPromise();
    console.log('Connected to database successfully!');

    for (const roleData of newRoles) {
      // Check if role already exists
      const existingRole = await Role.findOne({ name: roleData.name });
      
      if (existingRole) {
        console.log(`Role "${roleData.name}" already exists, skipping...`);
        continue;
      }

      // Create new role
      const newRole = new Role(roleData);
      await newRole.save();
      console.log(`Role "${roleData.name}" added successfully!`);
    }

    console.log('All roles processed successfully!');
  } catch (error) {
    console.error('Error adding roles:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
addRoles(); 