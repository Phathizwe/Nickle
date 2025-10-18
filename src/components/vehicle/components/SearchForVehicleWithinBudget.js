import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { formatCurrency } from '../utils/formatters';
import { searchVehicles as searchAutoTrader } from '../services/autoTraderAPI';
import { searchVehicles as searchEdmunds } from '../services/edmundsAPI';

// Car makes available today
const CAR_MAKES = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", 
  "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dodge", "Ferrari", 
  "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", 
  "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", 
  "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", 
  "Nissan", "Pagani", "Peugeot", "Porsche", "Ram", "Renault", "Rolls-Royce", 
  "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

// Search providers
const SEARCH_PROVIDERS = [
  { id: 'autotrader', name: 'AutoTrader', logo: '🚗', url: 'https://www.autotrader.co.uk', apiEnabled: true },
  { id: 'carscom', name: 'Cars.com', logo: '🏎️', url: 'https://www.cars.com', apiEnabled: false },
  { id: 'carfax', name: 'Carfax', logo: '📋', url: 'https://www.carfax.com', apiEnabled: false },
  { id: 'edmunds', name: 'Edmunds', logo: '🔍', url: 'https://www.edmunds.com', apiEnabled: true }
];

const SearchForVehicleWithinBudget = ({ affordableCarPrice }) => {
  const [selectedMake, setSelectedMake] = useState('');
  const [budget, setBudget] = useState(affordableCarPrice);
  const [searchProvider, setSearchProvider] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    // Update budget when affordableCarPrice changes
    setBudget(affordableCarPrice);
  }, [affordableCarPrice]);

  const handleSearch = async (providerId) => {
    // Reset error state
    setError(null);
    setIsSearching(true);
    setSearchProvider(providerId);
    
    try {
      let results;
      
      // Use the appropriate API based on the selected provider
      switch(providerId) {
        case 'autotrader':
          results = await searchAutoTrader({
            maxPrice: parseFloat(budget),
            make: selectedMake,
            pageSize: 10,
            page: 1
          });
          break;
          
        case 'edmunds':
          results = await searchEdmunds({
            maxPrice: parseFloat(budget),
            make: selectedMake,
            pageSize: 10,
            page: 1
          });
          break;
          
        default:
          // For providers without API integration, use mock data
          setTimeout(() => {
            const mockResults = generateMockResults(selectedMake, parseFloat(budget), providerId);
            setSearchResults(mockResults);
            setPagination({
              currentPage: 1,
              totalPages: 1,
              totalCount: mockResults.length
            });
            setIsSearching(false);
            setHasSearched(true);
          }, 1500);
          return; // Early return to avoid setting results below
      }
      
      setSearchResults(results.vehicles);
      setPagination({
        currentPage: results.currentPage,
        totalPages: results.totalPages,
        totalCount: results.totalCount
      });
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search for vehicles');
      setSearchResults([]);
    } finally {
      if (searchProvider !== 'carscom' && searchProvider !== 'carfax') {
        setIsSearching(false);
        setHasSearched(true);
      }
    }
  };

  // Generate mock search results for providers without API integration
  const generateMockResults = (make, maxPrice, providerId) => {
    if (!make) return [];
    
    const results = [];
    const currentYear = new Date().getFullYear();
    
    // Generate 10 random vehicles within budget
    for (let i = 0; i < 10; i++) {
      const year = Math.floor(Math.random() * 6) + (currentYear - 5); // Random year between current-5 and current
      const price = Math.floor(Math.random() * (maxPrice * 0.95)) + (maxPrice * 0.5); // Random price between 50% and 95% of max budget
      const mileage = Math.floor(Math.random() * 100000) + 5000; // Random mileage between 5,000 and 105,000
      
      // Random model based on make
      let model = "Model";
      switch (make) {
        case "Toyota":
          model = ["Corolla", "Camry", "RAV4", "Highlander", "Tacoma"][Math.floor(Math.random() * 5)];
          break;
        case "Honda":
          model = ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"][Math.floor(Math.random() * 5)];
          break;
        case "Ford":
          model = ["F-150", "Escape", "Explorer", "Mustang", "Edge"][Math.floor(Math.random() * 5)];
          break;
        case "Chevrolet":
          model = ["Silverado", "Equinox", "Malibu", "Tahoe", "Traverse"][Math.floor(Math.random() * 5)];
          break;
        case "BMW":
          model = ["3 Series", "5 Series", "X3", "X5", "7 Series"][Math.floor(Math.random() * 5)];
          break;
        default:
          model = `${make} Model ${String.fromCharCode(65 + i)}`;
      }
      
      // Create URL based on provider
      const providerUrl = SEARCH_PROVIDERS.find(p => p.id === providerId)?.url;
      let url;
      
      switch(providerId) {
        case 'carscom':
          url = `${providerUrl}/shopping/${make.toLowerCase()}/${model.toLowerCase().replace(' ', '-')}/year-${year}/`;
          break;
        case 'carfax':
          url = `${providerUrl}/cars-for-sale/vehicledetails.action?make=${make}&model=${model}&year=${year}`;
          break;
        default:
          url = `${providerUrl}/vehicle/${make.toLowerCase()}-${model.toLowerCase().replace(' ', '-')}-${year}-${i}`;
      }
      
      results.push({
        id: `vehicle-${i}`,
        year,
        make,
        model,
        price,
        mileage,
        image: `https://placehold.co/300x200?text=${make}+${model}`,
        color: ["Black", "White", "Silver", "Blue", "Red"][Math.floor(Math.random() * 5)],
        url
      });
    }
    
    // Sort by price ascending
    return results.sort((a, b) => a.price - b.price);
  };

  // Handle pagination
  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setIsSearching(true);
    
    try {
      let results;
      
      // Use the appropriate API based on the selected provider
      switch(searchProvider) {
        case 'autotrader':
          results = await searchAutoTrader({
            maxPrice: parseFloat(budget),
            make: selectedMake,
            pageSize: 10,
            page: newPage
          });
          break;
          
        case 'edmunds':
          results = await searchEdmunds({
            maxPrice: parseFloat(budget),
            make: selectedMake,
            pageSize: 10,
            page: newPage
          });
          break;
          
        default:
          // For mock data, just simulate pagination
          setTimeout(() => {
            setPagination({
              ...pagination,
              currentPage: newPage
            });
            setIsSearching(false);
          }, 500);
          return; // Early return to avoid setting results below
      }
      
      setSearchResults(results.vehicles);
      setPagination({
        currentPage: results.currentPage,
        totalPages: results.totalPages,
        totalCount: results.totalCount
      });
    } catch (err) {
      console.error('Pagination error:', err);
      setError(err.message || 'Failed to load more vehicles');
    } finally {
      if (searchProvider === 'autotrader' || searchProvider === 'edmunds') {
        setIsSearching(false);
      }
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-4">Search for Vehicles Within Your Budget</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Budget
              </label>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Make
              </label>
              <select
                id="make"
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a make</option>
                {CAR_MAKES.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-3">Search on:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SEARCH_PROVIDERS.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  onClick={() => handleSearch(provider.id)}
                  disabled={isSearching || !selectedMake}
                  className="flex items-center justify-center gap-2"
                >
                  <span>{provider.logo}</span>
                  <span>{provider.name}</span>
                  {provider.apiEnabled && (
                    <span className="text-xs bg-green-100 text-green-800 px-1 rounded">API</span>
                  )}
                </Button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              AutoTrader and Edmunds use real API data. Other providers use simulated data.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Search Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {isSearching && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
              <span>Searching on {SEARCH_PROVIDERS.find(p => p.id === searchProvider)?.name}...</span>
            </div>
          )}
          
          {hasSearched && !isSearching && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg">
                {searchResults.length > 0 
                  ? `Found ${pagination.totalCount} vehicles matching your criteria` 
                  : 'No vehicles found matching your criteria'}
              </h4>
              
              {searchResults.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((vehicle) => (
                      <div 
                        key={vehicle.id} 
                        className="border rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[3/2] bg-gray-100 relative">
                          <img 
                            src={vehicle.image} 
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md font-medium">
                            {formatCurrency(vehicle.price)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h5>
                          <div className="mt-2 flex justify-between text-sm text-gray-600">
                            {vehicle.mpg ? (
                              <span>MPG: {vehicle.mpg}</span>
                            ) : (
                              <span>{vehicle.mileage?.toLocaleString() || 'N/A'} miles</span>
                            )}
                            <span>{vehicle.color || vehicle.trim || 'N/A'}</span>
                          </div>
                          <a 
                            href={vehicle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full flex items-center justify-center gap-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <span>View on {SEARCH_PROVIDERS.find(p => p.id === searchProvider)?.name}</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination controls */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1 || isSearching}
                      >
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages || isSearching}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForVehicleWithinBudget;