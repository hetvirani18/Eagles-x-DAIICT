import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toast from 'react-hot-toast';
import type { OptimalSite } from '../types';
import ApiService from '../services/api';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  region: string;
  selectedSite: OptimalSite | null;
  sites: OptimalSite[];
  setSites: (sites: OptimalSite[]) => void;
  onSiteSelect: (site: OptimalSite) => void;
  setIsLoading: (loading: boolean) => void;
}

const MapView: React.FC<MapViewProps> = ({
  region,
  selectedSite,
  sites,
  setSites,
  onSiteSelect,
  setIsLoading
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    console.log('Initializing map...');

    // Create map
    mapInstance.current = L.map(mapRef.current).setView([23.0225, 72.5714], 7);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    console.log('Map initialized, adding demo markers...');

    // Add some demo markers immediately after map loads
    setTimeout(() => {
      addDemoMarkers();
    }, 500);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add demo markers to show functionality
  const addDemoMarkers = () => {
    if (!mapInstance.current) {
      console.error('Map instance not available for adding demo markers');
      return;
    }

    console.log('Adding demo markers...'); // Debug log

    const demoSites = [
      {
        _id: '68b245b420c6563cdfffeee3', // Actual DB ID for Ahmedabad
        location: { type: 'Point', coordinates: [72.5714, 23.0225] },
        district: 'Ahmedabad',
        region: 'Central Gujarat',
        overallScore: 8.5,
        scores: {
          greenEnergyScore: 8.0,
          waterAccessScore: 8.5,
          industryProximityScore: 9.0,
          transportationScore: 8.5
        },
        nearestResources: {
          greenEnergy: { id: 'ge1', distance: 2.5, name: 'Solar Farm Ahmedabad' },
          waterBody: { id: 'wb1', distance: 1.8, name: 'Sabarmati River' },
          industry: { id: 'ind1', distance: 3.2, name: 'Chemical Complex' },
          transportation: { id: 'tr1', distance: 5.0, name: 'Ahmedabad Airport' }
        },
        estimatedCosts: {
          landAcquisition: 50,
          infrastructure: 120,
          connectivity: 30
        },
        isGoldenLocation: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '68b245b420c6563cdfffeee4', // Actual DB ID for Surat
        location: { type: 'Point', coordinates: [72.8311, 21.1702] },
        district: 'Surat',
        region: 'South Gujarat',
        overallScore: 7.8,
        scores: {
          greenEnergyScore: 7.5,
          waterAccessScore: 8.0,
          industryProximityScore: 8.5,
          transportationScore: 7.5
        },
        nearestResources: {
          greenEnergy: { id: 'ge2', distance: 1.5, name: 'Wind Farm Surat' },
          waterBody: { id: 'wb2', distance: 3.0, name: 'Tapi River' },
          industry: { id: 'ind2', distance: 2.8, name: 'Textile Hub' },
          transportation: { id: 'tr2', distance: 4.5, name: 'Surat Port' }
        },
        estimatedCosts: {
          landAcquisition: 45,
          infrastructure: 110,
          connectivity: 25
        },
        isGoldenLocation: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '68b245b420c6563cdfffeee5', // Actual DB ID for Vadodara
        location: { type: 'Point', coordinates: [73.1812, 22.3072] },
        district: 'Vadodara',
        region: 'Central Gujarat',
        overallScore: 7.2,
        scores: {
          greenEnergyScore: 7.0,
          waterAccessScore: 7.5,
          industryProximityScore: 7.0,
          transportationScore: 7.5
        },
        nearestResources: {
          greenEnergy: { id: 'ge3', distance: 3.2, name: 'Hybrid Energy Park' },
          waterBody: { id: 'wb3', distance: 2.1, name: 'Vishwamitri River' },
          industry: { id: 'ind3', distance: 1.8, name: 'Petrochemical Complex' },
          transportation: { id: 'tr3', distance: 6.2, name: 'Vadodara Railway Junction' }
        },
        estimatedCosts: {
          landAcquisition: 42,
          infrastructure: 105,
          connectivity: 28
        },
        isGoldenLocation: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Clear existing demo markers first
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

    demoSites.forEach((site, index) => {
      console.log(`Adding marker ${index + 1} for ${site.district} at [${site.location.coordinates[1]}, ${site.location.coordinates[0]}]`);
      
      try {
        // Create marker with coordinates in correct order (lat, lng)
        const marker = L.marker([site.location.coordinates[1], site.location.coordinates[0]])
          .addTo(mapInstance.current!);

        // Simple popup
        marker.bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <h3 style="margin: 0 0 8px 0;">${site.district}</h3>
            <p style="margin: 0;">Score: ${site.overallScore}/10</p>
          </div>
        `);

        // Add click handler
        marker.on('click', () => {
          console.log(`Clicked on ${site.district}`);
          onSiteSelect(site as any);
        });

        markersRef.current.push(marker);
        console.log(`Successfully added marker for ${site.district}`);
      } catch (error) {
        console.error(`Error adding marker for ${site.district}:`, error);
      }
    });

    console.log(`Added ${markersRef.current.length} demo markers successfully`);
    
    // Force map refresh
    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
        console.log('Map size invalidated and refreshed');
      }
    }, 100);
  };

  // Create custom icon for optimal sites
  const createOptimalSiteIcon = (score: number) => {
    const color = score >= 8 ? '#10b981' : score >= 7 ? '#f59e0b' : '#ef4444';
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${score.toFixed(1)}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  // Load optimal sites when region changes
  useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getOptimalSites(region);
        if (response.data) {
          setSites(response.data);
          toast.success(`Loaded ${response.data.length} optimal sites for ${region === 'all' ? 'Gujarat' : region}`);
        } else {
          setSites([]);
          toast.error('No data received from API');
        }
      } catch (error) {
        console.error('Error loading sites:', error);
        // For demo purposes, create some mock data
        const mockSites: OptimalSite[] = [
          {
            _id: '68b245b420c6563cdfffeee3',
            location: { type: 'Point', coordinates: [72.5714, 23.0225] },
            district: 'Ahmedabad',
            region: 'Central Gujarat',
            overallScore: 8.5,
            scores: {
              greenEnergyScore: 8.0,
              waterAccessScore: 8.5,
              industryProximityScore: 9.0,
              transportationScore: 8.5
            },
            nearestResources: {
              greenEnergy: { id: 'ge1', distance: 2.5, name: 'Solar Farm' },
              waterBody: { id: 'wb1', distance: 1.8, name: 'Sabarmati River' },
              industry: { id: 'ind1', distance: 3.2, name: 'Chemical Complex' },
              transportation: { id: 'tr1', distance: 5.0, name: 'Ahmedabad Airport' }
            },
            estimatedCosts: {
              landAcquisition: 50,
              infrastructure: 120,
              connectivity: 30
            },
            isGoldenLocation: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '68b245b420c6563cdfffeee4',
            location: { type: 'Point', coordinates: [72.8311, 21.1702] },
            district: 'Surat',
            region: 'South Gujarat',
            overallScore: 7.8,
            scores: {
              greenEnergyScore: 8.5,
              waterAccessScore: 7.0,
              industryProximityScore: 8.0,
              transportationScore: 7.8
            },
            nearestResources: {
              greenEnergy: { id: 'ge2', distance: 1.5, name: 'Wind Farm' },
              waterBody: { id: 'wb2', distance: 3.0, name: 'Tapi River' },
              industry: { id: 'ind2', distance: 2.8, name: 'Textile Hub' },
              transportation: { id: 'tr2', distance: 4.5, name: 'Surat Port' }
            },
            estimatedCosts: {
              landAcquisition: 45,
              infrastructure: 110,
              connectivity: 25
            },
            isGoldenLocation: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setSites(mockSites);
        toast('Using demo data - backend server not available', {
          icon: 'ℹ️',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSites();
  }, [region, setSites, setIsLoading]);

  // Update markers when sites change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for optimal sites
    sites.forEach((site) => {
      const getMarkerColor = (score: number) => {
        if (score >= 8) return '#10b981'; // Green
        if (score >= 6) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
      };

      const color = getMarkerColor(site.overallScore);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">
            ${site.overallScore.toFixed(1)}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      // Create detailed popup content
      const popupContent = `
        <div style="max-width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            margin: -9px -9px 12px -9px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          ">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">
              🏭 Optimal Hydrogen Plant Site
            </h3>
            <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">
              ${site.district}, ${site.region}
            </p>
          </div>
          
          <div style="padding: 0 4px;">
            <div style="
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              margin-bottom: 12px;
              padding: 8px 12px;
              background: #f8fafc;
              border-radius: 6px;
              border-left: 4px solid #10b981;
            ">
              <span style="font-weight: 600; color: #374151;">Overall Score:</span>
              <span style="
                font-size: 18px; 
                font-weight: bold; 
                color: #10b981;
                background: white;
                padding: 4px 8px;
                border-radius: 4px;
              ">
                ${site.overallScore.toFixed(1)}/10
              </span>
            </div>
            
            <div style="margin-bottom: 12px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
                📊 Detailed Scores
              </h4>
              
              <div style="display: grid; gap: 6px;">
                <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                  <span style="color: #6b7280;">🌱 Green Energy:</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="
                      width: 60px; 
                      height: 6px; 
                      background: #e5e7eb; 
                      border-radius: 3px; 
                      overflow: hidden;
                    ">
                      <div style="
                        width: ${(site.scores.greenEnergyScore / 10) * 100}%; 
                        height: 100%; 
                        background: #10b981;
                      "></div>
                    </div>
                    <span style="font-weight: 600; color: #374151; min-width: 30px;">
                      ${site.scores.greenEnergyScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                  <span style="color: #6b7280;">💧 Water Access:</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="
                      width: 60px; 
                      height: 6px; 
                      background: #e5e7eb; 
                      border-radius: 3px; 
                      overflow: hidden;
                    ">
                      <div style="
                        width: ${(site.scores.waterAccessScore / 10) * 100}%; 
                        height: 100%; 
                        background: #3b82f6;
                      "></div>
                    </div>
                    <span style="font-weight: 600; color: #374151; min-width: 30px;">
                      ${site.scores.waterAccessScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                  <span style="color: #6b7280;">🏭 Industry:</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="
                      width: 60px; 
                      height: 6px; 
                      background: #e5e7eb; 
                      border-radius: 3px; 
                      overflow: hidden;
                    ">
                      <div style="
                        width: ${(site.scores.industryProximityScore / 10) * 100}%; 
                        height: 100%; 
                        background: #f59e0b;
                      "></div>
                    </div>
                    <span style="font-weight: 600; color: #374151; min-width: 30px;">
                      ${site.scores.industryProximityScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                  <span style="color: #6b7280;">🚛 Transport:</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="
                      width: 60px; 
                      height: 6px; 
                      background: #e5e7eb; 
                      border-radius: 3px; 
                      overflow: hidden;
                    ">
                      <div style="
                        width: ${(site.scores.transportationScore / 10) * 100}%; 
                        height: 100%; 
                        background: #8b5cf6;
                      "></div>
                    </div>
                    <span style="font-weight: 600; color: #374151; min-width: 30px;">
                      ${site.scores.transportationScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button onclick="window.selectSite && window.selectSite('${site._id}')" style="
              width: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 10px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              📋 View Full Details
            </button>
          </div>
        </div>
      `;

      const marker = L.marker(
        [site.location.coordinates[1], site.location.coordinates[0]], 
        { icon: customIcon }
      ).addTo(mapInstance.current!);

      marker.bindPopup(popupContent, {
        maxWidth: 340,
        className: 'custom-popup'
      });

      marker.on('click', () => onSiteSelect(site));

      markersRef.current.push(marker);
    });

    // Add global function for popup button
    (window as any).selectSite = (siteId: string) => {
      const site = sites.find(s => s._id === siteId);
      if (site) {
        onSiteSelect(site);
      }
    };
  }, [sites, onSiteSelect]);

  // Update map view when region changes
  useEffect(() => {
    if (!mapInstance.current) return;

    if (region && region !== 'all') {
      const gujaratDistricts: { [key: string]: [number, number] } = {
        'ahmedabad': [23.0225, 72.5714],
        'surat': [21.1702, 72.8311],
        'vadodara': [22.3072, 73.1812],
        'rajkot': [22.3039, 70.8022],
        'bhavnagar': [21.7645, 72.1519],
        'jamnagar': [22.4707, 70.0577],
        'gandhinagar': [23.2156, 72.6369],
        'kutch': [23.7337, 69.8597],
        'anand': [22.5645, 72.9289],
        'mehsana': [23.5880, 72.3693]
      };
      
      const coords = gujaratDistricts[region.toLowerCase()];
      if (coords) {
        mapInstance.current.setView(coords, 10);
      }
    } else {
      mapInstance.current.setView([23.0225, 72.5714], 7);
    }
  }, [region]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full z-0"
        style={{ minHeight: '500px' }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border border-white/30 z-10 text-sm min-w-[280px]">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          <div className="font-bold text-gray-800">Resource Heatmap Analysis</div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700">Green Energy</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">30%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700">Water Access</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">25%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700">Industry</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">25%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700">Transportation</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">20%</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="font-bold text-gray-800 mb-3 text-sm">Site Quality Scores</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700 text-sm">8-10 Excellent</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700 text-sm">6-8 Good</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-3 shadow-sm"></div>
              <span className="text-gray-700 text-sm">4-6 Fair</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-3 z-10">
        <button 
          onClick={() => {
            console.log('Manual marker add triggered');
            addDemoMarkers();
          }}
          className="w-12 h-12 bg-red-500 backdrop-blur-sm rounded-full shadow-2xl border border-white/30 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-200 group"
          title="Add Demo Markers"
        >
          📍
        </button>
        <button className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl border border-white/30 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>
        <button className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl border border-white/30 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 group">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        <button className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl border border-white/30 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;