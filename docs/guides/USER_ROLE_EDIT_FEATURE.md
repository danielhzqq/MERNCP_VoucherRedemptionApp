# User Role Editing Feature

## 🎯 **Overview**

This feature allows administrators to change user roles directly from the user edit dialog in the admin interface. Users can be promoted from Customer to Administrator or demoted from Administrator to Customer.

## 🚀 **How to Use**

### **Accessing the Feature**
1. Navigate to the admin portal: `http://localhost:3000/admin`
2. Go to User Management section
3. Find the user you want to modify
4. Click the "Edit" button to open the user edit dialog

### **Changing User Roles**
1. **Locate the Role Section**: In the "Basic Information" section of the edit dialog
2. **Select New Role**: Use the dropdown to choose between:
   - **Customer**: Can browse and redeem vouchers using points
   - **Administrator**: Has full system access and can manage all users and vouchers
3. **Save Changes**: Click "Save Changes" to apply the role modification

## ⚠️ **Security Features**

### **Confirmation Dialogs**
- **Promoting to Admin**: Shows a detailed warning about administrative privileges
- **Demoting from Admin**: Confirms the removal of administrative access
- **Role Changes**: Visual indicators in the dialog header show when roles are being modified

### **Visual Indicators**
- **Warning Messages**: Appear when promoting users to admin role
- **Color-coded Tags**: Different colors for different role types
- **Header Indicators**: Shows role change status in the dialog header

## 🎨 **UI Components**

### **Role Dropdown**
- **Location**: Basic Information section
- **Options**: Customer, Administrator
- **Validation**: Required field with default value
- **Help Text**: Explains what each role can do

### **Visual Feedback**
- **Success Messages**: Specific messages for role promotions/demotions
- **Error Handling**: Clear error messages if role change fails
- **Loading States**: Shows progress during save operations

## 🔧 **Technical Implementation**

### **Frontend Changes**
- **Component**: `UsersEditDialogComponent.js`
- **New Import**: `Dropdown` from PrimeReact
- **Role Field**: Added to form data and validation
- **Confirmation Logic**: Built-in confirmation for sensitive role changes

### **Backend Integration**
- **API Endpoint**: Uses existing `users` service PATCH method
- **Role Field**: Included in user update payload
- **Validation**: Backend validates role enum values

### **Database Schema**
```javascript
role: {
  type: String,
  required: false,
  default: "customer",
  enum: ["customer", "admin"],
  index: true,
}
```

## 📋 **Role Permissions**

### **Customer Role**
- ✅ Browse available vouchers
- ✅ Add vouchers to cart
- ✅ Redeem vouchers using points
- ✅ Download PDF certificates
- ✅ View redemption history
- ✅ Manage personal profile
- ❌ Access admin features
- ❌ Manage other users
- ❌ Create/edit vouchers

### **Administrator Role**
- ✅ All customer permissions
- ✅ Access admin dashboard
- ✅ Manage all users
- ✅ Create/edit vouchers
- ✅ Manage voucher categories
- ✅ View system analytics
- ✅ Access all administrative functions
- ✅ Change user roles (including other admins)

## 🛡️ **Security Considerations**

### **Role Change Warnings**
- **Promotion Warning**: Detailed explanation of admin privileges
- **Demotion Warning**: Confirmation of privilege removal
- **Visual Cues**: Color-coded indicators for different role types

### **Validation**
- **Frontend**: Dropdown validation prevents invalid role values
- **Backend**: Mongoose schema validation ensures data integrity
- **Confirmation**: User must confirm sensitive role changes

### **Audit Trail**
- **Database**: Role changes are timestamped
- **Logging**: System logs role modifications
- **User Feedback**: Clear success/error messages

## 🧪 **Testing**

### **Manual Testing Steps**
1. **Login as Admin**: Access admin portal with admin credentials
2. **Edit Customer**: Open edit dialog for a customer user
3. **Promote to Admin**: Change role from Customer to Administrator
4. **Confirm Warning**: Acknowledge the promotion warning
5. **Save Changes**: Verify the role change is saved
6. **Test Admin Access**: Login as the promoted user to verify admin access
7. **Demote User**: Change role back to Customer
8. **Verify Demotion**: Confirm admin access is removed

### **Edge Cases**
- **Self-Demotion**: Admin cannot demote themselves (should be prevented)
- **Last Admin**: System should prevent demoting the last administrator
- **Invalid Roles**: Dropdown should only allow valid role values
- **Network Errors**: Proper error handling for failed role updates

## 🔄 **Workflow**

### **Promoting Customer to Admin**
1. Admin opens user edit dialog
2. Changes role from "Customer" to "Administrator"
3. Warning message appears
4. Admin confirms the promotion
5. System updates user role in database
6. Success message confirms the change
7. User now has admin access on next login

### **Demoting Admin to Customer**
1. Admin opens user edit dialog
2. Changes role from "Administrator" to "Customer"
3. Confirmation dialog appears
4. Admin confirms the demotion
5. System updates user role in database
6. Success message confirms the change
7. User loses admin access on next login

## 📝 **Future Enhancements**

### **Planned Features**
- **Role History**: Track role change history
- **Bulk Role Updates**: Change multiple users at once
- **Role Templates**: Predefined role configurations
- **Advanced Permissions**: Granular permission system
- **Role Expiration**: Temporary admin access
- **Audit Reports**: Detailed role change reports

### **Security Improvements**
- **Two-Factor Authentication**: For role changes
- **Approval Workflow**: Require multiple admin approvals
- **Role Restrictions**: Prevent certain role combinations
- **Time-based Restrictions**: Limit role changes to specific times

---

## 📞 **Support**

If you encounter any issues with the role editing feature:

1. **Check Console**: Look for JavaScript errors in browser console
2. **Verify Permissions**: Ensure you have admin access
3. **Database Connection**: Confirm backend is running and accessible
4. **User State**: Verify the user exists and is active

For technical support, refer to the main documentation or contact the development team. 