import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Star, Zap, Factory, Droplets, MapPin, TrendingUp, DollarSign, Clock, Percent, IndianRupee, BarChart3, PieChart, Calculator, Brain, AlertTriangle } from 'lucide-react';
import AdvancedInvestmentAnalysis from './AdvancedInvestmentAnalysis';

const LocationDetails = ({ location, onClose, embedded = false }) => {
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  
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
    payback_period_years: location.payback_period_years || location.production_metrics?.payback_period_years || "N/A",
    roi_percentage: location.roi_percentage || location.production_metrics?.roi_percentage || "N/A"
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
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowAdvancedAnalysis(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis
              </Button>
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
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
          {(() => {
            // Use algorithm data instead of hardcoded calculations for Production Potential
            const useAlgorithmMetrics = () => {
              const algorithmMetrics = location.production_metrics || {};
              
              // Use algorithm-calculated values directly when available
              const projected_cost_per_kg = algorithmMetrics.projected_cost_per_kg || 
                                           (productionMetrics.projected_cost_per_kg || 350);
              const annual_capacity_mt = algorithmMetrics.annual_capacity_mt || 
                                        (productionMetrics.annual_capacity_mt || 25);
              const payback_period_years = algorithmMetrics.payback_period_years || 
                                          (productionMetrics.payback_period_years || "N/A");
              const roi_percentage = algorithmMetrics.roi_percentage || 
                                    (productionMetrics.roi_percentage || "N/A");
              
              return {
                projected_cost_per_kg: Math.round(projected_cost_per_kg),
                annual_capacity_mt: Math.round(annual_capacity_mt * 10) / 10,
                payback_period_years: payback_period_years === "N/A" ? "N/A" : 
                                     (Number.isFinite(payback_period_years) ? 
                                      Math.round(payback_period_years * 10) / 10 : "Never"),
                roi_percentage: roi_percentage === "N/A" ? "N/A" : 
                               Math.round(roi_percentage * 10) / 10
              };
            };

            const dynamicMetrics = useAlgorithmMetrics();

            return (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-800">Cost per kg</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      ₹{dynamicMetrics.projected_cost_per_kg}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Factory className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-800">Annual Capacity</span>
                    </div>
                    <p className="text-lg font-bold text-green-900">
                      {dynamicMetrics.annual_capacity_mt?.toLocaleString() || 'N/A'} MT
                    </p>
                  </div>
                </div>
                
                {/* Additional Financial Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-800">Payback Period</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900">
                      {dynamicMetrics.payback_period_years} years
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Percent className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-medium text-orange-800">Expected ROI</span>
                    </div>
                    <p className="text-lg font-bold text-orange-900">
                      {dynamicMetrics.roi_percentage}%
                    </p>
                  </div>
                </div>
              </>
            );
          })()}
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
        {(() => {
          // Use algorithm data for Economic Analysis section
          const getAlgorithmEconomicData = () => {
            const algorithmMetrics = location.production_metrics || {};
            
            // Use algorithm-calculated values directly
            const projected_cost_per_kg = algorithmMetrics.projected_cost_per_kg || 
                                         (productionMetrics.projected_cost_per_kg || 350);
            const annual_capacity_mt = algorithmMetrics.annual_capacity_mt || 
                                      (productionMetrics.annual_capacity_mt || 25);
            const payback_period_years = algorithmMetrics.payback_period_years || 
                                        (productionMetrics.payback_period_years || "N/A");
            const roi_percentage = algorithmMetrics.roi_percentage || 
                                  (productionMetrics.roi_percentage || "N/A");
            
            return {
              projected_cost_per_kg: Math.round(projected_cost_per_kg),
              annual_capacity_mt: Math.round(annual_capacity_mt * 10) / 10,
              payback_period_years: payback_period_years === "N/A" ? "N/A" : 
                                   (Number.isFinite(payback_period_years) ? 
                                    Math.round(payback_period_years * 10) / 10 : "Never"),
              roi_percentage: roi_percentage === "N/A" ? "N/A" : 
                             Math.round(roi_percentage * 10) / 10
            };
          };

          const dynamicMetrics = getAlgorithmEconomicData();

          return (
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
                    ₹{dynamicMetrics.projected_cost_per_kg}/kg
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Factory className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">Annual Capacity</span>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {dynamicMetrics.annual_capacity_mt} MT
                  </p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-800">Payback Period</span>
                  </div>
                  <p className="text-lg font-bold text-orange-900">
                    {dynamicMetrics.payback_period_years} years
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-800">ROI</span>
                  </div>
                  <p className="text-lg font-bold text-purple-900">
                    {dynamicMetrics.roi_percentage}%
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        <Separator className="bg-border" />

        <div className="space-y-3">
                <h4 className="font-medium text-mocha flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Complete Investment Analysis
                </h4>

                {(() => {
                  // Use algorithm-calculated data instead of hardcoded calculations
                  const calculateAlgorithmBasedInvestment = () => {
                    // Get algorithm data from backend calculations
                    const algorithmMetrics = location.production_metrics || {};
                    const energyData = proximityData.energy || {};
                    const demandData = proximityData.demand || {};
                    const waterData = proximityData.water || {};
                    const transportData = proximityData.transport || {};
                    
                    // Use algorithm-calculated capacity, not hardcoded values
                    const capacity_kg_day = algorithmMetrics.capacity_kg_day || 
                                          (algorithmMetrics.annual_capacity_mt ? 
                                           Math.round(algorithmMetrics.annual_capacity_mt * 1000 / 330) : 30000);
                    
                    // Calculate dynamic land costs based on proximity to infrastructure
                    const energyDistance = energyData.distance_km || 50;
                    const baseUrbanLevel = energyDistance < 15 ? 'urban' : energyDistance < 30 ? 'semi-urban' : 'rural';
                    let landPricePerAcre = baseUrbanLevel === 'urban' ? 3.2 : 
                                          baseUrbanLevel === 'semi-urban' ? 2.1 : 1.6;
                    
                    // Adjust land cost based on overall infrastructure score
                    const infrastructureBonus = (overallScore - 200) / 100 * 0.8;
                    landPricePerAcre += Math.max(0, infrastructureBonus);
                    
                    // Calculate dynamic land requirement based on actual capacity
                    const landRequired = Math.max(8, capacity_kg_day / 150); 
                    const landCost = landRequired * landPricePerAcre;
                    
                    // Calculate electricity costs based on energy source data
                    let electricityRate = energyData.cost_per_kwh || 3.2; // Use actual energy cost if available
                    if (!energyData.cost_per_kwh) {
                      // Fallback calculation based on energy type and distance
                      const energyType = energyData.type?.toLowerCase() || 'grid';
                      electricityRate = energyType.includes('solar') ? 2.8 : 
                                       energyType.includes('wind') ? 3.0 : 3.5;
                      // Add distance penalty for transmission
                      electricityRate += (energyDistance / 20) * 0.3;
                    }
                    
                    // Calculate water costs based on water source proximity and quality
                    const waterDistance = waterData.distance_km || 25;
                    const waterType = waterData.type?.toLowerCase() || 'municipal';
                    let waterCostMultiplier = waterType.includes('river') ? 0.8 : 
                                             waterType.includes('ground') ? 1.0 : 1.2;
                    waterCostMultiplier += (waterDistance / 30) * 0.4; // Distance penalty
                    const annualWater = (capacity_kg_day / 1000) * 0.7 * waterCostMultiplier;
                    
                    // Use algorithm CAPEX if available, otherwise calculate based on capacity
                    let totalCapex = algorithmMetrics.capex_crores;
                    if (!totalCapex) {
                      // Calculate equipment costs based on actual capacity
                      const electrolyzerCost = (capacity_kg_day / 1000) * 28;
                      const powerElectronics = electrolyzerCost * 0.32;
                      const gasProcessing = electrolyzerCost * 0.68;
                      const compression = electrolyzerCost * 0.38;
                      const installation = electrolyzerCost * 0.22;
                      
                      // Infrastructure costs scale with capacity and location
                      const electricalSubstation = (capacity_kg_day / 1000) * 5.2;
                      const waterTreatment = (capacity_kg_day / 1000) * 4.1 * waterCostMultiplier;
                      const buildings = (capacity_kg_day / 1000) * 5.8;
                      
                      // Transport connectivity costs based on transport data
                      const connectivityScore = transportData.connectivity_score || 0.7;
                      const transportDistance = transportData.distance_km || 40;
                      const connectivityCost = (1 - connectivityScore) * (capacity_kg_day / 1000) * 3.0;
                      const accessRoadCost = Math.max(0, (transportDistance - 10) / 10) * 0.8;
                      
                      // Permits based on location complexity
                      const permitsBase = (capacity_kg_day / 1000) * 12;
                      const locationComplexity = baseUrbanLevel === 'urban' ? 1.4 : 
                                                baseUrbanLevel === 'semi-urban' ? 1.1 : 0.9;
                      const permitsCost = permitsBase * locationComplexity;
                      
                      const equipmentTotal = electrolyzerCost + powerElectronics + gasProcessing + compression + installation;
                      const infrastructureTotal = electricalSubstation + waterTreatment + buildings + connectivityCost + accessRoadCost;
                      const totalBeforeWC = landCost + equipmentTotal + infrastructureTotal + permitsCost;
                      const workingCapital = totalBeforeWC * 0.12;
                      
                      totalCapex = totalBeforeWC + workingCapital;
                    }
                    
                    // Calculate operational costs based on location factors
                    const annualElectricity = (capacity_kg_day * 365 * 0.87 * 52 * electricityRate) / 10_000_000;
                    
                    // Labor costs based on location (urban vs rural wage differences)
                    const laborMultiplier = baseUrbanLevel === 'urban' ? 1.3 : 
                                          baseUrbanLevel === 'semi-urban' ? 1.1 : 0.9;
                    const staffCount = Math.max(28, capacity_kg_day / 1800);
                    const annualStaff = (staffCount / 25) * 4.2 * laborMultiplier;
                    
                    const annualMaintenance = totalCapex * 0.018;
                    const annualOther = (annualElectricity + annualWater + annualStaff + annualMaintenance) * 0.12;
                    
                    // Revenue calculation based on demand proximity and volume
                    const demandDistance = demandData.distance_km || 35;
                    const demandVolume = demandData.demand_mt_year || 5000;
                    let hydrogenPrice = algorithmMetrics.projected_cost_per_kg || 380;
                    
                    // Adjust price based on market proximity and demand strength
                    if (demandDistance < 20 && demandVolume > 8000) {
                      hydrogenPrice *= 1.15; // Premium for strong local demand
                    } else if (demandDistance > 40 || demandVolume < 3000) {
                      hydrogenPrice *= 0.92; // Discount for distant/weak markets
                    }
                    
                    const annualProduction = capacity_kg_day * 365 * 0.87;
                    const annualRevenue = (annualProduction * hydrogenPrice) / 10_000_000;
                    const totalOpex = annualElectricity + annualWater + annualStaff + annualMaintenance + annualOther;
                    const annualProfit = annualRevenue - totalOpex;
                    
                    // Use algorithm ROI and payback if available
                    const roi = algorithmMetrics.roi_percentage || ((annualProfit / totalCapex) * 100);
                    const payback = algorithmMetrics.payback_period_years || 
                                   (annualProfit > 0 ? (totalCapex / annualProfit) : Number.POSITIVE_INFINITY);
                    
                    return {
                      capacity_kg_day: Math.round(capacity_kg_day),
                      land_required_acres: Math.round(landRequired * 10) / 10,
                      land_cost: Math.round(landCost * 10) / 10,
                      electrolyzer_cost: Math.round((totalCapex * 0.35) * 10) / 10,
                      power_electronics: Math.round((totalCapex * 0.11) * 10) / 10,
                      gas_processing: Math.round((totalCapex * 0.18) * 10) / 10,
                      compression: Math.round((totalCapex * 0.12) * 10) / 10,
                      installation: Math.round((totalCapex * 0.08) * 10) / 10,
                      equipment_total: Math.round((totalCapex * 0.84) * 10) / 10,
                      electrical_substation: Math.round((totalCapex * 0.08) * 10) / 10,
                      water_treatment: Math.round((totalCapex * 0.06) * 10) / 10,
                      buildings: Math.round((totalCapex * 0.02) * 10) / 10,
                      infrastructure_total: Math.round((totalCapex * 0.16) * 10) / 10,
                      permits_cost: Math.round((totalCapex * 0.04) * 10) / 10,
                      working_capital: Math.round((totalCapex * 0.12) * 10) / 10,
                      total_capex: Math.round(totalCapex * 10) / 10,
                      annual_electricity: Math.round(annualElectricity * 10) / 10,
                      annual_water: Math.round(annualWater * 10) / 10,
                      annual_staff: Math.round(annualStaff * 10) / 10,
                      annual_maintenance: Math.round(annualMaintenance * 10) / 10,
                      annual_other: Math.round(annualOther * 10) / 10,
                      total_opex: Math.round(totalOpex * 10) / 10,
                      annual_revenue: Math.round(annualRevenue * 10) / 10,
                      annual_profit: Math.round(annualProfit * 10) / 10,
                      roi_percentage: Math.round(roi * 10) / 10,
                      payback_years: Number.isFinite(payback) ? Math.round(payback * 10) / 10 : Infinity,
                      hydrogen_price: Math.round(hydrogenPrice),
                      electricity_rate: Math.round(electricityRate * 100) / 100,
                      staff_count: Math.round(staffCount),
                      land_price_per_acre: Math.round(landPricePerAcre * 100) / 100
                    };
                  };
                  
                  const dynamicData = calculateAlgorithmBasedInvestment();
                  
                  return (
                    <>
                      {/* Total Investment Required */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-center mb-3">
                          <div className="text-3xl font-bold text-purple-600">
                            ₹{dynamicData.total_capex}Cr
                          </div>
                          <p className="text-sm text-purple-700">Total Investment Required</p>
                          <p className="text-xs text-gray-600 mt-1">
                            For {dynamicData.capacity_kg_day} kg/day Green H₂ Plant
                          </p>
                          <p className="text-xs text-purple-600 mt-1">
                            Location Score: {overallScore || 0}/300 • 
                            Land: ₹{dynamicData.land_price_per_acre}Cr/acre • 
                            Power: ₹{dynamicData.electricity_rate}/kWh
                          </p>
                        </div>
                      </div>

                      {/* Land & Site Development */}
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <h5 className="text-sm font-medium text-orange-700 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Land & Site Development
                        </h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Land Acquisition ({dynamicData.land_required_acres} acres):</span>
                            <span className="font-medium">₹{dynamicData.land_cost}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Site Preparation & Access:</span>
                            <span className="font-medium">₹{(dynamicData.land_cost * 0.25).toFixed(1)}Cr</span>
                          </div>
                          <div className="border-t pt-1 mt-1">
                            <div className="flex justify-between font-medium text-orange-700">
                              <span>Subtotal:</span>
                              <span>₹{(dynamicData.land_cost * 1.25).toFixed(1)}Cr</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Equipment & Technology */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h5 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          Equipment & Technology
                        </h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>PEM Electrolyzer Stack:</span>
                            <span className="font-medium">₹{dynamicData.electrolyzer_cost}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Power Electronics & Controls:</span>
                            <span className="font-medium">₹{dynamicData.power_electronics}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gas Processing & Storage:</span>
                            <span className="font-medium">₹{dynamicData.gas_processing}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Compression Systems:</span>
                            <span className="font-medium">₹{dynamicData.compression}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Installation & Commissioning:</span>
                            <span className="font-medium">₹{dynamicData.installation}Cr</span>
                          </div>
                          <div className="border-t pt-1 mt-1">
                            <div className="flex justify-between font-medium text-blue-700">
                              <span>Subtotal:</span>
                              <span>₹{dynamicData.equipment_total}Cr</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Infrastructure & Utilities */}
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                          <Factory className="w-4 h-4 mr-1" />
                          Infrastructure & Utilities
                        </h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Electrical Substation:</span>
                            <span className="font-medium">₹{dynamicData.electrical_substation}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Water Treatment & Cooling:</span>
                            <span className="font-medium">₹{dynamicData.water_treatment}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Buildings & Safety Systems:</span>
                            <span className="font-medium">₹{dynamicData.buildings}Cr</span>
                          </div>
                          <div className="border-t pt-1 mt-1">
                            <div className="flex justify-between font-medium text-green-700">
                              <span>Subtotal:</span>
                              <span>₹{dynamicData.infrastructure_total}Cr</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Operating Costs */}
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <h5 className="text-sm font-medium text-red-800 mb-2">Annual Operating Costs</h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Electricity @ ₹{dynamicData.electricity_rate}/kWh:</span>
                            <span className="font-medium">₹{dynamicData.annual_electricity}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Water & Consumables:</span>
                            <span className="font-medium">₹{dynamicData.annual_water}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Staff & Admin ({dynamicData.staff_count} people):</span>
                            <span className="font-medium">₹{dynamicData.annual_staff}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maintenance & Insurance:</span>
                            <span className="font-medium">₹{dynamicData.annual_maintenance}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Other Operating Expenses:</span>
                            <span className="font-medium">₹{dynamicData.annual_other}Cr</span>
                          </div>
                          <div className="border-t pt-1 mt-1">
                            <div className="flex justify-between font-medium text-red-700">
                              <span>Total Annual OPEX:</span>
                              <span>₹{dynamicData.total_opex}Cr</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Revenue & Profitability */}
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <h5 className="text-sm font-medium text-emerald-700 mb-2 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Revenue & Returns
                        </h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Annual Production:</span>
                            <span className="font-medium">{Math.round(dynamicData.capacity_kg_day * 365 * 0.85 / 1000)} tonnes (85% capacity)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Selling Price (Market-adjusted):</span>
                            <span className="font-medium">₹{dynamicData.hydrogen_price}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Revenue:</span>
                            <span className="font-medium">₹{dynamicData.annual_revenue}Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Profit (Before Tax):</span>
                            <span className="font-medium text-emerald-600">₹{dynamicData.annual_profit}Cr</span>
                          </div>
                          <div className="border-t pt-1 mt-1">
                            <div className="flex justify-between font-medium text-emerald-700">
                              <span>ROI (Annual):</span>
                              <span>{dynamicData.roi_percentage}%</span>
                            </div>
                            <div className="flex justify-between font-medium text-emerald-700">
                              <span>Payback Period:</span>
                              <span>{Number.isFinite(dynamicData.payback_years) ? `${dynamicData.payback_years} years` : 'Never'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investment Grade */}
                      <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-2">
                          Investment Grade: {(() => {
                            if (dynamicData.roi_percentage > 20 && dynamicData.payback_years < 6) return 'A+ (Excellent)';
                            if (dynamicData.roi_percentage > 15 && dynamicData.payback_years < 8) return 'A (Very Good)';
                            if (dynamicData.roi_percentage > 12 && dynamicData.payback_years < 10) return 'B+ (Good)';
                            if (dynamicData.roi_percentage > 8) return 'B (Fair)';
                            return 'C (Poor)';
                          })()}
                        </div>
                        <p className="text-xs text-gray-600">
                          Based on {dynamicData.capacity_kg_day} kg/day capacity at this specific location
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Factors: Proximity to energy sources, demand centers, infrastructure quality
                        </p>
                      </div>
                    </>
                  );
                })()}
        </div>

      </CardContent>
    </>
  );

  // Return content wrapped in Card when not embedded
  if (!embedded) {
    return (
      <>
        <Card className="w-full max-w-md h-fit border-border bg-card">
          {content}
        </Card>
        {showAdvancedAnalysis && (
          <AdvancedInvestmentAnalysis 
            location={{ lat: coordinates[0], lng: coordinates[1] }}
            onClose={() => setShowAdvancedAnalysis(false)}
          />
        )}
      </>
    );
  }

  // Return content directly when embedded
  return (
    <>
      {content}
      {showAdvancedAnalysis && (
        <AdvancedInvestmentAnalysis 
          location={{ lat: coordinates[0], lng: coordinates[1] }}
          onClose={() => setShowAdvancedAnalysis(false)}
        />
      )}
    </>
  );
};

export default LocationDetails;