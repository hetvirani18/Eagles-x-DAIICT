import React, { useState } from 'react';

interface SearchBarProps {
  onRegionSearch: (region: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onRegionSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const gujaratDistricts = [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 
    'Bhavnagar', 'Jamnagar', 'Kutch', 'Anand', 'Bharuch',
    'Mehsana', 'Patan', 'Sabarkantha', 'Narmada', 'Navsari'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onRegionSearch(searchTerm.trim());
    }
  };

  const handleSuggestionClick = (district: string) => {
    setSearchTerm(district);
    onRegionSearch(district);
  };

  const filteredDistricts = gujaratDistricts.filter(district =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-96">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Gujarat districts (e.g., Ahmedabad)"
            className="w-full px-5 py-4 pr-14 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 text-gray-700 placeholder-gray-400 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-blue-600 disabled:opacity-50 rounded-xl hover:bg-blue-50 transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {searchTerm && filteredDistricts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 max-h-48 overflow-y-auto z-30">
          {filteredDistricts.map((district) => (
            <button
              key={district}
              onClick={() => handleSuggestionClick(district)}
              className="w-full px-5 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0"
            >
              <span className="font-semibold text-gray-800">{district}</span>
              <span className="text-sm text-gray-500 ml-2">District, Gujarat</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Access Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleSuggestionClick('all')}
          className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg font-medium"
          disabled={isLoading}
        >
          🌍 All Gujarat
        </button>
        {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'].map((district) => (
          <button
            key={district}
            onClick={() => handleSuggestionClick(district)}
            className="px-4 py-2 text-sm bg-white/90 text-blue-700 rounded-full hover:bg-white hover:shadow-lg transition-all duration-200 border border-blue-200 font-medium"
            disabled={isLoading}
          >
            {district}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
