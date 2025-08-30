import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Star,
  Zap,
  Factory,
  Droplets,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  Percent,
  IndianRupee,
  BarChart3,
  PieChart,
  Calculator,
  Brain,
  AlertTriangle,
} from "lucide-react";
import AdvancedInvestmentAnalysis from "./AdvancedInvestmentAnalysis";

const LocationDetails = ({ location, onClose, embedded = false }) => {
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);

  if (!location) return null;

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Fair";
  };

  // Handle both old mock data structure and new API data structure
  const overallScore = location.overall_score || location.score || 0;
  const productionMetrics = location.production_metrics || {
    projected_cost_per_kg: location.projectedCost || 0,
    annual_capacity_mt: location.annualCapacity || 0,
    payback_period_years: location.payback_period_years || 8,
    roi_percentage: location.roi_percentage || 12,
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
    transport: location.nearest_transport || location.nearestTransport || {},
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
            Coordinates: {coordinates[0]?.toFixed(4) || "N/A"}°,{" "}
            {coordinates[1]?.toFixed(4) || "N/A"}°
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
                <span className="text-xs font-medium text-blue-800">
                  Cost per kg
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                ₹{productionMetrics.projected_cost_per_kg}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Factory className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">
                  Annual Capacity
                </span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {productionMetrics.annual_capacity_mt?.toLocaleString() ||
                  "N/A"}{" "}
                MT
              </p>
            </div>
          </div>

          {/* Additional Financial Metrics */}
          {(productionMetrics.payback_period_years ||
            productionMetrics.roi_percentage) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">
                    Payback Period
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {productionMetrics.payback_period_years || "N/A"} years
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">
                    Expected ROI
                  </span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {productionMetrics.roi_percentage || "N/A"}%
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
                  {proximityData.energy.capacity_mw &&
                    ` - ${proximityData.energy.capacity_mw} MW`}
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-amber-300 text-amber-700"
                >
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
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-red-300 text-red-700"
                >
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
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-blue-300 text-blue-700"
                >
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
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-gray-300 text-gray-700"
                >
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
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-indigo-300 text-indigo-700"
                >
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
            {location.economic_analysis &&
              !location.economic_analysis.simplified && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Economic Viability Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/60 p-2 rounded">
                      <span className="text-gray-600">ROI Score:</span>
                      <span className="font-medium ml-1">
                        {location.economic_analysis.roi_score || "N/A"}/100
                      </span>
                    </div>
                    <div className="bg-white/60 p-2 rounded">
                      <span className="text-gray-600">Payback Score:</span>
                      <span className="font-medium ml-1">
                        {location.economic_analysis.payback_score || "N/A"}/100
                      </span>
                    </div>
                    <div className="bg-white/60 p-2 rounded">
                      <span className="text-gray-600">Cost Score:</span>
                      <span className="font-medium ml-1">
                        {location.economic_analysis.cost_score || "N/A"}/100
                      </span>
                    </div>
                    <div className="bg-white/60 p-2 rounded">
                      <span className="text-gray-600">NPV Score:</span>
                      <span className="font-medium ml-1">
                        {location.economic_analysis.npv_score || "N/A"}/100
                      </span>
                    </div>
                  </div>

                  {location.economic_analysis.profit_margin_percentage && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-center">
                      <span className="text-xs text-green-800">
                        💰 Profit Margin:{" "}
                        {location.economic_analysis.profit_margin_percentage.toFixed(
                          1
                        )}
                        %
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
                  <span className="text-xs font-medium text-green-800">
                    Production Cost
                  </span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  ₹{productionMetrics.projected_cost_per_kg || 0}/kg
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Factory className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">
                    Annual Capacity
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {productionMetrics.annual_capacity_mt || 0} MT
                </p>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">
                    Payback Period
                  </span>
                </div>
                <p className="text-lg font-bold text-orange-900">
                  {productionMetrics.payback_period_years || 0} years
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">
                    ROI
                  </span>
                </div>
                <p className="text-lg font-bold text-purple-900">
                  {productionMetrics.roi_percentage || 0}%
                </p>
              </div>
            </div>

            {/* Detailed Economics - Dynamic based on location data */}
            <div className="space-y-3">
              <h4 className="font-medium text-mocha flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Complete Investment Analysis
              </h4>

              {(() => {
                // Calculate dynamic investment based on location characteristics
                const calculateDynamicInvestment = () => {
                  const baseScore = overallScore || 75; // Default score on 0-100 scale
                  const energyDistance =
                    proximityData.energy?.distance_km || 50;
                  const demandDistance =
                    proximityData.demand?.distance_km || 30;
                  const waterDistance = proximityData.water?.distance_km || 20;

                  // Dynamic capacity based on location quality and proximity
                  let capacity_kg_day = 500; // Base capacity
                  if (baseScore > 280) capacity_kg_day = 2000;
                  else if (baseScore > 260) capacity_kg_day = 1500;
                  else if (baseScore > 240) capacity_kg_day = 1000;
                  else capacity_kg_day = 750;

                  // Adjust capacity based on proximity to demand
                  if (demandDistance < 10) capacity_kg_day *= 1.3;
                  else if (demandDistance > 50) capacity_kg_day *= 0.8;

                  // Land cost varies by location (urban vs rural)
                  let landPricePerAcre = 1.5; // Base ₹1.5Cr/acre
                  if (energyDistance < 20) landPricePerAcre = 2.5; // Urban
                  else if (energyDistance < 40) landPricePerAcre = 1.8; // Semi-urban

                  // Calculate land requirement (scales with capacity)
                  const landRequired = Math.max(5, capacity_kg_day / 200); // Min 5 acres
                  const landCost = landRequired * landPricePerAcre;

                  // Equipment cost scales with capacity
                  const electrolyzerCost = (capacity_kg_day / 1000) * 45; // ₹45Cr per 1000kg/day
                  const powerElectronics = electrolyzerCost * 0.45;
                  const gasProcessing = electrolyzerCost * 0.95;
                  const compression = electrolyzerCost * 0.55;
                  const installation = electrolyzerCost * 0.33;

                  // Infrastructure scales with capacity and location
                  const electricalSubstation = (capacity_kg_day / 1000) * 8;
                  const waterTreatment = (capacity_kg_day / 1000) * 8;
                  const buildings = (capacity_kg_day / 1000) * 8.8;

                  // Permits cost more in urban areas
                  const permitsBase = (capacity_kg_day / 1000) * 12;
                  const permitsMultiplier = energyDistance < 30 ? 1.3 : 1.0;
                  const permitsCost = permitsBase * permitsMultiplier;

                  // Working capital
                  const equipmentTotal =
                    electrolyzerCost +
                    powerElectronics +
                    gasProcessing +
                    compression +
                    installation;
                  const infrastructureTotal =
                    electricalSubstation + waterTreatment + buildings;
                  const totalBeforeWC =
                    landCost +
                    equipmentTotal +
                    infrastructureTotal +
                    permitsCost;
                  const workingCapital = totalBeforeWC * 0.12;

                  // Operating costs vary by location
                  const electricityRate = energyDistance < 20 ? 4.2 : 3.5; // Urban vs rural rates
                  const annualElectricity =
                    (capacity_kg_day * 365 * 0.85 * 55 * electricityRate) /
                    10_000_000;
                  const annualWater = (capacity_kg_day / 1000) * 0.8;
                  const staffCount = Math.max(15, capacity_kg_day / 100);
                  const annualStaff = (staffCount / 25) * 3.5;
                  const annualMaintenance = totalBeforeWC * 0.025;
                  const annualOther =
                    (annualElectricity +
                      annualWater +
                      annualStaff +
                      annualMaintenance) *
                    0.15;

                  // Revenue varies by market proximity
                  const hydrogenPrice =
                    demandDistance < 15 ? 380 : demandDistance < 30 ? 350 : 320;
                  const annualProduction = capacity_kg_day * 365 * 0.85;
                  const annualRevenue =
                    (annualProduction * hydrogenPrice) / 10_000_000;
                  const totalOpex =
                    annualElectricity +
                    annualWater +
                    annualStaff +
                    annualMaintenance +
                    annualOther;
                  const annualProfit = annualRevenue - totalOpex;

                  // Financial metrics
                  const totalCapex = totalBeforeWC + workingCapital;
                  const roi = (annualProfit / totalCapex) * 100;
                  const payback = totalCapex / annualProfit;

                  return {
                    capacity_kg_day: Math.round(capacity_kg_day),
                    land_required_acres: Math.round(landRequired * 10) / 10,
                    land_cost: Math.round(landCost * 10) / 10,
                    electrolyzer_cost: Math.round(electrolyzerCost * 10) / 10,
                    power_electronics: Math.round(powerElectronics * 10) / 10,
                    gas_processing: Math.round(gasProcessing * 10) / 10,
                    compression: Math.round(compression * 10) / 10,
                    installation: Math.round(installation * 10) / 10,
                    equipment_total: Math.round(equipmentTotal * 10) / 10,
                    electrical_substation:
                      Math.round(electricalSubstation * 10) / 10,
                    water_treatment: Math.round(waterTreatment * 10) / 10,
                    buildings: Math.round(buildings * 10) / 10,
                    infrastructure_total:
                      Math.round(infrastructureTotal * 10) / 10,
                    permits_cost: Math.round(permitsCost * 10) / 10,
                    working_capital: Math.round(workingCapital * 10) / 10,
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
                    payback_years: Math.round(payback * 10) / 10,
                    hydrogen_price: hydrogenPrice,
                    electricity_rate: electricityRate,
                    staff_count: staffCount,
                    land_price_per_acre: landPricePerAcre,
                  };
                };

                const dynamicData = calculateDynamicInvestment();

                return (
                  <>
                    {/* Total Investment Required */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-center mb-3">
                        <div className="text-3xl font-bold text-purple-600">
                          ₹{dynamicData.total_capex}Cr
                        </div>
                        <p className="text-sm text-purple-700">
                          Total Investment Required
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          For {dynamicData.capacity_kg_day} kg/day Green H₂
                          Plant
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Location Score: {overallScore || 0}/100 • Land: ₹
                          {dynamicData.land_price_per_acre}Cr/acre • Power: ₹
                          {dynamicData.electricity_rate}/kWh
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
                          <span>
                            Land Acquisition ({dynamicData.land_required_acres}{" "}
                            acres):
                          </span>
                          <span className="font-medium">
                            ₹{dynamicData.land_cost}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Site Preparation & Access:</span>
                          <span className="font-medium">
                            ₹{(dynamicData.land_cost * 0.25).toFixed(1)}Cr
                          </span>
                        </div>
                        <div className="border-t pt-1 mt-1">
                          <div className="flex justify-between font-medium text-orange-700">
                            <span>Subtotal:</span>
                            <span>
                              ₹{(dynamicData.land_cost * 1.25).toFixed(1)}Cr
                            </span>
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
                          <span className="font-medium">
                            ₹{dynamicData.electrolyzer_cost}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Power Electronics & Controls:</span>
                          <span className="font-medium">
                            ₹{dynamicData.power_electronics}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gas Processing & Storage:</span>
                          <span className="font-medium">
                            ₹{dynamicData.gas_processing}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compression Systems:</span>
                          <span className="font-medium">
                            ₹{dynamicData.compression}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Installation & Commissioning:</span>
                          <span className="font-medium">
                            ₹{dynamicData.installation}Cr
                          </span>
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
                          <span className="font-medium">
                            ₹{dynamicData.electrical_substation}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water Treatment & Cooling:</span>
                          <span className="font-medium">
                            ₹{dynamicData.water_treatment}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Buildings & Safety Systems:</span>
                          <span className="font-medium">
                            ₹{dynamicData.buildings}Cr
                          </span>
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
                      <h5 className="text-sm font-medium text-red-800 mb-2">
                        Annual Operating Costs
                      </h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>
                            Electricity @ ₹{dynamicData.electricity_rate}/kWh:
                          </span>
                          <span className="font-medium">
                            ₹{dynamicData.annual_electricity}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Water & Consumables:</span>
                          <span className="font-medium">
                            ₹{dynamicData.annual_water}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            Staff & Admin ({dynamicData.staff_count} people):
                          </span>
                          <span className="font-medium">
                            ₹{dynamicData.annual_staff}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maintenance & Insurance:</span>
                          <span className="font-medium">
                            ₹{dynamicData.annual_maintenance}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Operating Expenses:</span>
                          <span className="font-medium">
                            ₹{dynamicData.annual_other}Cr
                          </span>
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
                          <span className="font-medium">
                            {Math.round(
                              (dynamicData.capacity_kg_day * 365 * 0.85) / 1000
                            )}{" "}
                            tonnes (85% capacity)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Selling Price (Market-adjusted):</span>
                          <span className="font-medium">
                            ₹{dynamicData.hydrogen_price}/kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Revenue:</span>
                          <span className="font-medium">
                            ₹{dynamicData.annual_revenue}Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Profit (Before Tax):</span>
                          <span className="font-medium text-emerald-600">
                            ₹{dynamicData.annual_profit}Cr
                          </span>
                        </div>
                        <div className="border-t pt-1 mt-1">
                          <div className="flex justify-between font-medium text-emerald-700">
                            <span>ROI (Annual):</span>
                            <span>{dynamicData.roi_percentage}%</span>
                          </div>
                          <div className="flex justify-between font-medium text-emerald-700">
                            <span>Payback Period:</span>
                            <span>{dynamicData.payback_years} years</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Investment Grade */}
                    <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-2">
                        Investment Grade:{" "}
                        {(() => {
                          if (
                            dynamicData.roi_percentage > 20 &&
                            dynamicData.payback_years < 6
                          )
                            return "A+ (Excellent)";
                          if (
                            dynamicData.roi_percentage > 15 &&
                            dynamicData.payback_years < 8
                          )
                            return "A (Very Good)";
                          if (
                            dynamicData.roi_percentage > 12 &&
                            dynamicData.payback_years < 10
                          )
                            return "B+ (Good)";
                          if (dynamicData.roi_percentage > 8) return "B (Fair)";
                          return "C (Poor)";
                        })()}
                      </div>
                      <p className="text-xs text-gray-600">
                        Based on {dynamicData.capacity_kg_day} kg/day capacity
                        at this specific location
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Factors: Proximity to energy sources, demand centers,
                        infrastructure quality
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <Separator className="bg-mocha/20" />

        {/* Dynamic Investment Recommendation */}
        <div className="bg-coconut border border-mocha/20 p-3 rounded-lg">
          <h4 className="font-medium text-mocha mb-2">
            Investment Recommendation
          </h4>
          <div className="text-sm text-mocha/80 space-y-2">
            {(() => {
              // Generate dynamic recommendation based on location data
              const generateRecommendation = () => {
                const economicScore = location.economic_score || 50;
                const infrastructureScore =
                  location.infrastructure_score || overallScore;
                const roi = productionMetrics.roi_percentage || 0;
                const payback = productionMetrics.payback_period_years || 10;
                const costPerKg =
                  productionMetrics.projected_cost_per_kg || 350;
                const economicGrade =
                  location.economic_analysis?.economic_grade || "";
                const overallGrade = location.overall_grade || "";

                let recommendation = [];
                let investmentLevel = "";
                let riskLevel = "";
                let keyStrengths = [];
                let concerns = [];

                // Determine investment level
                if (overallScore >= 80) {
                  investmentLevel = "Prime Investment Opportunity";
                  riskLevel = "Low Risk";
                } else if (overallScore >= 70) {
                  investmentLevel = "Excellent Investment Prospect";
                  riskLevel = "Low-Medium Risk";
                } else if (overallScore >= 60) {
                  investmentLevel = "Good Investment Option";
                  riskLevel = "Medium Risk";
                } else if (overallScore >= 50) {
                  investmentLevel = "Acceptable Investment";
                  riskLevel = "Medium-High Risk";
                } else {
                  investmentLevel = "High Risk Investment";
                  riskLevel = "High Risk";
                }

                // Identify key strengths
                if (location.energy_score >= 80) {
                  keyStrengths.push("excellent renewable energy access");
                }
                if (location.demand_score >= 80) {
                  keyStrengths.push("strong industrial demand nearby");
                }
                if (location.water_score >= 80) {
                  keyStrengths.push("abundant water resources");
                }
                if (economicScore >= 80) {
                  keyStrengths.push("superior economic fundamentals");
                }
                if (roi >= 20) {
                  keyStrengths.push(`exceptional ROI potential (${roi}%)`);
                } else if (roi >= 15) {
                  keyStrengths.push(`strong ROI potential (${roi}%)`);
                }
                if (payback <= 5) {
                  keyStrengths.push("rapid payback period");
                }
                if (costPerKg <= 300) {
                  keyStrengths.push("highly competitive production costs");
                }

                // Identify concerns
                if (location.energy_score < 60) {
                  concerns.push("limited renewable energy access");
                }
                if (location.demand_score < 60) {
                  concerns.push("distant from major demand centers");
                }
                if (location.water_score < 60) {
                  concerns.push("water scarcity challenges");
                }
                if (economicScore < 50) {
                  concerns.push("challenging economic fundamentals");
                }
                if (roi < 10) {
                  concerns.push("below-target ROI projections");
                }
                if (payback > 8) {
                  concerns.push("extended payback period");
                }
                if (costPerKg > 400) {
                  concerns.push("high production costs");
                }

                // Build main recommendation
                recommendation.push(
                  `This location represents a ${investmentLevel.toLowerCase()} with ${riskLevel.toLowerCase()} profile.`
                );

                if (keyStrengths.length > 0) {
                  recommendation.push(
                    `Key advantages include ${keyStrengths
                      .slice(0, 3)
                      .join(", ")}.`
                  );
                }

                // Economic summary
                if (roi > 0 && payback > 0) {
                  if (roi >= 15 && payback <= 6) {
                    recommendation.push(
                      `Financial projections are attractive with ${roi}% ROI and ${payback}-year payback.`
                    );
                  } else if (roi >= 10) {
                    recommendation.push(
                      `Economics show ${roi}% ROI with ${payback}-year payback period.`
                    );
                  } else {
                    recommendation.push(
                      `Financial returns are modest at ${roi}% ROI with ${payback}-year payback.`
                    );
                  }
                }

                // Investment sizing recommendation
                if (productionMetrics.capex_crores) {
                  const capex = productionMetrics.capex_crores;
                  if (capex <= 20) {
                    recommendation.push(
                      `Moderate investment requirement of ₹${capex} Cr makes this accessible for mid-scale investors.`
                    );
                  } else if (capex <= 40) {
                    recommendation.push(
                      `Investment requirement of ₹${capex} Cr suitable for large-scale industrial investors.`
                    );
                  } else {
                    recommendation.push(
                      `Significant capital requirement of ₹${capex} Cr demands consortium or institutional investment.`
                    );
                  }
                }

                // Risk assessment
                if (concerns.length > 0) {
                  recommendation.push(
                    `Consider mitigating risks from ${concerns
                      .slice(0, 2)
                      .join(" and ")}.`
                  );
                }

                // Final recommendation
                if (overallScore >= 75) {
                  recommendation.push(
                    "**Recommended for immediate consideration.**"
                  );
                } else if (overallScore >= 60) {
                  recommendation.push(
                    "**Recommended with standard due diligence.**"
                  );
                } else if (overallScore >= 45) {
                  recommendation.push(
                    "**Proceed with enhanced risk assessment.**"
                  );
                } else {
                  recommendation.push(
                    "**Not recommended without significant risk mitigation.**"
                  );
                }

                return recommendation.join(" ");
              };

              return (
                <div>
                  <p>{generateRecommendation()}</p>

                  {/* Quick Stats Summary */}
                  <div className="mt-3 p-2 bg-gray-50 rounded border text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <span>
                        <strong>Grade:</strong>{" "}
                        {location.overall_grade || getScoreLabel(overallScore)}
                      </span>
                      {location.economic_analysis?.economic_grade && (
                        <span>
                          <strong>Economics:</strong>{" "}
                          {
                            location.economic_analysis.economic_grade.split(
                              " "
                            )[0]
                          }
                        </span>
                      )}
                      {productionMetrics.roi_percentage > 0 && (
                        <span>
                          <strong>ROI:</strong>{" "}
                          {productionMetrics.roi_percentage}%
                        </span>
                      )}
                      {productionMetrics.payback_period_years > 0 && (
                        <span>
                          <strong>Payback:</strong>{" "}
                          {productionMetrics.payback_period_years}y
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
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
