# Re-enable Authentication

This document explains how to re-enable authentication after temporarily disabling it for development.

## Current Status: 🔧 TEMPORARILY DISABLED

Authentication has been temporarily disabled for both admin and customer login. Users are automatically logged in with mock data.

## Files Modified

### 1. Customer Authentication
- **File**: `react-frontend/src/context/AuthContext.js`
- **Status**: Auto-login enabled with mock customer data
- **Mock User**: 
  - Email: `customer@example.com`
  - Points: 15,000
  - Name: Demo Customer

### 2. Admin Authentication
- **File**: `react-frontend/src/models/authModel.js`
- **Status**: Auto-login enabled with mock admin data
- **Mock User**:
  - Email: `admin@voucher-redeem.com`
  - Role: Administrator
  - Name: System Administrator

### 3. Login Pages
- **Customer Login**: `react-frontend/src/components/customer/CustomerLogin.js`
- **Admin Login**: `react-frontend/src/components/LoginPage/AdminLoginPage.js`
- **Status**: Both show disabled forms and auto-redirect

## How to Re-enable Authentication

### Step 1: Re-enable Customer Authentication

1. Open `react-frontend/src/context/AuthContext.js`
2. Find the `useEffect` function (around line 10)
3. Comment out the auto-login code and uncomment the original code:

```javascript
useEffect(() => {
  // Comment out this auto-login block
  /*
  console.log('AuthContext: TEMPORARILY DISABLED - Auto-login enabled');
  const mockUser = { ... };
  setUser(mockUser);
  setLoading(false);
  localStorage.setItem('feathers-jwt', 'mock-jwt-token');
  */

  // Uncomment this original authentication code
  const token = localStorage.getItem('feathers-jwt');
  console.log('AuthContext: Checking for existing token:', !!token);
  
  if (token) {
    client.authenticate()
      .then(response => {
        console.log('AuthContext: Token verification successful:', response.user);
        setUser(response.user);
      })
      .catch((error) => {
        console.log('AuthContext: Token verification failed:', error);
        localStorage.removeItem('feathers-jwt');
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    console.log('AuthContext: No token found');
    setLoading(false);
  }
}, []);
```

4. Also update the `login` function to use the original code
5. Update the `logout` function to use the original code

### Step 2: Re-enable Admin Authentication

1. Open `react-frontend/src/models/authModel.js`
2. Find the `login` function (around line 40)
3. Comment out the auto-login code and uncomment the original code:

```javascript
async login(data, reduxState) {
  return new Promise(async (resolve, reject) => {
    dispatch.loading.show();
    
    // Comment out this auto-login block
    /*
    console.log('AuthModel: TEMPORARILY DISABLED - Auto-login for admin');
    const mockAdminUser = { ... };
    setTimeout(() => {
      this.update({ isLoggedIn: true, user: mockAdminUser });
      dispatch.loading.hide();
      resolve({ user: mockAdminUser });
    }, 500);
    */

    // Uncomment this original login code
    try {
      let loginResponse = await client.authenticate({
        ...data,
        strategy: "local",
      });
      if (!loginResponse?.user?.status) {
        this.update({ isLoggedIn: false });
        dispatch.toast.alert({
          type: "error",
          message: "Invalid Login.",
        });
        resolve(loginResponse);
      } else {
        this.update({ isLoggedIn: true, user: loginResponse.user });
        resolve(loginResponse);
      }
    } catch (error) {
      console.log("error", { error });
      reject(error);
    }
    dispatch.loading.hide();
  });
}
```

4. Also update the `reAuth` and `logout` functions similarly

### Step 3: Re-enable Login Pages

1. **Customer Login**: Open `react-frontend/src/components/customer/CustomerLogin.js`
   - Remove the auto-redirect `useEffect`
   - Enable form inputs by removing `disabled={true}`
   - Uncomment the original login logic

2. **Admin Login**: Open `react-frontend/src/components/LoginPage/AdminLoginPage.js`
   - Remove the auto-redirect `useEffect`
   - Enable form inputs by removing `disabled={true}`
   - Uncomment the original login logic

### Step 4: Test Authentication

1. Restart the frontend server:
   ```bash
   cd react-frontend
   npm start
   ```

2. Test customer login:
   - Go to `http://localhost:3000`
   - Click "Customer Login"
   - Use credentials: `john.doe@example.com` / `password123`

3. Test admin login:
   - Go to `http://localhost:3000`
   - Click "Admin Login"
   - Use credentials: `admin@voucher-redeem.com` / `admin123`

## Quick Re-enable Script

You can create a simple script to quickly re-enable authentication:

```bash
# Create a backup of current disabled state
cp react-frontend/src/context/AuthContext.js react-frontend/src/context/AuthContext.js.disabled
cp react-frontend/src/models/authModel.js react-frontend/src/models/authModel.js.disabled

# Restore from git (if you have the original versions committed)
git checkout HEAD -- react-frontend/src/context/AuthContext.js
git checkout HEAD -- react-frontend/src/models/authModel.js
git checkout HEAD -- react-frontend/src/components/customer/CustomerLogin.js
git checkout HEAD -- react-frontend/src/components/LoginPage/AdminLoginPage.js
```

## Notes

- The backend authentication service still works normally
- Database connections and user data remain intact
- Only the frontend authentication flow has been modified
- Mock data is used only for development purposes
- All original code is preserved in comments for easy restoration

## Current Auto-login Behavior

- **Customer Routes**: Automatically redirects to `/customer/home` with 15,000 points
- **Admin Routes**: Automatically redirects to `/admin/dashboard` with admin privileges
- **Forms**: Show disabled state with "TEMPORARILY DISABLED" message
- **Logout**: Temporarily clears user but auto-login happens again 