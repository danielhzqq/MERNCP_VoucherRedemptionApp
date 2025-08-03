# AI Chatbox Admin Customer Mode Guide

## 🎯 **Overview**

The AI chatbox now supports **admin users in customer mode**. Admin users can access the AI chatbox when they switch to customer mode using the admin-customer switch, allowing them to test customer features and experience the app from a customer perspective.

## 🔄 **What's New**

### **Enhanced Visibility Logic:**
- ✅ **Customer users**: AI chatbox shows on customer routes (unchanged)
- ✅ **Admin users in customer mode**: AI chatbox shows when on customer routes
- ✅ **Admin users in admin mode**: AI chatbox hidden on admin routes

### **Smart Route Detection:**
- **Customer Routes**: `/customer/*`, `/` (home) - AI chatbox visible for both customers and admins
- **Admin Routes**: `/admin/*`, `/users/*`, `/voucher/*` - AI chatbox hidden
- **Auth Routes**: `/login`, `/signup`, etc. - AI chatbox hidden

## 🏗️ **Technical Implementation**

### **Updated AIChatboxWrapper Logic:**

```javascript
const AIChatboxWrapper = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Route detection
  const isCustomerRoute = location.pathname.startsWith('/customer') || 
                         location.pathname === '/';
  const isAuthRoute = /* auth route detection */;
  const isAdminRoute = /* admin route detection */;

  // Enhanced visibility conditions
  const shouldShowAIChatbox = user && 
                             ((user.role === 'customer') || 
                              (user.role === 'admin' && isCustomerRoute)) && 
                             isCustomerRoute && 
                             !isAuthRoute && 
                             !isAdminRoute;

  if (!shouldShowAIChatbox) {
    return null;
  }

  return <AIChatbox />;
};
```

### **Key Changes:**

#### **1. Role-Based Logic:**
```javascript
// OLD: Only customers
user.role === 'customer'

// NEW: Customers OR admins on customer routes
((user.role === 'customer') || 
 (user.role === 'admin' && isCustomerRoute))
```

#### **2. Route-Based Detection:**
- **Customer Routes**: `/customer/*`, `/` (home)
- **Admin Routes**: `/admin/*`, `/users/*`, `/voucher/*`, etc.
- **Auth Routes**: `/login`, `/signup`, `/reset`, etc.

## 🎯 **User Experience Flow**

### **Admin User Experience:**

#### **1. Admin Mode:**
```
Login as admin → Admin dashboard → No AI chatbox
Manage users → No AI chatbox
Manage vouchers → No AI chatbox
```

#### **2. Customer Mode:**
```
Admin dashboard → Click "Customer Mode" → Customer home
→ AI chatbox appears → Can test customer features
→ Send messages → Get AI support
```

#### **3. Mode Switching:**
```
Customer mode → AI chatbox visible → Switch to admin mode
→ AI chatbox disappears → Switch back to customer mode
→ AI chatbox reappears (fresh state)
```

### **Customer User Experience (Unchanged):**
```
Login as customer → AI chatbox visible on customer pages
Navigate customer pages → AI chatbox remains visible
Logout → AI chatbox resets completely
```

## 🧪 **Testing Scenarios**

### **1. Admin User Testing:**

#### **✅ Customer Mode (AI Chatbox Visible):**
```
1. Login as admin
2. Click "Customer Mode" in admin switch
3. Navigate to /customer/home
4. ✅ AI chatbox should be visible
5. Send test message
6. ✅ Should get AI response
```

#### **✅ Customer Mode - Different Pages:**
```
1. Login as admin
2. Switch to customer mode
3. Go to /customer/rewards → ✅ AI chatbox visible
4. Go to /customer/my-vouchers → ✅ AI chatbox visible
5. Go to / (home) → ✅ AI chatbox visible
```

#### **❌ Admin Mode (AI Chatbox Hidden):**
```
1. Login as admin
2. Stay on /admin/dashboard
3. ❌ AI chatbox should be hidden
4. Go to /users → ❌ AI chatbox hidden
5. Go to /voucher → ❌ AI chatbox hidden
```

### **2. Mode Switching Testing:**

#### **✅ Admin → Customer Mode:**
```
1. Admin on /admin/dashboard → ❌ No AI chatbox
2. Click "Customer Mode" → Navigate to /customer/home
3. ✅ AI chatbox appears
4. Send messages → ✅ AI responds
```

#### **✅ Customer → Admin Mode:**
```
1. Admin on /customer/home → ✅ AI chatbox visible
2. Click "Admin Mode" → Navigate to /admin/dashboard
3. ❌ AI chatbox disappears
4. Chat state is preserved (will reset on logout)
```

### **3. Customer User Testing (Unchanged):**

#### **✅ Normal Customer Flow:**
```
1. Login as customer
2. Go to /customer/home → ✅ AI chatbox visible
3. Go to /customer/rewards → ✅ AI chatbox visible
4. Go to / (home) → ✅ AI chatbox visible
```

## 🔧 **Benefits**

### **1. For Admin Users:**
- **Test Customer Features**: Can test AI chatbox functionality
- **User Experience Testing**: Experience the app as customers do
- **Support Testing**: Test AI responses and customer support features
- **Quality Assurance**: Verify customer interface works correctly

### **2. For Development:**
- **Easier Testing**: Admins can test without creating customer accounts
- **Feature Validation**: Quick validation of customer features
- **User Experience**: Admins can understand customer perspective
- **Debugging**: Easier to debug customer-specific issues

### **3. For System:**
- **Consistent Experience**: Same AI chatbox for both user types
- **Maintained Security**: Still respects route-based access
- **Clean Architecture**: No duplicate components needed
- **Future-Proof**: Easy to extend for other user types

## 🔒 **Security Considerations**

### **1. Route-Based Security:**
- AI chatbox only shows on customer routes
- Admin routes remain secure without AI chatbox
- Authentication still required

### **2. Role-Based Access:**
- Admin users can only access AI chatbox on customer routes
- No AI chatbox access on admin management pages
- Maintains separation of concerns

### **3. Session Management:**
- AI chatbox resets on logout for all users
- No persistent state between different user types
- Clean session isolation

## 🚀 **Usage Examples**

### **Admin Testing Customer Support:**
```
1. Login as admin
2. Switch to customer mode
3. Open AI chatbox
4. Ask: "How do I redeem vouchers?"
5. Test AI response quality
6. Switch back to admin mode
7. Make improvements based on testing
```

### **Admin Testing Voucher Features:**
```
1. Login as admin
2. Switch to customer mode
3. Browse vouchers
4. Use AI chatbox for voucher recommendations
5. Test voucher redemption flow
6. Verify AI responses are helpful
```

### **Admin Testing User Experience:**
```
1. Login as admin
2. Switch to customer mode
3. Experience the app as a customer
4. Use AI chatbox for support
5. Identify UX improvements
6. Switch back to admin mode to implement changes
```

## 📊 **Configuration**

### **No Additional Configuration Needed:**
- Uses existing route detection logic
- Uses existing authentication system
- Uses existing AI chatbox component
- No new environment variables required

### **Customization Options:**
- **Add more customer routes**: Modify `isCustomerRoute` logic
- **Change admin access**: Modify role-based conditions
- **Custom reset behavior**: Modify logout handling
- **Add user type indicators**: Show different UI for admin vs customer

## 🎯 **Visibility Rules Summary**

### **✅ When AI Chatbox is SHOWN:**

#### **1. Customer Users:**
- ✅ User has `customer` role
- ✅ On customer routes (`/customer/*`, `/`)
- ✅ Not on auth or admin routes

#### **2. Admin Users in Customer Mode:**
- ✅ User has `admin` role
- ✅ Currently on customer routes (`/customer/*`, `/`)
- ✅ Using admin-customer switch to access customer interface
- ✅ Not on admin management routes

### **❌ When AI Chatbox is HIDDEN:**

#### **1. Admin Users in Admin Mode:**
- ❌ On admin dashboard (`/admin/dashboard`)
- ❌ On admin management pages (`/users/*`, `/voucher/*`, etc.)
- ❌ On any admin-specific routes

#### **2. All Users:**
- ❌ On authentication pages (`/login`, `/signup`, etc.)
- ❌ Not logged in
- ❌ Session expired

## 🔄 **Reset Functionality**

### **What Gets Reset on Logout:**
- ✅ **Chat window closes** when user logs out
- ✅ **All messages cleared** (back to initial welcome message)
- ✅ **Input field cleared**
- ✅ **Loading state reset**
- ✅ **Fresh state on re-login**

### **When Reset Occurs:**
- Manual logout via logout button
- Session expiration
- Token invalidation
- User becomes `null` in AuthContext

---

**The AI chatbox now provides a seamless experience for both customer and admin users, enabling admins to test and validate customer features while maintaining proper security and access controls!** 🎉 