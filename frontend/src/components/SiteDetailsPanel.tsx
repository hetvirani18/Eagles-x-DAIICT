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

        {/* Nearest Resources */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Nearest Resources</h3>
            <button
              onClick={onShowResources}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Resources →
            </button>
          </div>
          <div className="space-y-3">
            {[
              { 
                icon: '⚡', 
                label: 'Green Energy', 
                resource: site.nearestResources?.greenEnergy,
                color: 'text-green-600'
              },
              { 
                icon: '💧', 
                label: 'Water Source', 
                resource: site.nearestResources?.waterBody,
                color: 'text-blue-600'
              },
              { 
                icon: '🏭', 
                label: 'Industry', 
                resource: site.nearestResources?.industry,
                color: 'text-purple-600'
              },
              { 
                icon: '🛣️', 
                label: 'Transportation', 
                resource: site.nearestResources?.transportation,
                color: 'text-gray-600'
              }
            ].filter(item => item.resource).map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-gray-600">{item.resource.name}</p>
                    </div>
                  </div>
                  <div className={`text-right ${item.color}`}>
                    <p className="font-bold text-sm">{item.resource.distance} km</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
