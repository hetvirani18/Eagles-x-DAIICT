import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Star, Zap, Factory, Droplets, MapPin, TrendingUp, DollarSign, Clock, Percent, IndianRupee, BarChart3, PieChart } from 'lucide-react';

const LocationDetails = ({ location, onClose, embedded = false }) => {
  if (!location) return null;

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
    projected_cost_per_kg: location.projectedCost || 0,
    annual_capacity_mt: location.annualCapacity || 0,
    payback_period_years: location.payback_period_years || 8,
    roi_percentage: location.roi_percentage || 12
  };
  
  // Performance metrics from optimized algorithm
  const performanceMetrics = location.performance_metrics;
  const optimizationInfo = location.optimization_info;

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

  const content = (
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
            <h3 className="font-semibold text-mocha">Investment Score</h3>
            <Badge className={`${getScoreColor(overallScore)} font-bold`}>
              {overallScore}/100
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Coordinates: {coordinates[0]?.toFixed(4) || 'N/A'}°, {coordinates[1]?.toFixed(4) || 'N/A'}°
          </p>
        </div>

        <Separator className="bg-border" />

        {/* Production Metrics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
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

        <Separator className="bg-mocha/20" />

        {/* Proximity Analysis */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
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

        <Separator className="bg-border" />

        {/* Enhanced Economic Analysis */}
        {productionMetrics && (
          <div className="space-y-4">
            <h3 className="font-semibold text-mocha flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Economic Analysis
            </h3>

            {/* Economic Scoring Details (if available) */}
            {location.economic_analysis && !location.economic_analysis.simplified && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Economic Viability Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/60 p-2 rounded">
                    <span className="text-gray-600">ROI Score:</span>
                    <span className="font-medium ml-1">{location.economic_analysis.roi_score || 'N/A'}/100</span>
                  </div>
                  <div className="bg-white/60 p-2 rounded">
                    <span className="text-gray-600">Payback Score:</span>
                    <span className="font-medium ml-1">{location.economic_analysis.payback_score || 'N/A'}/100</span>
                  </div>
                  <div className="bg-white/60 p-2 rounded">
                    <span className="text-gray-600">Cost Score:</span>
                    <span className="font-medium ml-1">{location.economic_analysis.cost_score || 'N/A'}/100</span>
                  </div>
                  <div className="bg-white/60 p-2 rounded">
                    <span className="text-gray-600">NPV Score:</span>
                    <span className="font-medium ml-1">{location.economic_analysis.npv_score || 'N/A'}/100</span>
                  </div>
                </div>
                
                {location.economic_analysis.profit_margin_percentage && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-center">
                    <span className="text-xs text-green-800">
                      💰 Profit Margin: {location.economic_analysis.profit_margin_percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Key Financial Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Production Cost</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  ₹{productionMetrics.projected_cost_per_kg || 0}/kg
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Factory className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Annual Capacity</span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {productionMetrics.annual_capacity_mt || 0} MT
                </p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">Payback Period</span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {productionMetrics.payback_period_years || 0} years
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">ROI</span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {productionMetrics.roi_percentage || 0}%
                </p>
              </div>
            </div>

            {/* Detailed Economics (if available) */}
            {productionMetrics.capex_crores && (
              <div className="space-y-3">
                <h4 className="font-medium text-mocha flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Financial Breakdown
                </h4>

                {/* Investment Breakdown */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-800 mb-2">Investment Required (CAPEX)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Investment:</span>
                      <span className="font-medium">₹{productionMetrics.capex_crores} Cr</span>
                    </div>
                    {productionMetrics.investment_breakdown && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">• Plant Construction:</span>
                          <span>₹{(productionMetrics.investment_breakdown.plant_construction / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">• Electrolyzer:</span>
                          <span>₹{(productionMetrics.investment_breakdown.electrolyzer_cost / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">• Infrastructure:</span>
                          <span>₹{(productionMetrics.investment_breakdown.infrastructure_cost / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">• Land Acquisition:</span>
                          <span>₹{(productionMetrics.investment_breakdown.land_acquisition / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Operating Costs */}
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <h5 className="text-sm font-medium text-red-800 mb-2">Annual Operating Costs (OPEX)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-600">Total Annual Cost:</span>
                      <span className="font-medium">₹{productionMetrics.opex_annual_crores} Cr/year</span>
                    </div>
                    {productionMetrics.cost_breakdown && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-500">• Electricity:</span>
                          <span>₹{(productionMetrics.cost_breakdown.electricity_cost_annual / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-500">• Water:</span>
                          <span>₹{(productionMetrics.cost_breakdown.water_cost_annual / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-500">• Labor:</span>
                          <span>₹{(productionMetrics.cost_breakdown.labor_cost_annual / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-500">• Transportation:</span>
                          <span>₹{(productionMetrics.cost_breakdown.transportation_cost_annual / 1_00_00_000).toFixed(1)} Cr</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Revenue & Profit */}
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Revenue & Profitability</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Annual Revenue:</span>
                      <span className="font-medium">₹{productionMetrics.revenue_annual_crores} Cr/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Annual Profit:</span>
                      <span className="font-medium">₹{productionMetrics.profit_annual_crores} Cr/year</span>
                    </div>
                    {productionMetrics.npv_10_years_crores && (
                      <div className="flex justify-between">
                        <span className="text-green-600">NPV (10 years):</span>
                        <span className="font-medium">₹{productionMetrics.npv_10_years_crores.toFixed(1)} Cr</span>
                      </div>
                    )}
                    {productionMetrics.irr_percentage && (
                      <div className="flex justify-between">
                        <span className="text-green-600">IRR:</span>
                        <span className="font-medium">{productionMetrics.irr_percentage.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Daily Production Economics */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Daily Production Economics</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Production Capacity:</span>
                      <span className="font-medium">{productionMetrics.capacity_kg_day || 0} kg/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Daily Revenue:</span>
                      <span className="font-medium">₹{((productionMetrics.revenue_annual_crores * 1_00_00_000) / 365).toLocaleString()} /day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Daily Profit:</span>
                      <span className="font-medium">₹{((productionMetrics.profit_annual_crores * 1_00_00_000) / 365).toLocaleString()} /day</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Separator className="bg-mocha/20" />

        {/* Dynamic Investment Recommendation */}
        <div className="bg-coconut border border-mocha/20 p-3 rounded-lg">
          <h4 className="font-medium text-mocha mb-2">Investment Recommendation</h4>
          <div className="text-sm text-mocha/80 space-y-2">
            {(() => {
              // Generate dynamic recommendation based on location data
              const generateRecommendation = () => {
                const economicScore = location.economic_score || 50;
                const infrastructureScore = location.infrastructure_score || overallScore;
                const roi = productionMetrics.roi_percentage || 0;
                const payback = productionMetrics.payback_period_years || 10;
                const costPerKg = productionMetrics.projected_cost_per_kg || 350;
                const economicGrade = location.economic_analysis?.economic_grade || '';
                const overallGrade = location.overall_grade || '';
                
                let recommendation = [];
                let investmentLevel = '';
                let riskLevel = '';
                let keyStrengths = [];
                let concerns = [];
                
                // Determine investment level
                if (overallScore >= 80) {
                  investmentLevel = 'Prime Investment Opportunity';
                  riskLevel = 'Low Risk';
                } else if (overallScore >= 70) {
                  investmentLevel = 'Excellent Investment Prospect';
                  riskLevel = 'Low-Medium Risk';
                } else if (overallScore >= 60) {
                  investmentLevel = 'Good Investment Option';
                  riskLevel = 'Medium Risk';
                } else if (overallScore >= 50) {
                  investmentLevel = 'Acceptable Investment';
                  riskLevel = 'Medium-High Risk';
                } else {
                  investmentLevel = 'High Risk Investment';
                  riskLevel = 'High Risk';
                }
                
                // Identify key strengths
                if (location.energy_score >= 80) {
                  keyStrengths.push('excellent renewable energy access');
                }
                if (location.demand_score >= 80) {
                  keyStrengths.push('strong industrial demand nearby');
                }
                if (location.water_score >= 80) {
                  keyStrengths.push('abundant water resources');
                }
                if (economicScore >= 80) {
                  keyStrengths.push('superior economic fundamentals');
                }
                if (roi >= 20) {
                  keyStrengths.push(`exceptional ROI potential (${roi}%)`);
                } else if (roi >= 15) {
                  keyStrengths.push(`strong ROI potential (${roi}%)`);
                }
                if (payback <= 5) {
                  keyStrengths.push('rapid payback period');
                }
                if (costPerKg <= 300) {
                  keyStrengths.push('highly competitive production costs');
                }
                
                // Identify concerns
                if (location.energy_score < 60) {
                  concerns.push('limited renewable energy access');
                }
                if (location.demand_score < 60) {
                  concerns.push('distant from major demand centers');
                }
                if (location.water_score < 60) {
                  concerns.push('water scarcity challenges');
                }
                if (economicScore < 50) {
                  concerns.push('challenging economic fundamentals');
                }
                if (roi < 10) {
                  concerns.push('below-target ROI projections');
                }
                if (payback > 8) {
                  concerns.push('extended payback period');
                }
                if (costPerKg > 400) {
                  concerns.push('high production costs');
                }
                
                // Build main recommendation
                recommendation.push(`This location represents a ${investmentLevel.toLowerCase()} with ${riskLevel.toLowerCase()} profile.`);
                
                if (keyStrengths.length > 0) {
                  recommendation.push(`Key advantages include ${keyStrengths.slice(0, 3).join(', ')}.`);
                }
                
                // Economic summary
                if (roi > 0 && payback > 0) {
                  if (roi >= 15 && payback <= 6) {
                    recommendation.push(`Financial projections are attractive with ${roi}% ROI and ${payback}-year payback.`);
                  } else if (roi >= 10) {
                    recommendation.push(`Economics show ${roi}% ROI with ${payback}-year payback period.`);
                  } else {
                    recommendation.push(`Financial returns are modest at ${roi}% ROI with ${payback}-year payback.`);
                  }
                }
                
                // Investment sizing recommendation
                if (productionMetrics.capex_crores) {
                  const capex = productionMetrics.capex_crores;
                  if (capex <= 20) {
                    recommendation.push(`Moderate investment requirement of ₹${capex} Cr makes this accessible for mid-scale investors.`);
                  } else if (capex <= 40) {
                    recommendation.push(`Investment requirement of ₹${capex} Cr suitable for large-scale industrial investors.`);
                  } else {
                    recommendation.push(`Significant capital requirement of ₹${capex} Cr demands consortium or institutional investment.`);
                  }
                }
                
                // Risk assessment
                if (concerns.length > 0) {
                  recommendation.push(`Consider mitigating risks from ${concerns.slice(0, 2).join(' and ')}.`);
                }
                
                // Final recommendation
                if (overallScore >= 75) {
                  recommendation.push('**Recommended for immediate consideration.**');
                } else if (overallScore >= 60) {
                  recommendation.push('**Recommended with standard due diligence.**');
                } else if (overallScore >= 45) {
                  recommendation.push('**Proceed with enhanced risk assessment.**');
                } else {
                  recommendation.push('**Not recommended without significant risk mitigation.**');
                }
                
                return recommendation.join(' ');
              };
              
              return (
                <div>
                  <p>{generateRecommendation()}</p>
                  
                  {/* Quick Stats Summary */}
                  <div className="mt-3 p-2 bg-gray-50 rounded border text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <span><strong>Grade:</strong> {location.overall_grade || getScoreLabel(overallScore)}</span>
                      {location.economic_analysis?.economic_grade && (
                        <span><strong>Economics:</strong> {location.economic_analysis.economic_grade.split(' ')[0]}</span>
                      )}
                      {productionMetrics.roi_percentage > 0 && (
                        <span><strong>ROI:</strong> {productionMetrics.roi_percentage}%</span>
                      )}
                      {productionMetrics.payback_period_years > 0 && (
                        <span><strong>Payback:</strong> {productionMetrics.payback_period_years}y</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Performance Metrics (if available) */}
        {(performanceMetrics || optimizationInfo) && (
          <>
            <Separator className="bg-mocha/20" />
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analysis Performance
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {performanceMetrics?.execution_time_seconds && (
                  <div>
                    <p className="text-xs text-green-600 uppercase tracking-wide">Query Time</p>
                    <p className="font-medium text-green-800">
                      {performanceMetrics.execution_time_seconds}s
                    </p>
                  </div>
                )}
                {performanceMetrics?.optimization_level && (
                  <div>
                    <p className="text-xs text-green-600 uppercase tracking-wide">Optimization</p>
                    <Badge variant="outline" className="border-green-300 text-green-700 capitalize">
                      {performanceMetrics.optimization_level}
                    </Badge>
                  </div>
                )}
                {optimizationInfo?.assets_processed && (
                  <div className="col-span-2">
                    <p className="text-xs text-green-600 uppercase tracking-wide mb-1">Assets Analyzed</p>
                    <div className="text-xs text-green-700 grid grid-cols-3 gap-1">
                      <span>Energy: {optimizationInfo.assets_processed.energy_sources}</span>
                      <span>Demand: {optimizationInfo.assets_processed.demand_centers}</span>
                      <span>Water: {optimizationInfo.assets_processed.water_sources + optimizationInfo.assets_processed.water_bodies}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </>
  );

  // Return content wrapped in Card when not embedded
  if (!embedded) {
    return (
      <Card className="w-full max-w-md h-fit border-border bg-card">
        {content}
      </Card>
    );
  }

  // Return content directly when embedded
  return content;
};

export default LocationDetails;