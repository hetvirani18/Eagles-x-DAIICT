import React, { useState, useRef, useEffect, startTransition, useDeferredValue } from 'react';
import { Search, MapPin, X, Loader, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { citiesAPI, handleApiError } from '../services/api';

/**
 * Modern React 19 SearchComponent with:
 * - useDeferredValue for better performance
 * - startTransition for non-blocking updates
 * - Improved concurrent features
 * - Better error handling
 */
const SearchComponentReact19 = ({ onLocationSelect, onClear }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  
  const inputRef = useRef();
  const searchTimeoutRef = useRef();
  
  // React 19: Use deferred value for better performance
  const deferredQuery = useDeferredValue(query);
  
  // React 19: Enhanced search with concurrent features
  const performSearch = async (searchQuery) => {
    if (searchQuery.length < 2) {
      startTransition(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 React 19 Enhanced Search:', searchQuery);
      
      const response = await citiesAPI.search(searchQuery);
      const cities = response.data || [];
      
      console.log('✅ Enhanced Search Results:', cities.length, 'cities found');
      
      // React 19: Use startTransition for non-blocking updates
      startTransition(() => {
        setSuggestions(cities);
        setShowSuggestions(cities.length > 0);
        setIsPending(false);
      });
      
    } catch (error) {
      console.error('❌ Enhanced Search failed:', error);
      const errorInfo = handleApiError(error, 'SearchComponentReact19.performSearch');
      
      startTransition(() => {
        setError(errorInfo.message);
        setSuggestions([]);
        setShowSuggestions(false);
        setIsPending(false);
      });
    } finally {
      setLoading(false);
    }
  };

  // React 19: Enhanced effect with deferred value
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (deferredQuery.trim()) {
      setIsPending(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(deferredQuery);
      }, 300);
    } else {
      startTransition(() => {
        setSuggestions([]);
        setShowSuggestions(false);
        setError(null);
        setIsPending(false);
      });
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [deferredQuery]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (city) => {
    startTransition(() => {
      setQuery(city.name);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    });
    
    if (onLocationSelect) {
      onLocationSelect({
        name: city.name,
        coordinates: city.coordinates,
        district: city.district,
        population: city.population
      });
    }
  };

  const handleClear = () => {
    startTransition(() => {
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setError(null);
      setIsPending(false);
    });
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    if (onClear) {
      onClear();
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // React 19: Enhanced loading state
  const isSearching = loading || isPending;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* React 19 Feature Badge */}
      <div className="flex items-center gap-2 mb-3 text-sm text-blue-600">
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Powered by React 19</span>
        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
          useDeferredValue + startTransition
        </span>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search Gujarat cities... (React 19 Enhanced)"
            className="pl-12 pr-20 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            autoComplete="off"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {isSearching && (
              <Loader className="w-5 h-5 text-blue-500 animate-spin" />
            )}
            
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Enhanced Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
            <div className="p-2 border-b bg-gray-50">
              <p className="text-xs text-gray-600">
                {suggestions.length} cities found • React 19 Enhanced
              </p>
            </div>
            
            {suggestions.map((city, index) => (
              <div
                key={`${city.name}-${city.district}-${index}`}
                onClick={() => handleSuggestionClick(city)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-150 ${
                  index === selectedIndex
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {city.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {city.district} District, Gujarat
                    </p>
                    {city.population && (
                      <p className="text-xs text-gray-500 mt-1">
                        Population: {city.population.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {suggestions.length === 0 && !isSearching && deferredQuery.length >= 2 && (
              <div className="p-8 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium mb-1">No cities found</p>
                <p className="text-sm">
                  Try searching for a different location in Gujarat
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* React 19 Performance Indicator */}
      {isPending && (
        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>React 19 concurrent search in progress...</span>
        </div>
      )}
    </div>
  );
};

export default SearchComponentReact19;
