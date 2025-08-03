# How to Add Vouchers from Admin Console

## 🎯 Overview

This guide will walk you through the complete process of adding new vouchers to the voucher redemption system using the admin console.

## 🔗 Access Admin Console

### Step 1: Login to Admin Portal
1. **Open your browser** and navigate to: `http://localhost:3000/admin`
2. **Login with admin credentials** (or use auto-login if configured)
3. **You'll be redirected to**: `http://localhost:3000/admin/dashboard`

### Step 2: Navigate to Voucher Management
1. **From the admin dashboard**, look for the sidebar navigation
2. **Click on "Voucher Management"** or navigate to: `http://localhost:3000/voucher`
3. **You'll see the voucher management page** with a list of existing vouchers

## ➕ Adding a New Voucher

### Step 3: Open Create Voucher Dialog
1. **Look for the "Create" button** (usually a green "+" icon or "Add Voucher" button)
2. **Click the Create button** to open the voucher creation form
3. **A modal dialog will appear** with the voucher creation form

### Step 4: Fill in Voucher Details

#### **Required Fields** (marked with *)

##### 1. **Voucher Image URL** *
- **Field**: Image URL input
- **Purpose**: Display image for the voucher
- **Format**: Valid image URL (e.g., `https://example.com/voucher-image.jpg`)
- **Example**: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400`
- **Note**: Must be a publicly accessible image URL

##### 2. **Voucher Title** *
- **Field**: Title input
- **Purpose**: Name of the voucher displayed to customers
- **Example**: "Weekend Getaway Package"
- **Character Limit**: Typically 100-200 characters
- **Best Practice**: Make it descriptive and attractive

##### 3. **Category** *
- **Field**: Dropdown selection
- **Purpose**: Organize vouchers by type
- **Options**: Select from available categories (e.g., Travel, Food, Entertainment)
- **Note**: Categories must be created first in the category management section

##### 4. **Points Required** *
- **Field**: Number input
- **Purpose**: Cost in points for customers to redeem
- **Range**: 0 to 999,999 points
- **Example**: 25000 (for a premium voucher)
- **Best Practice**: Set realistic point values based on voucher value

##### 5. **Description** *
- **Field**: Textarea (3 rows)
- **Purpose**: Detailed description of what the voucher offers
- **Example**: "Enjoy a luxurious weekend getaway at our premium resort. Includes 2 nights accommodation, breakfast, and spa access."
- **Best Practice**: Be detailed and highlight key benefits

##### 6. **Terms and Conditions** *
- **Field**: Textarea (4 rows)
- **Purpose**: Legal terms and usage conditions
- **Example**: "Valid for 6 months from purchase. Non-refundable. Subject to availability. Blackout dates apply."
- **Best Practice**: Include all important restrictions and conditions

#### **Optional Fields**

##### 7. **Featured Voucher**
- **Field**: Checkbox
- **Purpose**: Mark as featured/latest voucher
- **Effect**: Featured vouchers appear prominently in customer dashboard
- **Recommendation**: Use for new or special vouchers

### Step 5: Create the Voucher
1. **Review all fields** to ensure accuracy
2. **Check for validation errors** (red error messages)
3. **Click "Create Voucher"** button
4. **Wait for confirmation** - you'll see a success message
5. **The dialog will close** and return to the voucher list

## 📋 Complete Example

Here's a complete example of filling out the voucher creation form:

### **Voucher Details Example**
```
Image URL: https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400
Title: Premium Weekend Getaway Package
Category: Travel
Points Required: 25000
Featured Voucher: ✓ (checked)
Description: Experience luxury with our premium weekend getaway package. 
Includes 2 nights at a 5-star resort, gourmet breakfast, spa access, 
and complimentary dinner. Perfect for couples or families seeking 
a memorable escape.

