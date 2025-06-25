import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch properties
export const fetchProperties = createAsyncThunk(
  'propertySearch/fetchProperties',
  async (params, { rejectWithValue }) => {
    try {
      let url = '';
      if (
        !params ||
        (!params.postalCode && !params.propertyType && !params.price)
      ) {
        url = 'http://localhost:8080/api/dvf-louer';
      } else {
        const query = [];
        if (params.postalCode) query.push(`postalCode=${encodeURIComponent(params.postalCode)}`);
        if (params.propertyType) query.push(`propertyType=${encodeURIComponent(params.propertyType)}`);
        if (params.price) query.push(`price=${params.price}`);
        url = `http://localhost:8080/api/dvf-louer/search?${query.join('&')}`;
      }
      const response = await axios.get(url);
      
      // Ensure response.data is always an array
      let properties = Array.isArray(response.data) ? response.data : [response.data];
      
      // Parse images string for each property
      properties = properties.map(property => ({
        ...property,
        images: property.images ? JSON.parse(property.images) : []
      }));
      
      return properties;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const propertySearchSlice = createSlice({
  name: 'propertySearch',
  initialState: {
    searchParams: {
      postalCode: '',
      propertyType: '',
      price: ''
    },
    properties: [],
    loading: false,
    error: null
  },
  reducers: {
    setSearchParams(state, action) {
      state.searchParams = action.payload;
    },
    clearSearchParams(state) {
      state.searchParams = { postalCode: '', propertyType: '', price: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur lors du chargement des propriétés';
      });
  }
});

export const { setSearchParams, clearSearchParams } = propertySearchSlice.actions;
export default propertySearchSlice.reducer; 