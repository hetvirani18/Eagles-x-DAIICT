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
  const resourceMarkersRef = useRef<L.Marker[]>([]);

  // Create resource marker icons
  const createResourceIcon = (type: 'greenEnergy' | 'waterBody' | 'industry' | 'transportation') => {
    const iconConfig = {
      greenEnergy: { emoji: '⚡', color: '#10b981', name: 'Green Energy' },
      waterBody: { emoji: '💧', color: '#3b82f6', name: 'Water Source' },
      industry: { emoji: '🏭', color: '#8b5cf6', name: 'Industry' },
      transportation: { emoji: '🚛', color: '#6b7280', name: 'Transportation' }
    };

    const config = iconConfig[type];
    return L.divIcon({
      className: 'resource-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: ${config.color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
        ">
          ${config.emoji}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  // Add resource markers to map
  const addResourceMarkers = (site: OptimalSite) => {
    console.log('🔥 addResourceMarkers called for:', site.district);
    
    if (!mapInstance.current) {
      console.log('❌ No map instance');
      return;
    }
    
    if (!site.nearestResources) {
      console.log('❌ No nearestResources for', site.district);
      return;
    }

    console.log('✅ Map instance and resources exist');
    console.log('📍 Site nearestResources:', site.nearestResources);

    // Clear existing resource markers
    resourceMarkersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.warn('Error removing resource marker:', e);
      }
    });
    resourceMarkersRef.current = [];

    // Add a simple test marker first
    console.log('🧪 Adding test marker...');
    const testIcon = L.divIcon({
      className: 'test-marker',
      html: `<div style="width: 20px; height: 20px; background: red; border-radius: 50%; border: 2px solid white;">❤️</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    
    const testMarker = L.marker([23.05, 72.6], { icon: testIcon }).addTo(mapInstance.current!);
    testMarker.bindPopup('Test marker - if you see this, markers are working!');
    resourceMarkersRef.current.push(testMarker);
    console.log('✅ Test marker added');

    // Define realistic resource locations for Gujarat
    const resourceLocations = {
      Ahmedabad: {
        greenEnergy: [23.1, 72.6], // Solar farm location
        waterBody: [23.0, 72.5], // Sabarmati River
        industry: [22.9, 72.6], // Chemical complex
        transportation: [23.2, 72.7] // Airport area
      },
      Surat: {
        greenEnergy: [21.2, 72.9], // Wind farm location
        waterBody: [21.1, 72.8], // Tapi River
        industry: [21.0, 72.9], // Textile hub
        transportation: [21.1, 72.7] // Port area
      },
      Vadodara: {
        greenEnergy: [22.4, 73.2], // Hybrid energy park
        waterBody: [22.3, 73.1], // Vishwamitri River
        industry: [22.2, 73.2], // Petrochemical complex
        transportation: [22.4, 73.0] // Railway junction
      }
    };

    const locations = resourceLocations[site.district as keyof typeof resourceLocations];
    if (!locations) {
      console.log('❌ No predefined locations for', site.district);
      return;
    }

    console.log('✅ Found locations for', site.district, locations);

    // Add Green Energy marker
    if (site.nearestResources.greenEnergy && locations.greenEnergy) {
      console.log('🔋 Adding green energy marker at', locations.greenEnergy);
      try {
        const marker = L.marker(locations.greenEnergy as [number, number], { icon: createResourceIcon('greenEnergy') })
          .addTo(mapInstance.current!);
        
        marker.bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <h4 style="margin: 0 0 4px 0;">⚡ Green Energy</h4>
            <p style="margin: 0; font-weight: bold;">${site.nearestResources.greenEnergy.name}</p>
            <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">${site.nearestResources.greenEnergy.distance} km away</p>
          </div>
        `);
        
        resourceMarkersRef.current.push(marker);
        console.log('✅ Green energy marker added successfully');
      } catch (error) {
        console.error('❌ Error adding green energy marker:', error);
      }
    }

    console.log(`🎯 Total resource markers added: ${resourceMarkersRef.current.length}`);
  };

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

    console.log('Map initialized successfully');

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
        // Create custom styled icon
        const customIcon = L.divIcon({
          className: 'custom-hydrogen-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #10b981, #059669);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 3px 12px rgba(16, 185, 129, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
              cursor: pointer;
              transition: all 0.2s ease;
              position: relative;
            " onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 4px 16px rgba(16, 185, 129, 0.6)'" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 3px 12px rgba(16, 185, 129, 0.4)'">
              H₂
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        // Create marker with custom icon
        const marker = L.marker([site.location.coordinates[1], site.location.coordinates[0]], {
          icon: customIcon
        }).addTo(mapInstance.current!);

        // Enhanced popup with better styling
        marker.bindPopup(`
          <div style="text-align: center; padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${site.district}</h3>
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 4px 8px; border-radius: 12px; display: inline-block; margin-bottom: 8px;">
              <strong>Score: ${site.overallScore}/10</strong>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 13px;">Click for details</p>
          </div>
        `);

        // Add click handler
        marker.on('click', () => {
          console.log(`Marker clicked for ${site.district}!`);
          onSiteSelect(site as any);
          
          // Add resource markers when site is selected
          console.log('About to call addResourceMarkers...');
          addResourceMarkers(site as any);
        });

        markersRef.current.push(marker);
        console.log(`Successfully added styled marker for ${site.district}`);
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

  // Load optimal sites when region changes or on initial load
  useEffect(() => {
    const loadSites = async () => {
      setIsLoading(true);
      try {
        console.log(`Loading sites for region: ${region || 'all'}`);
        const response = await ApiService.getOptimalSites(region || 'all');
        if (response.data && response.data.length > 0) {
          console.log(`✅ Loaded ${response.data.length} sites from API`);
          setSites(response.data);
          toast.success(`Loaded ${response.data.length} optimal sites for ${region === 'all' || !region ? 'Gujarat' : region}`);
        } else {
          console.log('No optimal sites found in database, automatically generating...');
          
          // Automatically trigger analysis when no sites are found
          try {
            // Use a specific region for analysis, defaulting to a major Gujarat district
            const regionToAnalyze = region && region !== 'all' ? region : 'Ahmedabad';
            console.log(`🔥 Auto-triggering analysis for region: ${regionToAnalyze}`);
            
            toast('No sites found. Generating optimal sites using AI algorithm...', {
              icon: '🤖',
              duration: 3000,
            });
            
            const analysisResponse = await ApiService.analyzeRegion({
              region: regionToAnalyze,
              gridResolution: 0.01
            });
            
            if (analysisResponse.sites && analysisResponse.sites.length > 0) {
              const sites = analysisResponse.sites as unknown as OptimalSite[];
              
              // Validate and filter out invalid sites
              const validSites = sites.filter(site => {
                return site && 
                       site.location && 
                       site.location.coordinates && 
                       Array.isArray(site.location.coordinates) && 
                       site.location.coordinates.length === 2 &&
                       typeof site.location.coordinates[0] === 'number' &&
                       typeof site.location.coordinates[1] === 'number' &&
                       site.district && 
                       site.district !== 'undefined' &&
                       site.overallScore &&
                       typeof site.overallScore === 'number';
              });
              
              if (validSites.length > 0) {
                setSites(validSites);
                toast.success(`🎉 Generated ${validSites.length} optimal sites for ${regionToAnalyze} using MCDA algorithm!`);
              } else {
                throw new Error('Analysis returned invalid site data');
              }
            } else {
              throw new Error('Analysis completed but no sites generated');
            }
          } catch (analysisError) {
            console.error('Auto-analysis failed:', analysisError);
            
            // Fall back to mock sites with clear indication
            console.log('Analysis failed, using fallback demo sites');
            const mockSites: OptimalSite[] = [
              {
                _id: 'demo-ahmedabad',
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
                _id: 'demo-surat',
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
            toast.error('Analysis failed. Showing demo sites. Use ⚡ button to try again.', {
              duration: 6000,
            });
          }
        }
      } catch (error) {
        console.error('Error loading sites:', error);
        console.log('API failed, using fallback demo sites');
        // Fallback to demo data only if API fails
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

  // Initial load when component mounts
  useEffect(() => {
    // Load all sites initially if no region is specified
    if (!region) {
      console.log('Component mounted, loading all sites initially');
    }
  }, []);

  // Update markers when sites change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for optimal sites with validation
    sites.forEach((site) => {
      // Validate site data before creating marker
      if (!site || !site.location || !site.location.coordinates || 
          !Array.isArray(site.location.coordinates) || 
          site.location.coordinates.length !== 2 ||
          !site.district || site.district === 'undefined') {
        console.warn('Skipping invalid site:', site);
        return;
      }

      const [longitude, latitude] = site.location.coordinates;
      
      // Validate coordinates are numbers and within reasonable bounds for Gujarat
      if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
          latitude < 20 || latitude > 25 || longitude < 68 || longitude > 75) {
        console.warn(`Skipping site with invalid coordinates: ${site.district} at [${latitude}, ${longitude}]`);
        return;
      }

      const getMarkerColor = (score: number) => {
        if (score >= 8) return '#10b981'; // Green
        if (score >= 6) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
      };

      const color = getMarkerColor(site.overallScore);
      
      console.log(`Creating marker for ${site.district} at [${latitude}, ${longitude}]`);
      
      const marker = L.marker([latitude, longitude])
        .addTo(mapInstance.current!);

      // Simple popup for testing
      marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
          <h3>${site.district}</h3>
          <p>Score: ${site.overallScore}/10</p>
          <p>Region: ${site.region}</p>
        </div>
      `);

      marker.on('click', (e) => {
        console.log(`✅ Marker clicked for ${site.district}!`);
        e.originalEvent?.stopPropagation();
        onSiteSelect(site);
      });

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
      <div className="absolute top-6 right-6 z-10 space-y-3">
        {/* Generate Sites Button */}
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              const regionToAnalyze = region && region !== 'all' ? region : 'Ahmedabad';
              console.log(`Manual analysis trigger for region: ${regionToAnalyze}`);
              
              const analysisResponse = await ApiService.analyzeRegion({
                region: regionToAnalyze,
                gridResolution: 0.01
              });
              
              if (analysisResponse.sites && analysisResponse.sites.length > 0) {
                // Handle the response properly - the backend returns sites directly in the sites array
                const sites = analysisResponse.sites as unknown as OptimalSite[];
                setSites(sites);
                toast.success(`Generated ${sites.length} optimal sites for ${regionToAnalyze}!`);
              } else {
                toast.error('Analysis completed but no sites were generated');
              }
            } catch (error) {
              console.error('Manual analysis failed:', error);
              toast.error('Failed to generate sites. Check console for details.');
            } finally {
              setIsLoading(false);
            }
          }}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Generate Optimal Sites"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        
        {/* Refresh Sites Button */}
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              const response = await ApiService.getOptimalSites(region || 'all');
              if (response.data && response.data.length > 0) {
                setSites(response.data);
                toast.success(`Refreshed ${response.data.length} sites`);
              } else {
                setSites([]);
                toast('No sites found in database', { icon: 'ℹ️' });
              }
            } catch (error) {
              toast.error('Failed to refresh sites');
            } finally {
              setIsLoading(false);
            }
          }}
          className="flex items-center justify-center w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Refresh Sites from Database"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;