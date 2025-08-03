# AI Chatbox Visibility and Reset Guide

## 🎯 **Overview**

The AI chatbox has been configured to:
1. **Only show on customer pages** (not admin or auth pages)
2. **Only show for authenticated customers** (not admins or guests)
3. **Reset completely on logout** (clear messages, close chat, reset state)

## 🔒 **Visibility Rules**

### **✅ When AI Chatbox is SHOWN:**

#### **1. User Authentication:**
- ✅ User must be **logged in**
- ✅ User must have **customer role** (`user.role === 'customer'`)
- ✅ **Admin users in customer mode** (when on customer routes)
- ❌ Not shown for unauthenticated users

#### **2. Route Conditions:**
- ✅ **Customer routes**: `/customer/*` (all customer pages)
- ✅ **Home page**: `/` (landing page)
- ❌ **Admin routes**: `/admin/*`, `/users/*`, `/voucher/*`, etc.
- ❌ **Auth routes**: `/login`, `/signup`, `/reset`, `/admin/login`

#### **3. Page Types:**
- ✅ Customer dashboard
- ✅ Customer rewards page
- ✅ Customer my-vouchers page
- ✅ Customer profile pages
- ✅ Home/landing page
- ❌ Admin dashboard
- ❌ Admin management pages
- ❌ Login/signup pages

### **❌ When AI Chatbox is HIDDEN:**

#### **1. Authentication Issues:**
- User is not logged in
- User has admin role
- User session expired

#### **2. Route Restrictions:**
- Any admin-related route
- Any authentication page
- Any management interface

## 🔄 **Reset Functionality**

### **What Gets Reset on Logout:**

#### **1. Chat State:**
- ✅ **Chat window closes** (`open: false`)
- ✅ **Messages cleared** (back to initial welcome message)
- ✅ **Input field cleared** (`input: ""`)
- ✅ **Loading state reset** (`loading: false`)

#### **2. Initial State After Reset:**
```javascript
{
  open: false,
  messages: [{ sender: "ai", text: "Hi! How can I help you today?" }],
  input: "",
  loading: false
}
```

### **When Reset Occurs:**

#### **1. User Logout:**
- Manual logout via logout button
- Session expiration
- Token invalidation

#### **2. Authentication State Changes:**
- User becomes `null` in AuthContext
- User role changes from customer to admin
- User session cleared

## 🏗️ **Implementation Details**

### **1. AIChatboxWrapper Component**

**File**: `react-frontend/src/components/ai/AIChatboxWrapper.js`

```javascript
const AIChatboxWrapper = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Route detection logic
  const isCustomerRoute = location.pathname.startsWith('/customer') || 
                         location.pathname === '/';
  const isAuthRoute = /* auth route detection */;
  const isAdminRoute = /* admin route detection */;

  // Visibility conditions
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

### **2. AIChatbox Component with Reset**

**File**: `react-frontend/src/components/ai/AIChatbox.js`

```javascript
const AIChatbox = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset chatbox state when user logs out
  useEffect(() => {
    if (!user) {
      setOpen(false);
      setMessages([{ sender: "ai", text: "Hi! How can I help you today?" }]);
      setInput("");
      setLoading(false);
    }
  }, [user]);

  // ... rest of component
};
```

### **3. App.js Integration**

**File**: `react-frontend/src/App.js`

```javascript
// Only show CartPopup and AIChatbox on customer routes, not auth or admin routes
{!isAuthRoute && !isAdminRoute && <CartPopup />}
<AIChatboxWrapper />
```

## 🧪 **Testing Scenarios**

### **1. Customer User Testing:**

#### **✅ Should Show AI Chatbox:**
- Login as customer → Go to `/customer/home` → AI chatbox visible
- Login as customer → Go to `/customer/rewards` → AI chatbox visible
- Login as customer → Go to `/` (home) → AI chatbox visible

#### **❌ Should NOT Show AI Chatbox:**
- Login as customer → Go to `/admin/dashboard` → AI chatbox hidden
- Login as customer → Go to `/login` → AI chatbox hidden

### **2. Admin User Testing:**

#### **✅ Should Show AI Chatbox (Customer Mode):**
- Login as admin → Go to `/customer/home` → AI chatbox visible
- Login as admin → Go to `/customer/rewards` → AI chatbox visible
- Login as admin → Go to `/` (home) → AI chatbox visible

#### **❌ Should NOT Show AI Chatbox (Admin Mode):**
- Login as admin → Go to `/admin/dashboard` → AI chatbox hidden
- Login as admin → Go to admin management pages → AI chatbox hidden

### **3. Guest User Testing:**

#### **❌ Should NOT Show AI Chatbox:**
- Not logged in → Go to any page → AI chatbox hidden
- Login page → AI chatbox hidden
- Signup page → AI chatbox hidden

### **4. Logout Testing:**

#### **✅ Reset Behavior:**
1. Login as customer
2. Open AI chatbox
3. Send some messages
4. Logout
5. **Expected**: Chatbox closes, messages reset, state cleared

#### **✅ Re-login Behavior:**
1. After logout, login again as customer
2. Go to customer page
3. **Expected**: AI chatbox appears with fresh state

## 🔍 **Route Detection Logic**

### **Customer Routes** (AI chatbox shown):
```javascript
const isCustomerRoute = location.pathname.startsWith('/customer') || 
                       location.pathname === '/';
