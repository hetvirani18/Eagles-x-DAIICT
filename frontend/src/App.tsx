import React, { useState } from 'react';
import MapView from './components/MapView';
import SiteDetailsPanel from './components/SiteDetailsPanel';
import ResourcesPanel from './components/ResourcesPanel';
import Header from './components/Header';
import type { OptimalSite } from './types';

function App() {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedSite, setSelectedSite] = useState<OptimalSite | null>(null);
  const [sites, setSites] = useState<OptimalSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const handleRegionSearch = (region: string) => {
    setSelectedRegion(region);
    setSelectedSite(null);
    setShowResources(false);
  };

  const handleSiteSelect = (site: OptimalSite) => {
    setSelectedSite(site);
    setShowResources(false);
  };

  const handleShowResources = () => {
    setShowResources(true);
    setSelectedSite(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header 
        onRegionSearch={handleRegionSearch}
        isLoading={isLoading}
        sites={sites}
      />
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Main Map */}
        <div className="flex-1 relative">
          <MapView
            region={selectedRegion}
            selectedSite={selectedSite}
            sites={sites}
            setSites={setSites}
            onSiteSelect={handleSiteSelect}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Side Panel */}
        {(selectedSite || showResources) && (
          <div className="w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
            {selectedSite && (
              <SiteDetailsPanel 
                site={selectedSite}
                onClose={() => setSelectedSite(null)}
                onShowResources={handleShowResources}
              />
            )}
            {showResources && selectedRegion && (
              <ResourcesPanel 
                region={selectedRegion}
                onClose={() => setShowResources(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
