const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all roles
router.get('/list', async (req, res) => {
  try {
    const Role = mongoose.model('roles');
    const roles = await Role.find({}).sort({ name: 1 });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new role
router.post('/create', async (req, res) => {
  try {
    const { name, description, isDefault = false } = req.body;
    
    if (!name || name.length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Role name is required and must be at least 3 characters long' 
      });
    }

    const Role = mongoose.model('roles');
    
    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ 
        success: false, 
        error: 'Role with this name already exists' 
      });
    }

    const newRole = new Role({
      name,
      description: description || '',
      isDefault
    });

    const savedRole = await newRole.save();
    res.json({ success: true, data: savedRole });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a role
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isDefault } = req.body;
    
    const Role = mongoose.model('roles');
    
    // Check if role exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({ 
        success: false, 
        error: 'Role not found' 
      });
    }

    // If name is being changed, check for duplicates
    if (name && name !== existingRole.name) {
      const duplicateRole = await Role.findOne({ name });
      if (duplicateRole) {
        return res.status(400).json({ 
          success: false, 
          error: 'Role with this name already exists' 
        });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, description, isDefault },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedRole });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a role
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const Role = mongoose.model('roles');
    
    // Check if role exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({ 
        success: false, 
        error: 'Role not found' 
      });
    }

    // Check if role is being used by any profiles
    const Profile = mongoose.model('profiles');
    const profilesUsingRole = await Profile.findOne({ role: id });
    
    if (profilesUsingRole) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete role as it is currently assigned to users' 
      });
    }

    await Role.findByIdAndDelete(id);
    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const Role = mongoose.model('roles');
    const role = await Role.findById(id);
    
    if (!role) {
      return res.status(404).json({ 
        success: false, 
        error: 'Role not found' 
      });
    }

    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 