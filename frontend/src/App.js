import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import SearchComponent from './components/SearchComponent';
import LocationDetails from './components/LocationDetails';
import { Card, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Layers, Info, Star, Zap, Factory, Droplets } from 'lucide-react';

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleLocationSelect = (location, locationData, locationType) => {
    setSearchLocation(location);
    
    // If the nearest location is an optimal location, also select it for details
    if (locationType === 'optimal' && locationData) {
      setSelectedLocation(locationData);
    }
  };

  const handleOptimalLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const clearSearch = () => {
    setSearchLocation(null);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-coconut">
      {/* Minimalist centered header */}
      <header className="w-full py-8 bg-mocha">
        <h1 className="text-center text-4xl font-bold text-coconut flex items-center justify-center gap-3 tracking-wide">
          <Droplets className="w-9 h-9" />
          Green Hydrogen Infrastructure Mapping
          <Factory className="w-9 h-9" />
        </h1>
        <p className="text-center text-coconut/80 mt-2 text-lg font-medium">
          Advanced Location Intelligence for H₂ Plant Development
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <Card className="border-mocha bg-card">
              <CardHeader className="pb-4 border-b border-mocha/20">
                <CardTitle className="text-lg text-mocha">Search Location</CardTitle>
              </CardHeader>
              <div className="px-6 pb-6">
                <SearchComponent 
                  onLocationSelect={handleLocationSelect}
                  onClear={clearSearch}
                />
              </div>
            </Card>

            {/* Map Legend */}
            <Card className="border-mocha bg-card">
              <CardHeader className="pb-4 border-b border-mocha/20">
                <CardTitle className="flex items-center gap-2 text-lg text-mocha">
                  <Layers className="w-5 h-5" />
                  Map Legend
                </CardTitle>
              </CardHeader>
              <div className="px-6 pb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">⭐</div>
                  <span className="text-sm text-mocha">Optimal Locations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">⚡</div>
                  <span className="text-sm text-mocha">Energy Sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">🏭</div>
                  <span className="text-sm text-mocha">Industrial Demand</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">💧</div>
                  <span className="text-sm text-mocha">Water Sources</span>
                </div>
              </div>
            </Card>

            {/* Info Panel */}
            {showInfo && (
              <Card className="border-mocha bg-card">
                <CardHeader className="pb-4 border-b border-mocha/20">
                  <CardTitle className="flex items-center gap-2 text-lg text-mocha">
                    <Info className="w-5 h-5" />
                    How H₂-Optimize Works
                  </CardTitle>
                </CardHeader>
                <div className="px-6 pb-6 space-y-3 text-sm text-mocha/70">
                  <div className="space-y-2">
                    <p className="font-medium text-mocha">1. Smart Algorithm</p>
                    <p>Uses weighted overlay analysis to score locations based on proximity to energy sources, industrial demand, and water availability.</p>
                  </div>
                  <Separator className="bg-mocha/20" />
                  <div className="space-y-2">
                    <p className="font-medium text-mocha">2. Click & Explore</p>
                    <p>Click on any ⭐ optimal location to see detailed analysis including cost projections and infrastructure proximity.</p>
                  </div>
                  <Separator className="bg-mocha/20" />
                  <div className="space-y-2">
                    <p className="font-medium text-mocha">3. Data-Driven Decisions</p>
                    <p>Get investment-grade insights for green hydrogen plant placement in Gujarat.</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-full border-mocha bg-card">
              <div className="h-full p-6">
                <MapComponent 
                  searchLocation={searchLocation}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleOptimalLocationSelect}
                />
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Location Details */}
          <div className="lg:col-span-1">
            {selectedLocation ? (
              <LocationDetails 
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
              />
            ) : (
              <Card className="h-fit border-mocha bg-card">
                <CardHeader className="border-b border-mocha/20">
                  <CardTitle className="text-mocha">Location Analysis</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-coconut border-2 border-mocha/20 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-mocha/40" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-mocha">Select an Optimal Location</p>
                      <p className="text-sm text-mocha/70">Click on any ⭐ marker to view detailed analysis and investment recommendations</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;