import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { citiesAPI, handleApiError } from '../services/api';

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const SearchComponent = ({ onLocationSelect, onClear }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const searchTimeoutRef = useRef();

  // Debounced search function
  const performSearch = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Searching cities:', searchQuery);
      
      const response = await citiesAPI.search(searchQuery);
      const cities = response.data || [];
      
      console.log('✅ Search results:', cities.length, 'cities found');
      
      setSuggestions(cities);
      setShowSuggestions(cities.length > 0);
      
    } catch (error) {
      console.error('❌ Search failed:', error);
      const errorInfo = handleApiError(error, 'SearchComponent.performSearch');
      setError(errorInfo.message);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    if (query.length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
    }
    
    setSelectedIndex(-1);

    // Cleanup on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectLocation(suggestions[selectedIndex]);
        } else if (suggestions.length > 0) {
          selectLocation(suggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectLocation = (city) => {
    setQuery(city.name);
    setShowSuggestions(false);
    setError(null);
    
    // Pass the city coordinates to the parent component
    const location = [city.location.latitude, city.location.longitude];
    onLocationSelect(location, city, 'city');
    console.log('📍 Selected city:', city.name, location);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    onClear();
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mocha/60 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search Gujarat cities - we'll find the nearest H₂ location!"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="pl-10 pr-10 border-mocha/30 focus:border-mocha text-mocha placeholder:text-mocha/50"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading && <Loader className="w-4 h-4 animate-spin text-mocha/60" />}
          {query && !loading && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-mocha/10"
              onClick={clearSearch}
            >
              <X className="w-4 h-4 text-mocha/60" />
            </Button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-300 rounded-md shadow-sm z-50">
          <p className="text-red-600 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && !error && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-mocha/30 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((city, index) => (
            <div
              key={city.id || `${city.name}-${index}`}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-coconut text-mocha'
                  : 'hover:bg-coconut/50'
              }`}
              onClick={() => selectLocation(city)}
            >
              <MapPin className="w-4 h-4 text-mocha/60" />
              <div className="flex-1">
                <span className="text-sm font-medium text-mocha">{city.name}</span>
                {city.district && (
                  <span className="text-xs text-mocha/60 ml-2">
                    {city.district}
                  </span>
                )}
                {city.population && (
                  <span className="text-xs text-mocha/50 ml-2">
                    Pop: {city.population.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && !loading && !error && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-coconut border border-mocha/30 rounded-md shadow-sm z-50">
          <p className="text-mocha/70 text-sm text-center">No cities found for "{query}"</p>
        </div>
      )}

      {/* Backdrop to close suggestions when clicking outside */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default SearchComponent;