import React, { useState, useEffect } from 'react';
import type { GreenEnergy, WaterBody, Industry, Transportation } from '../types';
import ApiService from '../services/api';

interface ResourcesPanelProps {
  region: string;
  onClose: () => void;
}

const ResourcesPanel: React.FC<ResourcesPanelProps> = ({ region, onClose }) => {
  const [activeTab, setActiveTab] = useState<'energy' | 'water' | 'industry' | 'transport'>('energy');
  const [resources, setResources] = useState({
    energy: [] as GreenEnergy[],
    water: [] as WaterBody[],
    industry: [] as Industry[],
    transport: [] as Transportation[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const [energyRes, waterRes, industryRes, transportRes, summaryRes] = await Promise.all([
          ApiService.getGreenEnergy(region),
          ApiService.getWaterBodies(region),
          ApiService.getIndustries(region),
          ApiService.getTransportation(region),
          ApiService.getResourcesSummary(region)
        ]);

        setResources({
          energy: energyRes.data || [],
          water: waterRes.data || [],
          industry: industryRes.data || [],
          transport: transportRes.data || []
        });

        setSummary(summaryRes.summary);
      } catch (error) {
        console.error('Error fetching resources:', error);
        
        // Mock data for demonstration
        setResources({
          energy: [
            {
              _id: '1',
              name: 'Charanka Solar Park',
              type: 'solar',
              location: { type: 'Point', coordinates: [71.1924, 23.9045] },
              capacity: 345,
              operationalStatus: 'operational',
              district: region,
              address: 'Charanka, Patan District, Gujarat',
              operator: 'Gujarat State Electricity Corporation',
              createdAt: '',
              updatedAt: ''
            }
          ],
          water: [
            {
              _id: '1',
              name: 'Sabarmati River',
              type: 'river',
              location: { type: 'Point', coordinates: [72.5857, 23.0333] },
              waterQuality: 'moderate',
              availabilityPercentage: 70,
              district: region,
              capacity: 2000000,
              accessibilityRating: 8,
              createdAt: '',
              updatedAt: ''
            }
          ],
          industry: [
            {
              _id: '1',
              name: 'GNFC Fertilizer Plant',
              type: 'fertilizer',
              location: { type: 'Point', coordinates: [72.6369, 23.0593] },
              hydrogenDemand: 80,
              currentHydrogenSource: 'steam-reforming',
              district: region,
              employeeCount: 3500,
              annualRevenue: 12000,
              sustainabilityRating: 6,
              createdAt: '',
              updatedAt: ''
            }
          ],
          transport: [
            {
              _id: '1',
              name: 'NH 8 Highway',
              type: 'highway',
              location: { type: 'LineString', coordinates: [[72.5857, 23.0333], [72.8311, 21.1702]] },
              connectivity: 'national',
              trafficDensity: 'high',
              district: region,
              roadCondition: 'excellent',
              createdAt: '',
              updatedAt: ''
            }
          ]
        });

        setSummary({
          greenEnergy: { count: 1, totalCapacity: 345, unit: 'MW' },
          waterBodies: { count: 1 },
          industries: { count: 1, totalHydrogenDemand: 80, unit: 'tons/day' },
          transportation: { count: 1 }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [region]);

  const tabs = [
    { id: 'energy', label: 'Green Energy', icon: '⚡', count: resources.energy.length },
    { id: 'water', label: 'Water Bodies', icon: '💧', count: resources.water.length },
    { id: 'industry', label: 'Industries', icon: '🏭', count: resources.industry.length },
    { id: 'transport', label: 'Transport', icon: '🛣️', count: resources.transport.length }
  ];

  const renderResourceCard = (resource: any, type: string) => {
    const baseCardClass = "bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors";
    
    switch (type) {
      case 'energy':
        return (
          <div key={resource._id} className={baseCardClass}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{resource.name}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                resource.operationalStatus === 'operational' ? 'bg-green-100 text-green-800' :
                resource.operationalStatus === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {resource.operationalStatus}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {resource.type}</p>
              <p><span className="font-medium">Capacity:</span> {resource.capacity} MW</p>
              <p><span className="font-medium">Operator:</span> {resource.operator}</p>
            </div>
          </div>
        );
      
      case 'water':
        return (
          <div key={resource._id} className={baseCardClass}>
            <h4 className="font-medium text-gray-900 mb-2">{resource.name}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {resource.type}</p>
              <p><span className="font-medium">Capacity:</span> {(resource.capacity / 1000000).toFixed(1)}M L</p>
              <p><span className="font-medium">Quality:</span> 
                <span className={`ml-1 px-2 py-0.5 text-xs rounded ${
                  resource.waterQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                  resource.waterQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                  resource.waterQuality === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.waterQuality}
                </span>
              </p>
              <p><span className="font-medium">Availability:</span> {resource.availabilityPercentage}%</p>
            </div>
          </div>
        );
      
      case 'industry':
        return (
          <div key={resource._id} className={baseCardClass}>
            <h4 className="font-medium text-gray-900 mb-2">{resource.name}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {resource.type}</p>
              <p><span className="font-medium">H₂ Demand:</span> {resource.hydrogenDemand} tons/day</p>
              <p><span className="font-medium">Current Source:</span> {resource.currentHydrogenSource}</p>
              <p><span className="font-medium">Employees:</span> {resource.employeeCount.toLocaleString()}</p>
            </div>
          </div>
        );
      
      case 'transport':
        return (
          <div key={resource._id} className={baseCardClass}>
            <h4 className="font-medium text-gray-900 mb-2">{resource.name}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Type:</span> {resource.type}</p>
              <p><span className="font-medium">Connectivity:</span> {resource.connectivity}</p>
              <p><span className="font-medium">Traffic:</span> {resource.trafficDensity}</p>
              <p><span className="font-medium">Condition:</span> 
                <span className={`ml-1 px-2 py-0.5 text-xs rounded ${
                  resource.roadCondition === 'excellent' ? 'bg-green-100 text-green-800' :
                  resource.roadCondition === 'good' ? 'bg-blue-100 text-blue-800' :
                  resource.roadCondition === 'average' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.roadCondition}
                </span>
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-green-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Regional Resources</h2>
            <p className="text-green-200 text-sm">{region}, Gujarat</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">Resource Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-green-600">{summary.greenEnergy?.count || 0}</div>
              <div className="text-gray-600">Energy Sources</div>
              {summary.greenEnergy?.totalCapacity && (
                <div className="text-xs text-gray-500">{summary.greenEnergy.totalCapacity} MW</div>
              )}
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-blue-600">{summary.waterBodies?.count || 0}</div>
              <div className="text-gray-600">Water Bodies</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-purple-600">{summary.industries?.count || 0}</div>
              <div className="text-gray-600">Industries</div>
              {summary.industries?.totalHydrogenDemand && (
                <div className="text-xs text-gray-500">{summary.industries.totalHydrogenDemand} t/day</div>
              )}
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-lg text-gray-600">{summary.transportation?.count || 0}</div>
              <div className="text-gray-600">Transport Links</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading resources...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === 'energy' && resources.energy.map(resource => 
              renderResourceCard(resource, 'energy')
            )}
            {activeTab === 'water' && resources.water.map(resource => 
              renderResourceCard(resource, 'water')
            )}
            {activeTab === 'industry' && resources.industry.map(resource => 
              renderResourceCard(resource, 'industry')
            )}
            {activeTab === 'transport' && resources.transport.map(resource => 
              renderResourceCard(resource, 'transport')
            )}
            
            {((activeTab === 'energy' && resources.energy.length === 0) ||
              (activeTab === 'water' && resources.water.length === 0) ||
              (activeTab === 'industry' && resources.industry.length === 0) ||
              (activeTab === 'transport' && resources.transport.length === 0)) && (
              <div className="text-center py-8 text-gray-500">
                <p>No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} resources found in {region}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPanel;
