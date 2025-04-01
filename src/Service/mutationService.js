// services/mutationService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/mutations';

export const searchMutations = async (params) => {
  try {
    const response = await axios.get(`${API_BASE}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching mutations:', error);
    return [];
  }
};