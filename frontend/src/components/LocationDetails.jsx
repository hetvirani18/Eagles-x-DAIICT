import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Star, MapPin, TrendingUp, DollarSign, Factory, Clock, Percent } from 'lucide-react';
import { clamp, toNumber } from "../lib/numeric";

const LocationDetails = ({ location, onClose, onViewFullAnalysis, embedded = false }) => {
  if (!location) return null;

  const score = clamp(location?.score ?? location?.investmentScore ?? 0, 0, 100);
  const paybackYears = toNumber(location?.paybackYears ?? location?.payback_period_years, 0);
  const costPerKg = toNumber(location?.costPerKg ?? location?.production_cost_per_kg, 0);
  const annualCapacity = toNumber(location?.annualCapacityKg ?? location?.annual_capacity_kg, 0);
  const roiPercent = toNumber(location?.roiPercent ?? location?.roi, 0);

  const getScoreColor = (score) => {
    if (score >= 270) return 'text-green-600 bg-green-50';
    if (score >= 250) return 'text-amber-600 bg-amber-50';
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
    projected_cost_per_kg: location.projectedCost || 350,
    annual_capacity_mt: location.annualCapacity || 25,
    payback_period_years: location.payback_period_years || "N/A",
    roi_percentage: location.roi_percentage || "N/A"
  };

  const coordinates = location.location
    ? [location.location.latitude, location.location.longitude]
    : location.coordinates || [0, 0];

  return (
    <>
      {/* Header - only show when not embedded */}
      {!embedded && (
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>Optimal Location</span>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Investment Score</h3>
            <Badge className={`${getScoreColor(overallScore)} font-bold`}>
              {overallScore}/300
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 inline mr-1" />
            Coordinates: {coordinates[0]?.toFixed(4) || 'N/A'}°, {coordinates[1]?.toFixed(4) || 'N/A'}°
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {getScoreLabel(overallScore)} location for green hydrogen production
          </p>
        </div>

        <Separator className="bg-border" />

        {/* Key Production Metrics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
            Key Metrics
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Cost per kg</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                ₹{productionMetrics.projected_cost_per_kg || 'N/A'}
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
        </div>

        <Separator className="bg-border" />

        {/* View Full Analysis Button */}
        <div className="pt-2">
          <Button
            onClick={onViewFullAnalysis}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Full Analysis
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Detailed cost-revenue model, projections, and financial analysis
          </p>
        </div>
      </CardContent>
    </>
  );
};

export default LocationDetails;