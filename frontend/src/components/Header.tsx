import React, { useState } from 'react';
import type { OptimalSite } from '../types';

interface HeaderProps {
  onRegionSearch: (region: string) => void;
  isLoading: boolean;
  sites: OptimalSite[];
}

const Header: React.FC<HeaderProps> = ({ onRegionSearch, isLoading, sites }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const gujaratDistricts = [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 
    'Bhavnagar', 'Jamnagar', 'Kutch', 'Anand', 'Bharuch',
    'Mehsana', 'Patan', 'Sabarkantha', 'Narmada', 'Navsari'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onRegionSearch(searchTerm.trim());
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (district: string) => {
    setSearchTerm(district);
    onRegionSearch(district);
    setShowDropdown(false);
  };

  const filteredDistricts = gujaratDistricts.filter(district =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl border-b border-blue-700/50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">H₂</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Hydrogen Plant Site Selector
              </h1>
              <p className="text-blue-200 text-sm flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Gujarat State - AI-Powered Location Finder
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search districts (e.g., Ahmedabad, Surat...)"
                className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !searchTerm.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-200 hover:text-white disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>

            {/* Search Dropdown */}
            {showDropdown && searchTerm && filteredDistricts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/30 max-h-48 overflow-y-auto z-50">
                {filteredDistricts.map((district) => (
                  <button
                    key={district}
                    onClick={() => handleSuggestionClick(district)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-all duration-200 first:rounded-t-xl last:rounded-b-xl text-gray-800"
                  >
                    <span className="font-semibold">{district}</span>
                    <span className="text-sm text-gray-500 ml-2">District, Gujarat</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats Dashboard */}
          <div className="flex items-center space-x-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{sites.length}</div>
                  <div className="text-xs text-blue-200">Sites</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">
                    {sites.filter(s => s.isGoldenLocation).length}
                  </div>
                  <div className="text-xs text-blue-200">Golden</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-300">
                    {sites.length > 0 ? (sites.reduce((sum, s) => sum + s.overallScore, 0) / sites.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-xs text-blue-200">Avg Score</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleSuggestionClick('all')}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                🌍 All Gujarat
              </button>
            </div>
          </div>
        </div>

        {/* Quick District Buttons */}
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar'].map((district) => (
            <button
              key={district}
              onClick={() => handleSuggestionClick(district)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-full text-sm transition-all duration-200 whitespace-nowrap"
              disabled={isLoading}
            >
              {district}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
