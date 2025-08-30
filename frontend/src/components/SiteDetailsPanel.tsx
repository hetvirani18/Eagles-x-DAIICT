import React, { useState, useEffect } from 'react';
import type { OptimalSite, SiteAnalysis } from '../types';
import ApiService from '../services/api';

interface SiteDetailsPanelProps {
  site: OptimalSite;
  onClose: () => void;
  onShowResources: () => void;
}

const SiteDetailsPanel: React.FC<SiteDetailsPanelProps> = ({
  site,
  onClose,
  onShowResources
}) => {
  const [detailedAnalysis, setDetailedAnalysis] = useState<SiteAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetailedAnalysis = async () => {
      // Skip API call for demo sites
      if (site._id.startsWith('demo')) {
        console.log('Skipping API call for demo site:', site._id);
        setDetailedAnalysis({
          site,
          detailedAnalysis: {
            strengths: [
              'Excellent proximity to renewable energy sources',
              'Strong water resource availability',
              'Close to major hydrogen consumers',
              'Favorable government policies and incentives'
            ],
            challenges: [
              'Higher land acquisition costs',
              'Requires infrastructure development',
              'Need for skilled workforce development'
            ],
            recommendations: [
              'Priority site for development - all key factors favorable',
              'Conduct detailed environmental impact assessment',
              'Negotiate long-term power purchase agreements',
              'Establish partnerships with local energy providers'
            ]
          }
        });
        return;
      }

      setIsLoading(true);
      try {
        const analysis = await ApiService.getSiteDetails(site._id);
        setDetailedAnalysis(analysis);
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
        // Mock detailed analysis for demonstration
        setDetailedAnalysis({
          site,
          detailedAnalysis: {
            strengths: [
              'Excellent proximity to renewable energy sources',
              'Strong water resource availability',
              'Close to major hydrogen consumers'
            ],
            challenges: [
              'Higher land acquisition costs',
              'Requires infrastructure development'
            ],
            recommendations: [
              'Priority site for development - all key factors favorable',
              'Conduct detailed environmental impact assessment',
              'Negotiate long-term power purchase agreements'
            ]
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedAnalysis();
  }, [site]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Safe calculation with fallback values
  const totalCost = (site.estimatedCosts?.landAcquisition || 0) + 
                   (site.estimatedCosts?.infrastructure || 0) + 
                   (site.estimatedCosts?.connectivity || 0);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {site.isGoldenLocation && (
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-yellow-900 font-bold text-lg">⭐</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Site Analysis
              </h2>
              <p className="text-blue-200 text-sm flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {site.district}, Gujarat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Overall Viability Score</h3>
            {site.isGoldenLocation && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-xs font-bold">
                GOLDEN SITE
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {site.overallScore.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${(site.overallScore / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {site.overallScore >= 8 ? 'Excellent' : site.overallScore >= 6 ? 'Good' : 'Fair'} viability rating
              </p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Green Energy Access', score: site.scores.greenEnergyScore, weight: '30%' },
              { label: 'Water Resource Availability', score: site.scores.waterAccessScore, weight: '25%' },
              { label: 'Industry Proximity', score: site.scores.industryProximityScore, weight: '25%' },
              { label: 'Transportation Access', score: site.scores.transportationScore, weight: '20%' }
            ].map((item) => (
              <div key={item.label} className={`p-3 rounded-lg ${getScoreBg(item.score)}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{item.weight}</span>
                    <span className={`font-bold ${getScoreColor(item.score)}`}>
                      {item.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.score >= 80 ? 'bg-green-500' : 
                      item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest Key Factors */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Nearest Key Factors
            </h3>
            <button
              onClick={onShowResources}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              View All Resources →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {site.nearestResources?.greenEnergy && (
              <div className="bg-green-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Green Energy</h4>
                      <div className="px-2 py-1 rounded-md text-xs font-bold text-green-700 bg-white/70">
                        {site.nearestResources.greenEnergy.distance} km
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-sm mb-1">{site.nearestResources.greenEnergy.name}</p>
                    <p className="text-gray-500 text-xs">Renewable power source</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(10, Math.min(100, 100 - (site.nearestResources.greenEnergy.distance * 5)))}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {site.nearestResources?.waterBody && (
              <div className="bg-blue-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">💧</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Water Source</h4>
                      <div className="px-2 py-1 rounded-md text-xs font-bold text-blue-700 bg-white/70">
                        {site.nearestResources.waterBody.distance} km
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-sm mb-1">{site.nearestResources.waterBody.name}</p>
                    <p className="text-gray-500 text-xs">Water for electrolysis</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(10, Math.min(100, 100 - (site.nearestResources.waterBody.distance * 5)))}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {site.nearestResources?.industry && (
              <div className="bg-purple-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">🏭</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Industry</h4>
                      <div className="px-2 py-1 rounded-md text-xs font-bold text-purple-700 bg-white/70">
                        {site.nearestResources.industry.distance} km
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-sm mb-1">{site.nearestResources.industry.name}</p>
                    <p className="text-gray-500 text-xs">Hydrogen consumers</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(10, Math.min(100, 100 - (site.nearestResources.industry.distance * 5)))}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {site.nearestResources?.transportation && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center text-white shadow-md">
                    <span className="text-lg">🚛</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Transportation</h4>
                      <div className="px-2 py-1 rounded-md text-xs font-bold text-gray-700 bg-white/70">
                        {site.nearestResources.transportation.distance} km
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-sm mb-1">{site.nearestResources.transportation.name}</p>
                    <p className="text-gray-500 text-xs">Logistics & distribution</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-gray-400 to-gray-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(10, Math.min(100, 100 - (site.nearestResources.transportation.distance * 5)))}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Fallback message if no resources */}
          {(!site.nearestResources || Object.keys(site.nearestResources).length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No nearby resources data available</p>
            </div>
          )}
        </div>

        {/* Cost Estimates */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Estimated Development Costs</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Land Acquisition</span>
                <span className="font-medium">₹{site.estimatedCosts?.landAcquisition || 0} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Infrastructure Development</span>
                <span className="font-medium">₹{site.estimatedCosts?.infrastructure || 0} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Connectivity Setup</span>
                <span className="font-medium">₹{site.estimatedCosts?.connectivity || 0} Cr</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Estimated Cost</span>
                <span className="text-blue-600">₹{totalCost} Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading detailed analysis...</p>
          </div>
        ) : detailedAnalysis && (
          <>
            {/* Strengths */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Strengths</h3>
              <ul className="space-y-2">
                {detailedAnalysis.detailedAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Potential Challenges</h3>
              <ul className="space-y-2">
                {detailedAnalysis.detailedAnalysis.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span className="text-sm text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {detailedAnalysis.detailedAnalysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">💡</span>
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Export Button */}
        <div className="pt-4 border-t">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Export Site Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteDetailsPanel;
