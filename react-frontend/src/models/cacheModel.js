import axios from "axios";

export const cache = {
  state: {
    cache: {},
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    cache(state, cache) {
      let toReturn = { ...state, ...cache };
      return toReturn;
    },
  },
  effects: (dispatch) => ({
        /////////////////////////
        //// GET USER CACHE ////
        ////////////////////////
        async get(_, reduxState) {
          return new Promise(async (resolve, reject) => {
              let newState;
              const { user } = reduxState.auth;
              const url = `${process.env.REACT_APP_SERVER_URL}/cache/${user._id}`;
              try {
                  const results = await axios.get(url);
                  newState = results.data;
                  this.cache(newState);
                  resolve(newState);
              } catch (error) {
                  console.error(error);
                  reject(error)
              }
          });
      },
    async set(data, reduxState) {
      let newState;
      const { user } = reduxState.auth;
      const url = `${process.env.REACT_APP_SERVER_URL}/cache/${user._id}`;
      try {
        const results = await axios.post(url, data);
        newState = results.data;
      } catch (error) {
        console.error(error);
      }
      this.cache(newState);
    },
  }),
};
