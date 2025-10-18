// src/components/vehicle/services/autoTraderAPI.js
import axios from 'axios';

// You'll need to replace these with your actual API credentials
const API_KEY = process.env.REACT_APP_AUTOTRADER_API_KEY;
const API_BASE_URL = 'https://api.autotrader.co.uk/vehicles';

/**
 * Search for vehicles on AutoTrader within a specified budget and make
 * 
 * @param {Object} params - Search parameters
 * @param {number} params.maxPrice - Maximum vehicle price
 * @param {string} params.make - Vehicle make (brand)
 * @param {number} params.pageSize - Number of results to return (default: 10)
 * @param {number} params.page - Page number for pagination (default: 1)
 * @returns {Promise} Promise resolving to search results
 */
export const searchVehicles = async ({ maxPrice, make, pageSize = 10, page = 1 }) => {
  try {
    // Construct the API request
    const response = await axios.get(`${API_BASE_URL}/search`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      params: {
        make,
        maxPrice,
        pageSize,
        page,
        // Additional parameters you might want to include
        // condition: 'Used', // or 'New'
        // postcode: 'SW1A 1AA', // for location-based search
        // radius: 50, // search radius in miles
        sortBy: 'price', // Sort by price ascending
      }
    });

    return {
      vehicles: response.data.vehicles || [],
      totalCount: response.data.totalCount || 0,
      currentPage: response.data.currentPage || 1,
      totalPages: response.data.totalPages || 1
    };
  } catch (error) {
    console.error('AutoTrader API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vehicles from AutoTrader');
  }
};

/**
 * Get detailed information about a specific vehicle
 * 
 * @param {string} vehicleId - AutoTrader vehicle ID
 * @returns {Promise} Promise resolving to vehicle details
 */
export const getVehicleDetails = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${vehicleId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('AutoTrader API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vehicle details');
  }
};