```

### **Auth Routes** (AI chatbox hidden):
```javascript
const isAuthRoute = location.pathname === '/login' ||
                   location.pathname === '/signup' ||
                   location.pathname === '/reset' ||
                   location.pathname === '/login-faq' ||
                   location.pathname === '/admin/login';
```

### **Admin Routes** (AI chatbox hidden):
```javascript
const isAdminRoute = location.pathname.startsWith('/admin') || 
                    location.pathname.startsWith('/users') ||
                    location.pathname.startsWith('/voucher') ||
                    location.pathname.startsWith('/cartitems') ||
                    // ... many more admin routes
```

## 🎯 **User Experience Flow**

### **1. Customer Login Flow:**
```
1. User visits login page → No AI chatbox
2. User logs in as customer → AI chatbox appears on customer pages
3. User navigates to customer pages → AI chatbox remains visible
4. User navigates to admin pages → AI chatbox disappears
5. User returns to customer pages → AI chatbox reappears
```

### **2. Logout Flow:**
```
1. User has open AI chatbox with messages
2. User clicks logout
3. AI chatbox immediately closes
4. All messages are cleared
5. Chat state resets to initial state
6. User is redirected to login page (no AI chatbox)
```

### **3. Admin Mode Switch Flow:**
```
1. Admin logs in → AI chatbox hidden (on admin pages)
2. Admin switches to customer mode → AI chatbox appears on customer pages
3. Admin switches back to admin mode → AI chatbox disappears
4. Admin returns to customer mode → AI chatbox reappears (fresh state)
```

## 🔧 **Configuration Options**

### **Environment Variables:**
```bash
# No specific environment variables needed for visibility
# AI chatbox visibility is controlled by React components
```

### **Customization Options:**
- **Add more customer routes**: Modify `isCustomerRoute` logic
- **Add more admin routes**: Modify `isAdminRoute` logic
- **Change reset behavior**: Modify `useEffect` in AIChatbox component
- **Custom welcome message**: Change initial message in state

## 🚀 **Benefits**

### **1. Security:**
- AI chatbox only available to authenticated customers
- No access for admins or guests
- Proper role-based access control

### **2. User Experience:**
- Clean interface without unnecessary elements
- Contextual availability based on user role
- Fresh start after logout

### **3. Performance:**
- Components only render when needed
- State management optimized for user context
- Efficient route-based rendering

### **4. Privacy:**
- Chat history cleared on logout
- No persistent state between sessions
- Clean separation of user contexts

---

**The AI chatbox now provides a secure, contextual, and user-friendly experience that respects user roles and authentication states!** 🎉 