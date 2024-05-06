import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from 'common/utils';

export const getUserInfo = createAsyncThunk('users/fetchByIdStatus', async () => {
  const { data, errors } = await getApi('/users/info');
  if (errors) throw new Error(errors.toString());
  return data;
});
