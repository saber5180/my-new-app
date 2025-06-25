import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/authSlice';
import propertySearchReducer from './features/propertySearchSlice';
import propertyBuyReducer from './features/propertyBuySlice';
import favoritesReducer from './features/favoritesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'favorites'] // Persist auth and favorites state
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedFavoritesReducer = persistReducer(persistConfig, favoritesReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    propertySearch: propertySearchReducer,
    propertyBuy: propertyBuyReducer,
    favorites: persistedFavoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store; 