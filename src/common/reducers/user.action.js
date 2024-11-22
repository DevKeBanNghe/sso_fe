import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from 'common/utils';

export const getUserInfo = createAsyncThunk('users/fetchByIdStatus', async () => {
  const { data, errors } = await get('/users/info');
  if (errors) throw new Error(errors.toString());
  return data;
});
