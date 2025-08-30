import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Star, Zap, Factory, Droplets, MapPin, TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';

const LocationDetails = ({ location, onClose }) => {
  if (!location) return null;

  const getScoreColor = (score) => {
    if (score >= 270) return 'text-green-600 bg-green-50';
    if (score >= 250) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 270) return 'Excellent';
    if (score >= 250) return 'Good';
    return 'Fair';
  };

  // Handle both old mock data structure and new API data structure
  const overallScore = location.overall_score || location.score || 0;
  const productionMetrics = location.production_metrics || {
    projected_cost_per_kg: location.projectedCost || 0,
    annual_capacity_mt: location.annualCapacity || 0,
    payback_period_years: location.payback_period_years || 8,
    roi_percentage: location.roi_percentage || 12
  };

  const coordinates = location.location 
    ? [location.location.latitude, location.location.longitude]
    : location.coordinates || [0, 0];

  // Proximity data with fallback to old structure
  const proximityData = {
    energy: location.nearest_energy || location.nearestEnergy || {},
    demand: location.nearest_demand || location.nearestDemand || {},
    water: location.nearest_water || location.nearestWater || {},
    pipeline: location.nearest_pipeline || location.nearestPipeline || {},
    transport: location.nearest_transport || location.nearestTransport || {}
  };

  return (
    <Card className="w-full max-w-md h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>Optimal Location</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(overallScore)}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {getScoreLabel(overallScore)} - {overallScore}/300
          </div>
          <p className="text-sm text-gray-600">
            Coordinates: {coordinates[0]?.toFixed(4) || 'N/A'}°, {coordinates[1]?.toFixed(4) || 'N/A'}°
          </p>
        </div>

        <Separator />

        {/* Production Metrics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700">
            Production Potential
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Cost per kg</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                ₹{productionMetrics.projected_cost_per_kg}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Factory className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Annual Capacity</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {productionMetrics.annual_capacity_mt?.toLocaleString() || 'N/A'} MT
              </p>
            </div>
          </div>
          
          {/* Additional Financial Metrics */}
          {(productionMetrics.payback_period_years || productionMetrics.roi_percentage) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">Payback Period</span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {productionMetrics.payback_period_years || 'N/A'} years
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">Expected ROI</span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {productionMetrics.roi_percentage || 'N/A'}%
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Proximity Analysis */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700">
            Proximity Analysis
          </h3>
          
          {/* Energy Source */}
          {proximityData.energy?.nearest_source && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-amber-900">
                  {proximityData.energy.nearest_source}
                </p>
                <p className="text-sm text-amber-700">
                  {proximityData.energy.type} Power
                  {proximityData.energy.capacity_mw && ` - ${proximityData.energy.capacity_mw} MW`}
                </p>
                <Badge variant="outline" className="mt-1 text-xs border-amber-300 text-amber-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {proximityData.energy.distance_km} km away
                </Badge>
              </div>
            </div>
          )}

          {/* Demand Center */}
          {proximityData.demand?.nearest_center && (
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <Factory className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-red-900">
                  {proximityData.demand.nearest_center}
                </p>
                <p className="text-sm text-red-700">
                  {proximityData.demand.type}
                  {proximityData.demand.demand_mt_year && 
                    ` - ${proximityData.demand.demand_mt_year.toLocaleString()} MT/year`}
                </p>
                <Badge variant="outline" className="mt-1 text-xs border-red-300 text-red-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {proximityData.demand.distance_km} km away
                </Badge>
              </div>
            </div>
          )}

          {/* Water Source */}
          {proximityData.water?.nearest_source && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-blue-900">
                  {proximityData.water.nearest_source}
                </p>
                <p className="text-sm text-blue-700">
                  {proximityData.water.type}
                </p>
                <Badge variant="outline" className="mt-1 text-xs border-blue-300 text-blue-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {proximityData.water.distance_km} km away
                </Badge>
              </div>
            </div>
          )}

          {/* Pipeline Infrastructure */}
          {proximityData.pipeline?.nearest_pipeline && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">⛽</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">
                  {proximityData.pipeline.nearest_pipeline}
                </p>
                <p className="text-sm text-gray-700">
                  Gas Pipeline - {proximityData.pipeline.operator}
                </p>
                <Badge variant="outline" className="mt-1 text-xs border-gray-300 text-gray-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {proximityData.pipeline.distance_km} km away
                </Badge>
              </div>
            </div>
          )}

          {/* Transportation */}
          {proximityData.transport?.nearest_road && (
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">🛣️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-indigo-900">
                  {proximityData.transport.nearest_road}
                </p>
                <p className="text-sm text-indigo-700">
                  {proximityData.transport.type}
                  {proximityData.transport.connectivity_score && 
                    ` - Score: ${proximityData.transport.connectivity_score}/100`}
                </p>
                <Badge variant="outline" className="mt-1 text-xs border-indigo-300 text-indigo-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {proximityData.transport.distance_km} km away
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Investment Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Investment Recommendation</h4>
          <p className="text-sm text-gray-700">
            This location offers {getScoreLabel(overallScore).toLowerCase()} potential for green hydrogen production 
            with competitive costs and strategic positioning near key infrastructure. 
            {productionMetrics.roi_percentage && productionMetrics.roi_percentage > 15 && 
              ' High ROI potential makes this an attractive investment opportunity.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationDetails;