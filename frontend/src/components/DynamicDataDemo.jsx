import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import LocationDetails from './LocationDetails';
import { getMockAnalysisData } from '../services/mockData';

// Demo component to showcase dynamic data integration
const DynamicDataDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample locations with different coordinates
  const sampleLocations = [
    {
      id: 1,
      name: "Kutch (High Wind)",
      latitude: 23.7337,
      longitude: 68.7380,
      overall_score: 87.5,
      description: "Excellent wind resources, renewable energy potential"
    },
    {
      id: 2,
      name: "Ahmedabad (Industrial Hub)",
      latitude: 23.0225,
      longitude: 72.5714,
      overall_score: 72.3,
      description: "Strong industrial demand, infrastructure availability"
    },
    {
      id: 3,
      name: "Surat (Coastal)",
      latitude: 21.1702,
      longitude: 72.8311,
      overall_score: 81.2,
      description: "Coastal advantages, port proximity"
    },
    {
      id: 4,
      name: "Coastal Gujarat (Offshore Wind)",
      latitude: 21.6417,
      longitude: 69.6293,
      overall_score: 92.1,
      description: "Offshore wind potential, excellent grid connectivity"
    }
  ];

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setAnalysisData(null);
    setLoading(true);

    // Simulate API call with loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get different mock data based on location coordinates
    const mockData = getMockAnalysisData(location.latitude, location.longitude);
    setAnalysisData(mockData);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dynamic Data Integration Demo</h1>
        <p className="text-gray-600">
          Click on different locations to see how the system fetches dynamic analysis data 
          with different values for each location (previously static values).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Location to Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleLocations.map((location) => (
                <Button
                  key={location.id}
                  variant={selectedLocation?.id === location.id ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="text-left">
                    <div className="font-semibold">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.description}</div>
                    <div className="text-xs text-gray-400">
                      {location.latitude}°, {location.longitude}° • Score: {location.overall_score}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Dynamic Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedLocation ? (
              <div className="text-center py-12 text-gray-500">
                <p>Select a location to see dynamic analysis data</p>
                <p className="text-sm mt-2">Each location will show different metrics</p>
              </div>
            ) : (
              <LocationDetails
                location={selectedLocation}
                analysisData={analysisData}
                loading={loading}
                embedded={true}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Before/After Comparison */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Before vs After Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">❌ Before (Static Data)</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Always showed ₹350/kg regardless of location</li>
                <li>• Fixed 25 MT annual capacity for all locations</li>
                <li>• Same ROI percentage everywhere</li>
                <li>• No loading states or API integration</li>
                <li>• Fallback mock values used consistently</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">✅ After (Dynamic Data)</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Location-specific cost analysis</li>
                <li>• Different capacity calculations per location</li>
                <li>• Variable ROI based on local conditions</li>
                <li>• Loading indicators during data fetch</li>
                <li>• Real API integration ready for backend</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicDataDemo;