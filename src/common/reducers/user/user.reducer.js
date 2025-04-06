import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './user.action';
import { mappingValueReducer } from 'common/utils/redux-reducer.util';

const initialState = {
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, { payload }) => {
        state = mappingValueReducer({ state, payload });
        state.loading = false;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
