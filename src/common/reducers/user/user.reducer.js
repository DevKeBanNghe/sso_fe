import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './user.action';

const initialState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {})
      .addCase(getUserInfo.fulfilled, (state, { payload }) => {
        const data = payload.data;
        if (data) {
          for (const field of Object.keys(data)) {
            state[field] = data[field];
          }
        }
      })
      .addCase(getUserInfo.rejected, (state) => {});
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