Terms and Conditions: Valid for 6 months from purchase date. 
Non-refundable and non-transferable. Subject to availability. 
Blackout dates apply during holidays and peak seasons. 
Reservations must be made at least 2 weeks in advance. 
Additional charges may apply for upgrades or special requests.
```

## 🔍 Verification Steps

### After Creating a Voucher
1. **Check the voucher list** - your new voucher should appear
2. **Verify customer view** - visit `http://localhost:3000/customer/home`
3. **Test the voucher** - ensure it displays correctly for customers
4. **Check featured status** - if marked as featured, verify it appears prominently

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### **1. "Category field is required" Error**
- **Problem**: No categories available in dropdown
- **Solution**: 
  1. Navigate to category management first
  2. Create at least one category
  3. Return to voucher creation

#### **2. "Image field is required" Error**
- **Problem**: Invalid or inaccessible image URL
- **Solution**:
  1. Use a publicly accessible image URL
  2. Test the URL in a new browser tab
  3. Use image hosting services like Unsplash, Imgur, or your own server

#### **3. "Points field is required" Error**
- **Problem**: Points value is 0 or negative
- **Solution**:
  1. Enter a positive number greater than 0
  2. Use reasonable values (e.g., 1000-50000 points)

#### **4. Form won't submit**
- **Problem**: Validation errors preventing submission
- **Solution**:
  1. Check all required fields are filled
  2. Look for red error messages
  3. Ensure all field formats are correct

## 📊 Voucher Management Tips

### **Best Practices**
1. **Use high-quality images** - Clear, attractive images increase redemption rates
2. **Write compelling descriptions** - Highlight benefits and unique features
3. **Set appropriate point values** - Balance value with accessibility
4. **Use categories effectively** - Help customers find relevant vouchers
5. **Keep terms clear** - Avoid confusion with clear, concise terms

### **Voucher Types to Consider**
- **Travel vouchers**: Hotel stays, flights, vacation packages
- **Food & Dining**: Restaurant vouchers, meal packages
- **Entertainment**: Movie tickets, event passes, activity vouchers
- **Shopping**: Retail vouchers, gift cards
- **Services**: Spa treatments, fitness classes, beauty services

### **Point Value Guidelines**
- **Low-tier vouchers**: 1,000 - 5,000 points
- **Mid-tier vouchers**: 5,000 - 15,000 points
- **High-tier vouchers**: 15,000 - 50,000 points
- **Premium vouchers**: 50,000+ points

## 🔄 Next Steps After Creating Vouchers

### **1. Test Customer Experience**
1. Visit customer dashboard: `http://localhost:3000/customer/home`
2. Verify voucher appears correctly
3. Test search and filtering functionality
4. Check voucher details page

### **2. Monitor Performance**
1. Track voucher views in admin analytics
2. Monitor redemption rates
3. Gather customer feedback
4. Adjust pricing or descriptions as needed

### **3. Manage Existing Vouchers**
1. Edit vouchers as needed
2. Update point values
3. Change featured status
4. Archive or delete unused vouchers

## 📞 Support

### **Getting Help**
1. **Check this guide** for common issues
2. **Review admin documentation** for advanced features
3. **Check browser console** for technical errors
4. **Verify database connection** if vouchers aren't saving

### **Useful URLs**
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Voucher Management**: `http://localhost:3000/voucher`
- **Customer Dashboard**: `http://localhost:3000/customer/home`
- **Category Management**: `http://localhost:3000/catergory`

---

## ✅ Quick Reference Checklist

- [ ] **Access admin console** at `http://localhost:3000/admin`
- [ ] **Navigate to voucher management** page
- [ ] **Click "Create" button** to open form
- [ ] **Fill in all required fields**:
  - [ ] Image URL
  - [ ] Title
  - [ ] Category
  - [ ] Points Required
  - [ ] Description
  - [ ] Terms and Conditions
- [ ] **Set optional fields** (Featured status)
- [ ] **Click "Create Voucher"**
- [ ] **Verify voucher appears** in list
- [ ] **Test customer view** at customer dashboard

---

**Last Updated**: July 31, 2025
**Version**: 1.0.0 