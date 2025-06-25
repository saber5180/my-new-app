import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch properties for buying
export const fetchBuyProperties = createAsyncThunk(
  'propertyBuy/fetchBuyProperties',
  async (params, { rejectWithValue }) => {
    try {
      let url = '';
      if (
        !params ||
        (!params.postalCode && !params.propertyType && !params.price)
      ) {
        url = 'http://localhost:8080/api/dvf-achat';
      } else {
        const query = [];
        if (params.postalCode) query.push(`postalCode=${encodeURIComponent(params.postalCode)}`);
        if (params.propertyType) query.push(`propertyType=${encodeURIComponent(params.propertyType)}`);
        if (params.price) query.push(`price=${params.price}`);
        url = `http://localhost:8080/api/dvf-achat/search?${query.join('&')}`;
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

const propertyBuySlice = createSlice({
  name: 'propertyBuy',
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
    setBuySearchParams(state, action) {
      state.searchParams = action.payload;
    },
    clearBuySearchParams(state) {
      state.searchParams = { postalCode: '', propertyType: '', price: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchBuyProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur lors du chargement des propriétés';
      });
  }
});

export const { setBuySearchParams, clearBuySearchParams } = propertyBuySlice.actions;
export default propertyBuySlice.reducer; 