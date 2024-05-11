import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './user.action';
import { LOADING_STATUS } from 'common/consts/constants.const';

const initialState = {
  user_name: '',
  permissions: [],
  loading: '',
  isAdmin: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUser: (state, { payload }) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = LOADING_STATUS.PENDING;
      })
      .addCase(getUserInfo.fulfilled, (state, { payload }) => {
        payload.loading = LOADING_STATUS.IDLE;
        for (const field of Object.keys(initialState)) {
          state[field] = payload[field];
        }
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = LOADING_STATUS.IDLE;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { setUser } = userSlice.actions;

export default userSlice.reducer;
