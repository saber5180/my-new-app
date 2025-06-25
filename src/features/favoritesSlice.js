import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
  },
  reducers: {
    addToFavorites: (state, action) => {
      const propertyId = action.payload;
      if (!state.favorites.includes(propertyId)) {
        state.favorites.push(propertyId);
      }
    },
    removeFromFavorites: (state, action) => {
      const propertyId = action.payload;
      state.favorites = state.favorites.filter(id => id !== propertyId);
    },
    toggleFavorite: (state, action) => {
      const propertyId = action.payload;
      const index = state.favorites.indexOf(propertyId);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(propertyId);
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 