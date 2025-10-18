// src/components/vehicle/services/edmundsAPI.js
import axios from 'axios';

// You'll need to replace these with your actual API credentials
const API_KEY = process.env.REACT_APP_EDMUNDS_API_KEY;
const API_BASE_URL = 'https://api.edmunds.com/api/vehicle/v2';

/**
 * Search for vehicles on Edmunds within a specified budget and make
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
    // First, get all models for the specified make
    const modelsResponse = await axios.get(`${API_BASE_URL}/${make.toLowerCase()}/models`, {
      params: {
        fmt: 'json',
        api_key: API_KEY
      }
    });

    const models = modelsResponse.data.models || [];
    
    // Then, for each model, get the available vehicles
    let allVehicles = [];
    
    // We'll limit our concurrent requests to avoid rate limiting
    const modelPromises = models.slice(0, 5).map(model => 
      axios.get(`${API_BASE_URL}/${make.toLowerCase()}/${model.niceName}/vehicles`, {
        params: {
          fmt: 'json',
          api_key: API_KEY,
          price: `..${maxPrice}`, // Edmunds uses range notation for price filtering
          pagesize: pageSize,
          pagenum: page
        }
      })
    );
    
    const modelResults = await Promise.all(modelPromises);
    
    // Process and combine results
    modelResults.forEach(response => {
      if (response.data.results) {
        allVehicles = [...allVehicles, ...response.data.results];
      }
    });
    
    // Filter by price and sort
    const filteredVehicles = allVehicles
      .filter(vehicle => vehicle.price && vehicle.price <= maxPrice)
      .sort((a, b) => a.price - b.price);
    
    // Apply pagination manually since we're combining results
    const startIndex = (page - 1) * pageSize;
    const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + pageSize);
    
    // Transform to a consistent format
    const vehicles = paginatedVehicles.map(vehicle => ({
      id: vehicle.id,
      year: vehicle.year,
      make: vehicle.make.name,
      model: vehicle.model.name,
      trim: vehicle.trim,
      price: vehicle.price,
      mpg: vehicle.mpg ? `${vehicle.mpg.highway}/${vehicle.mpg.city}` : 'N/A',
      image: vehicle.photos && vehicle.photos.length > 0 
        ? vehicle.photos[0].url 
        : `https://placehold.co/300x200?text=${vehicle.make.name}+${vehicle.model.name}`,
      url: `https://www.edmunds.com/inventory/srp.html?make=${vehicle.make.niceName}&model=${vehicle.model.niceName}&price=${Math.floor(maxPrice)}`
    }));
    
    return {
      vehicles,
      totalCount: filteredVehicles.length,
      currentPage: page,
      totalPages: Math.ceil(filteredVehicles.length / pageSize) || 1
    };
  } catch (error) {
    console.error('Edmunds API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vehicles from Edmunds');
  }
};

/**
 * Get detailed information about a specific vehicle
 * 
 * @param {string} vehicleId - Edmunds vehicle ID
 * @returns {Promise} Promise resolving to vehicle details
 */
export const getVehicleDetails = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicle/${vehicleId}`, {
      params: {
        fmt: 'json',
        api_key: API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Edmunds API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch vehicle details');
  }
};