# User Role Management Guide

This guide explains how to add and manage user roles in the MERN Capstone Project.

## Current Role System

The system has two different approaches to user roles:

### 1. Simple String-Based Roles (Users Model)
Located in: `nodejs-backend/src/models/users.model.js`

**Current roles:**
- `customer` (default)
- `admin`
- `staff` (newly added)
- `manager` (newly added)
- `supervisor` (newly added)

**Usage:**
```javascript
// When creating a user
const user = {
  email: "user@example.com",
  username: "username",
  password: "password",
  role: "manager" // Can be: customer, admin, staff, manager, supervisor
};
```

### 2. Complex ObjectId-Based Roles (Roles Collection)
Located in: `nodejs-backend/src/models/roles.model.js`

**Current roles:**
- Staff
- External (default)
- Developer
- Super
- Admin
- Manager (newly added)
- Supervisor (newly added)

**Usage:**
```javascript
// When creating a profile
const profile = {
  userId: "user_id",
  role: "66b9c8b1dc0d1ef9ac30a8ab", // ObjectId reference to roles collection
  // ... other fields
};
```

## How to Add New Roles

### Option 1: Add to Simple String-Based Roles

1. Edit `nodejs-backend/src/models/users.model.js`
2. Add your new role to the enum array:

```javascript
role: {
  type: String,
  required: false,
  default: "customer",
  enum: ["customer", "admin", "staff", "manager", "supervisor", "your_new_role"],
  index: true,
},
```

### Option 2: Add to Complex Roles Collection

1. Edit `nodejs-backend/src/resources/codebridge-standard-app.roles.json`
2. Add your new role:

```json
{
  "_id": "unique_object_id",
  "name": "Your Role Name",
  "description": "Description of the role",
  "isDefault": false
}
```

### Option 3: Use the Script (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd nodejs-backend
   ```

2. Run the role addition script:
   ```bash
   node scripts/add-roles.js
   ```

3. The script will automatically:
   - Connect to your database
   - Check for existing roles
   - Add new roles if they don't exist
   - Provide console output of the process

## Managing Roles via UI

The system includes a React frontend for managing roles:

1. Access the roles management page in the admin panel
2. Use the existing UI components to:
   - View all roles
   - Create new roles
   - Edit existing roles
   - Delete roles

## Best Practices

1. **Use Complex Roles for Production**: The ObjectId-based roles provide more flexibility and better data integrity.

2. **Plan Role Hierarchy**: Design your roles with clear permissions and responsibilities.

3. **Use Descriptive Names**: Make role names clear and self-explanatory.

4. **Document Permissions**: Keep track of what each role can access and modify.

5. **Test Role Assignment**: Always test new roles to ensure they work correctly with your authentication and authorization system.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  password: String,
  role: String, // Simple string-based role
  // ... other fields
}
```

### Roles Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users
  role: ObjectId,   // Reference to roles collection
  // ... other fields
}
```

## API Endpoints

- `GET /roles` - Get all roles
- `POST /roles` - Create a new role
- `GET /roles/:id` - Get a specific role
- `PATCH /roles/:id` - Update a role
- `DELETE /roles/:id` - Delete a role

## Troubleshooting

1. **Role not appearing**: Check if the role was added to the correct collection
2. **Permission issues**: Verify that the role has the correct permissions assigned
3. **Database connection**: Ensure your database connection is working properly
4. **Validation errors**: Check that role names meet the minimum length requirements (3 characters)

## Security Considerations

1. **Role-based Access Control**: Implement proper RBAC to restrict access based on roles
2. **Input Validation**: Always validate role names and descriptions
3. **Audit Trail**: Consider logging role changes for security purposes
4. **Default Roles**: Be careful with default roles as they affect new user creation 