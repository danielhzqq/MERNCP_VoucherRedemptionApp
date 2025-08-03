import client from "../services/restClient";


const initState = {
  user: {},
  isLoggedIn: false,
};

export const auth = {
  state: {
    ...initState,
  },
  reducers: {
    // handle state changes with pure functions
    update(state, newState) {
      return { ...state, ...newState };
    },
  },
  effects: (dispatch) => ({
    //////////////////
    //// GET USER ////
    //////////////////
    async getUser(_, reduxState) {
      return new Promise(async (resolve, reject) => {
        try {
          const { user } = reduxState.auth;
          let _user = await client.service("users").get(user._id);
          this.update({ user: _user });
          resolve();
        } catch (error) {
          console.log("Failed to get user", { error });
          dispatch.toast.alert({
            type: "error",
            title: "Get user",
            message: error.message || "Failed to get user",
          });
          reject(error);
        }
      });
    },
    ///////////////
    //// LOGIN //// using feathers rest client
    ///////////////
    async login(data, reduxState) {
      return new Promise(async (resolve, reject) => {
        dispatch.loading.show();
        
        // TEMPORARILY DISABLED: Auto-login for development
        console.log('AuthModel: TEMPORARILY DISABLED - Auto-login for admin');
        
        // Mock admin user data
        const mockAdminUser = {
          _id: 'mock-admin-id',
          email: data.email || 'admin@voucher-redeem.com',
          username: 'admin',
          name: 'System Administrator',
          isActive: true,
          status: true,
          role: 'admin',
          position: 'Administrator'
        };
        
        // Simulate API delay
        setTimeout(() => {
          this.update({ isLoggedIn: true, user: mockAdminUser });
          dispatch.loading.hide();
          resolve({ user: mockAdminUser });
        }, 500);
        
        // Original login code (commented out)
        /*
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
        */
      });
    },
    //////////////////////////
    //// LOGIN FOR O AUTH ////
    //////////////////////////
    async loginForOAuth(data, reduxState) {
      return new Promise(async (resolve, reject) => {
        dispatch.loading.show();
        try {
          let loginResponse = await client.authenticate({
            ...data,
            strategy: "local",
          });
          this.update({ isLoggedIn: true, user: loginResponse.user });
          resolve();
        } catch (error) {
          reject(error);
        }
        dispatch.loading.hide();
      });
    },
    /////////////////////////
    //// RE-AUTHENTICATE ////
    /////////////////////////
    async reAuth(data, reduxState) {
      return new Promise(async (resolve, reject) => {
        dispatch.loading.show();
        
        // TEMPORARILY DISABLED: Auto-login for development
        console.log('AuthModel: TEMPORARILY DISABLED - Auto-reAuth for admin');
        
        // Mock admin user data
        const mockAdminUser = {
          _id: 'mock-admin-id',
          email: 'admin@voucher-redeem.com',
          username: 'admin',
          name: 'System Administrator',
          isActive: true,
          status: true,
          role: 'admin',
          position: 'Administrator'
        };
        
        // Simulate API delay
        setTimeout(() => {
          this.update({ isLoggedIn: true, user: mockAdminUser });
          dispatch.loading.hide();
          resolve();
        }, 500);
        
        // Original reAuth code (commented out)
        /*
        try {
          let loginResponse = await client.reAuthenticate();
          if (!loginResponse?.user?.status) {
            this.update({ isLoggedIn: false, user: loginResponse.user });
            dispatch.toast.alert({
              type: "error",
              message: "login was denied, please contact admin.",
            });
          } else if (loginResponse?.user?.status) {
            this.update({ isLoggedIn: true, user: loginResponse.user });
          }
          resolve();
        } catch (error) {
          console.log("error", { error });
          reject(error);
        }
        dispatch.loading.hide();
        */
      });
    },
    ////////////////
    //// LOGOUT ////
    ////////////////
    async logout(_, reduxState) {
      dispatch.loading.show();
      
      // TEMPORARILY DISABLED: Auto-login for development
      console.log('AuthModel: TEMPORARILY DISABLED - Logout (but auto-login will continue)');
      
      const { user } = reduxState.auth;
      dispatch.toast.alert({
        title: "Authenticator",
        type: "success",
        message: `${user?.name || 'Admin'} logged out!`,
      });
      
      this.update(initState);
      window.localStorage.clear();
      window.sessionStorage.clear();
      dispatch.loading.hide();
      
      // Auto-login again after a short delay
      setTimeout(() => {
        const mockAdminUser = {
          _id: 'mock-admin-id',
          email: 'admin@voucher-redeem.com',
          username: 'admin',
          name: 'System Administrator',
          isActive: true,
          status: true,
          role: 'admin',
          position: 'Administrator'
        };
        this.update({ isLoggedIn: true, user: mockAdminUser });
      }, 2000);
      
      // Original logout code (commented out)
      /*
      const { user } = reduxState.auth;
      await client
        .logout()
        .then(async () => {
          dispatch.toast.alert({
            title: "Authenticator",
            type: "success",
            message: `${user?.name} logged out!`,
          });
          this.update(initState);
        })
        .catch((error) => {
          console.log("error", { error });
          dispatch.toast.alert({
            type: "error",
            message: error.message || "Failed to logout!",
          });
          this.update(initState);
        });
      window.localStorage.clear();
      window.sessionStorage.clear();
      dispatch.loading.hide();
      */
    },

    //////////////////////
    //// CREATE USER /////
    //////////////////////
    async createUser(data, reduxState) {
      return new Promise(async (resolve, reject) => {
        dispatch.loading.show();
        try {
          await client.service("users").create(data);
          dispatch.toast.alert({
            type: "success",
            title: "Sign Up",
            message: "Successful",
          });
          resolve();
        } catch (error) {
          console.log("error", { error });
          dispatch.toast.alert({
            type: "error",
            title: "Sign Up",
            message: error.message || "Failed to sign up",
          });
          reject(error);
        }
        dispatch.loading.hide();
      });
    },
    ///////////////////////////////
    //// CREATE USER FOR O AUTH ////
    ////////////////////////////////
    async createUserForOauth(data, reduxState) {
      return new Promise(async (resolve, reject) => {
        dispatch.loading.show();
        try {
          const results = await client.service("users").create(data);
          const userProfileData = {
            userId: results._id,
            imageUrl: data.imageUrl,
            uId: data.uId,
            provider: data.provider,
          };

          await client.service("usersProfile").create(userProfileData);
          dispatch.toast.alert({
            type: "success",
            title: "Sign Up",
            message: "Successful",
          });
          resolve();
        } catch (error) {
          console.log("error", { error });
          dispatch.toast.alert({
            type: "error",
            title: "Sign Up",
            message: "You are already signed in!",
          });
          reject(error);
        }
        dispatch.loading.hide();
      });
    },
    ////////////////////
    //// PATCH USER ////
    ////////////////////
    async patchUser({ _id, data }, reduxState) {
      return new Promise(async (resolve, reject) => {
        if (!_id) {
          dispatch.toast.alert({
            type: "error",
            message: "User id is required",
          });
          reject("User id is required");
          return;
        }
        console.log(_id, data)
        await client
          .service("users")
          .patch(_id, data)
          .then((user) => {
            console.log(user);
            this.update({ user });
            dispatch.toast.alert({
              type: "success",
              title: "Password Reset",
              message: "Successful",
            });
            resolve(user);
          })
          .catch((e) => {
            console.log("errrrrrr>>>>>", e);
            dispatch.toast.alert({
              type: "error",
              title: "Password Reset",
              message: "Failed" + e,
            });
            reject(e);
          });
      });
    },
    /////////////////////////
    //// CHANGE PASSWORD ////
    /////////////////////////
    async changeUserPassword({ oldPassword, newPassword }, reduxState) {
      return new Promise(async (resolve, reject) => {
        dispatch.loading.show();
        await client
          .service("users")
          .patch(reduxState.auth.user._id, {
            oldPassword,
            newPassword,
            changePassword: true,
            clientName: "codebridge-website",
          })
          .then((res) => {
            dispatch.toast.alert({
              type: "success",
              title: "Password",
              message: "User password updated successfully!",
            });
            resolve();
          })
          .catch((err) => {
            console.log("Failed to update user password", err);
            dispatch.toast.alert({
              type: "error",
              title: "Password",
              message: err.message || "Failed to update user password",
            });
            this.update({
              passwordPolicyErrors: Array.isArray(err.data) ? err.data : [],
            });
            reject(err);
          });

        dispatch.loading.hide();
      });
    },
  }),
};
