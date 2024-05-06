import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './user.action';
import { LOADING_STATUS } from 'common/consts/constants.const';

const initialState = {
  user_name: '',
  permissions: [],
  loading: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUser: (state, { payload }) => {},
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = LOADING_STATUS.PENDING;
      })
      .addCase(getUserInfo.fulfilled, (state, { payload }) => {
        state.user_name = payload.user_name;
        state.permissions = payload.permissions;
        state.loading = LOADING_STATUS.IDLE;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = LOADING_STATUS.IDLE;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { setUser } = userSlice.actions;

export default userSlice.reducer;
