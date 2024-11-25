import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserInfo as getUserInfoService } from 'pages/Users/service';

export const getUserInfo = createAsyncThunk('users/fetchByIdStatus', async () => {
  const { data, errors } = await getUserInfoService();
  if (errors) throw new Error(errors.toString());
  return data;
});
