import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.user = {
        user_name: 'trung',
        user_email: 'trung@gmail.com',
      };
    },
    setUser: (state, { payload }) => {
      console.log('🚀 ~ action:', payload);
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    },
  },
});

// Action creators are generated for each case reducer function
export const { getUser, setUser } = userSlice.actions;

export default userSlice.reducer;
