import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';
import SearchComponent from './SearchComponent';
import LocationDetails from './LocationDetails';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Layers, Info, Star, Factory, Droplets, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';

const MainMapPage = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingDynamicData, setLoadingDynamicData] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get data for search functionality
  const {
    energySources,
    demandCenters,
    waterSources,
    gasPipelines,
    roadNetworks,
    optimalLocations
  } = useApiData();

  const handleLocationSelect = async (location, locationData, locationType) => {
    setSearchLocation(location);

    // If the nearest location is an optimal location, fetch dynamic analysis
    if (locationType === 'optimal' && locationData) {
      // Fetch dynamic analysis for this location
      const enrichedLocationData = await fetchDynamicAnalysisForLocation(locationData);
      setSelectedLocation(enrichedLocationData);
    }
  };

  const handleOptimalLocationSelect = async (location) => {
    console.log('🎯 Location clicked:', location);
    console.log('🎯 Location coordinates:', location.location?.latitude, location.location?.longitude);
    
    // Show loading immediately
    setSelectedLocation({
      ...location,
      isLoadingDynamicData: true
    });
    
    setLoadingDynamicData(true);
    console.log('🔄 Starting to fetch dynamic analysis...');
    
    // Fetch dynamic analysis for this location
    const enrichedLocation = await fetchDynamicAnalysisForLocation(location);
    console.log('✅ Received enriched location:', enrichedLocation);
    
    setLoadingDynamicData(false);
    setSelectedLocation(enrichedLocation);
  };

  // New function to fetch dynamic analysis for a location
  const fetchDynamicAnalysisForLocation = async (location) => {
    try {
      const lat = location.location?.latitude || location.lat;
      const lng = location.location?.longitude || location.lng;
      
      if (!lat || !lng) return location; // Return original if no coordinates
      
      console.log(`🔄 Fetching dynamic analysis for location: ${lat}, ${lng}`);
      
      const payload = {
        latitude: lat,
        longitude: lng,
        technology_type: "pem",
        electricity_source: "mixed_renewable",
      };
      console.log('📤 Sending payload:', payload);
      
      const response = await fetch("http://localhost:8080/api/v1/advanced/comprehensive-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dynamicData = await response.json();
      console.log('📊 Dynamic data received:', dynamicData);
      console.log('📊 Base analysis data:', dynamicData.base_analysis);
      
      if (dynamicData.status === "success" && dynamicData.base_analysis) {
        const baseAnalysis = dynamicData.base_analysis;
        console.log('📊 Key values - Price:', baseAnalysis.hydrogen_price_per_kg, 'Capacity:', baseAnalysis.optimal_capacity_kg_day, 'Production:', baseAnalysis.annual_production_tonnes);
        
        // Enrich the location with dynamic production metrics
        const enrichedLocation = {
          ...location,
          production_metrics: {
            projected_cost_per_kg: parseFloat(baseAnalysis.hydrogen_price_per_kg?.toFixed(2)) || 350,
            annual_capacity_mt: parseFloat((baseAnalysis.annual_production_tonnes || 25).toFixed(3)), // Keep in tonnes as MT
            payback_period_years: baseAnalysis.payback_period_years?.toFixed(1) || "N/A",
            roi_percentage: baseAnalysis.roi_percentage?.toFixed(2) || "N/A",
            optimal_capacity_kg_day: parseFloat(baseAnalysis.optimal_capacity_kg_day?.toFixed(2)) || 1000,
            total_capex: parseFloat(baseAnalysis.total_capex?.toFixed(2)) || 25000
          },
          dynamic_analysis: dynamicData // Store full dynamic analysis for detailed view
        };
        
        console.log('✅ Enriched location:', enrichedLocation);
        console.log('✅ Production metrics created:', enrichedLocation.production_metrics);
        return enrichedLocation;
      }
    } catch (error) {
      console.error('❌ Error fetching dynamic analysis:', error);
    }
    
    return location; // Return original location if API call fails
  };

  const handleViewFullAnalysis = (loc) => {
    if (!loc) return;
    navigate('/analysis', { state: { location: loc } });
  };

  const clearSearch = () => {
    setSearchLocation(null);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Green Hydrogen Infrastructure Mapping & Optimization
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Advanced Location Intelligence for H₂ Plant Development
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                About
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <div className="px-4 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-2 w-full justify-start"
              >
                <Info className="w-4 h-4" />
                About
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                    <Factory className="w-5 h-5 text-primary" />
                    Application Features
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Interactive Gujarat infrastructure map</li>
                    <li>• AI-powered location optimization</li>
                    <li>• Real-time data analysis</li>
                    <li>• Cost projections and investment insights</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                    <Star className="w-5 h-5 text-yellow-500" />
                    How It Works
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Search for Gujarat cities</li>
                    <li>• Click optimal locations (⭐) for details</li>
                    <li>• View proximity to energy sources and demand</li>
                    <li>• Get investment-grade analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${
          sidebarCollapsed ? 'w-16' : 'w-72'
        } bg-card border-r border-border transition-all duration-300 ease-in-out hidden lg:flex flex-col`}>

          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-foreground">Controls</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Section */}
            <div className="p-4">
              {!sidebarCollapsed && (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      Search Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <SearchComponent
                      onLocationSelect={handleLocationSelect}
                      onClear={clearSearch}
                      optimalLocations={optimalLocations}
                      energySources={energySources}
                      demandCenters={demandCenters}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Legend Section */}
            <div className="p-4">
              {!sidebarCollapsed && (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Map Legend
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLegendCollapsed(!legendCollapsed)}
                        className="p-1"
                      >
                        {legendCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  {!legendCollapsed && (
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">⭐</div>
                        <span className="text-sm text-foreground">Optimal Locations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">⚡</div>
                        <span className="text-sm text-foreground">Energy Sources</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">🏭</div>
                        <span className="text-sm text-foreground">Industrial Demand</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">💧</div>
                        <span className="text-sm text-foreground">Water Sources</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content - Dynamic Layout */}
        <main className="flex-1 flex min-w-0">
          {/* Map Container - Dynamic Width */}
          <div className={`flex-1 relative transition-all duration-300 ease-in-out ${
            selectedLocation ? 'md:flex-[0_0_60%] lg:flex-[0_0_65%] xl:flex-[0_0_68%]' : 'flex-1'
          }`}>
            <div className="h-full p-4">
              <Card className="h-full border-border shadow-sm">
                <CardContent className="p-0 h-full">
                  <MapComponent
                    searchLocation={searchLocation}
                    selectedLocation={selectedLocation}
                    onLocationSelect={handleOptimalLocationSelect}
                    onViewFullAnalysis={handleViewFullAnalysis}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Location Analysis Panel - Docked Right */}
          {selectedLocation && (
            <div className={`hidden md:block transition-all duration-300 ease-in-out border-l border-border bg-card shadow-lg ${
              selectedLocation ? 'flex-shrink-0 w-80 md:w-80 lg:w-88 xl:w-[400px]' : 'hidden'
            }`}>
              <div className="h-full">
                <Card className="h-full border-0 shadow-none">
                  <CardHeader className="pb-3 border-b border-border">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Location Analysis
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLocation(null)}
                        className="p-1 hover:bg-muted"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 h-[calc(100%-4rem)] overflow-y-auto">
                    <LocationDetails
                      location={selectedLocation}
                      onClose={() => setSelectedLocation(null)}
                      embedded={true}
                      resources={{
                        energySources,
                        demandCenters,
                        waterSources,
                        gasPipelines,
                        roadNetworks,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Sheet for Legend & Analysis */}
      <div className="lg:hidden">
        {/* Mobile Legend */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Map Legend
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLegendCollapsed(!legendCollapsed)}
              className="p-1"
            >
              {legendCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
          {!legendCollapsed && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">⭐</div>
                <span className="text-sm text-foreground">Optimal</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">⚡</div>
                <span className="text-sm text-foreground">Energy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">🏭</div>
                <span className="text-sm text-foreground">Demand</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">💧</div>
                <span className="text-sm text-foreground">Water</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Location Analysis */}
        {selectedLocation && (
          <div className="md:hidden border-t border-border bg-card shadow-lg max-h-[55vh] overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Location Analysis
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="p-1 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-[calc(55vh-4rem)] overflow-y-auto p-4">
              <LocationDetails
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
                embedded={true}
                resources={{
                  energySources,
                  demandCenters,
                  waterSources,
                  gasPipelines,
                  roadNetworks,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMapPage;
