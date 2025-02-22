import { configureStore } from '@reduxjs/toolkit';
import { reducers } from 'reduxApp/reducers';
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const globalState = store.getState();
