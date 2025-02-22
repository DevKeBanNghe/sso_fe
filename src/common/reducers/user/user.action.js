import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserInfo as getUserInfoService } from 'pages/Users/service';

export const getUserInfo = createAsyncThunk('users/fetchByIdStatus', async () => {
  const data = await getUserInfoService();
  return data;
});
