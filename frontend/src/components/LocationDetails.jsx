import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Star,
  MapPin,
  TrendingUp,
  DollarSign,
  Factory,
  Clock,
  Percent,
  Zap,
  Droplets,
  Route,
} from "lucide-react";
import { toNumber } from "../lib/numeric";
import {
  calculateLocationScore,
  getScoreColor,
  getScoreLabel,
  getRiskLevel,
} from "../lib/scoring";

const LocationDetails = ({
  location,
  onClose,
  onViewFullAnalysis,
  embedded = false,
  resources,
}) => {
  if (!location) return null;

  const paybackYears = toNumber(
    location?.paybackYears ?? location?.payback_period_years,
    0
  );
  const costPerKg = toNumber(
    location?.costPerKg ?? location?.production_cost_per_kg,
    0
  );
  const annualCapacity = toNumber(
    location?.annualCapacityKg ?? location?.annual_capacity_kg,
    0
  );
  const roiPercent = toNumber(location?.roiPercent ?? location?.roi, 0);

  // Calculate score using shared scoring utility
  const overallScore = calculateLocationScore(location);
  const productionMetrics = location.production_metrics || {
    projected_cost_per_kg: location.projectedCost || 350,
    annual_capacity_mt: location.annualCapacity || 25,
    payback_period_years: location.payback_period_years || "N/A",
    roi_percentage: location.roi_percentage || "N/A",
  };

  const coordinates = location.location
    ? [location.location.latitude, location.location.longitude]
    : location.coordinates || [0, 0];

  // Haversine distance (km)
  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Compute proximity lists (energy, demand, water, highway, pipeline)
  const proximity = useMemo(() => {
    if (!resources) return null;
    const [lat, lng] = coordinates;

    const mapRouteDistance = (routePoints) => {
      // routePoints: array of { latitude, longitude }
      if (!Array.isArray(routePoints) || routePoints.length === 0)
        return Infinity;
      // Compute min distance from point to each segment endpoint (approx)
      let minD = Infinity;
      for (const pt of routePoints) {
        const d = haversineKm(lat, lng, pt.latitude, pt.longitude);
        if (d < minD) minD = d;
      }
      return minD;
    };

    const fmt = (n) => `${n.toFixed(1)} km away`;

    const energy = (resources.energySources || []).map((s) => ({
      category: "Energy",
      icon: "energy",
      name: s.name,
      capacity: s.capacity_mw ? `${s.capacity_mw} MW` : undefined,
      type: s.type,
      distance: haversineKm(
        lat,
        lng,
        s.location.latitude,
        s.location.longitude
      ),
    }));

    const demand = (resources.demandCenters || []).map((d) => ({
      category: "Demand",
      icon: "demand",
      name: d.name,
      capacity: d.hydrogen_demand_mt_year
        ? `${d.hydrogen_demand_mt_year.toLocaleString()} MT/yr`
        : undefined,
      type: d.type,
      distance: haversineKm(
        lat,
        lng,
        d.location.latitude,
        d.location.longitude
      ),
    }));

    const water = (resources.waterSources || []).map((w) => ({
      category: "Water",
      icon: "water",
      name: w.name,
      capacity: w.capacity_liters_day
        ? `${w.capacity_liters_day.toLocaleString()} L/day`
        : undefined,
      type: w.type,
      distance: haversineKm(
        lat,
        lng,
        w.location.latitude,
        w.location.longitude
      ),
    }));

    const highways = (resources.roadNetworks || []).map((r) => ({
      category: "Highway",
      icon: "highway",
      name: r.name,
      capacity: r.transport_capacity,
      type: r.type,
      distance: mapRouteDistance(r.route),
    }));

    const pipelines = (resources.gasPipelines || []).map((p) => ({
      category: "Pipeline",
      icon: "pipeline",
      name: p.name,
      capacity: p.capacity_mmscmd ? `${p.capacity_mmscmd} MMSCM/d` : undefined,
      type: p.pipeline_type || "Gas/Oil",
      distance: mapRouteDistance(p.route || p.route_points),
    }));

    const sortAsc = (arr) =>
      arr
        .filter((e) => Number.isFinite(e.distance))
        .sort((a, b) => a.distance - b.distance);

    return {
      energy: sortAsc(energy).slice(0, 5),
      demand: sortAsc(demand).slice(0, 5),
      water: sortAsc(water).slice(0, 5),
      highways: sortAsc(highways).slice(0, 5),
      pipelines: sortAsc(pipelines).slice(0, 5),
      fmt,
    };
  }, [resources, coordinates]);

  const CategoryRow = ({ title, icon }) => (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      {icon}
      <span>{title}</span>
    </div>
  );

  const ItemRow = ({ item }) => (
    <div className="flex items-center justify-between py-2">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {item.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {item.type}
          {item.capacity ? ` • ${item.capacity}` : ""}
        </div>
      </div>
      <Badge className="bg-muted text-foreground whitespace-nowrap">
        {proximity.fmt(item.distance)}
      </Badge>
    </div>
  );

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
            Coordinates: {coordinates[0]?.toFixed(4) || "N/A"}°,{" "}
            {coordinates[1]?.toFixed(4) || "N/A"}°
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
                <span className="text-xs font-medium text-blue-800">
                  Cost per kg
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                ₹{productionMetrics.projected_cost_per_kg || "N/A"}
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
        </div>

        <Separator className="bg-border" />

        {/* Proximity Analysis */}
        {proximity && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Proximity Analysis
            </h3>

            {/* Energy Sources */}
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <CategoryRow
                title="Energy Sources"
                icon={<Zap className="w-4 h-4 text-amber-600" />}
              />
              <div className="mt-2 divide-y">
                {proximity.energy.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No sources nearby
                  </div>
                )}
                {proximity.energy.map((e, i) => (
                  <ItemRow key={`e-${i}`} item={e} />
                ))}
              </div>
            </div>

            {/* Demand Centers */}
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <CategoryRow
                title="Industrial Demand"
                icon={<Factory className="w-4 h-4 text-red-600" />}
              />
              <div className="mt-2 divide-y">
                {proximity.demand.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No centers nearby
                  </div>
                )}
                {proximity.demand.map((d, i) => (
                  <ItemRow key={`d-${i}`} item={d} />
                ))}
              </div>
            </div>

            {/* Water Sources */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <CategoryRow
                title="Water Sources"
                icon={<Droplets className="w-4 h-4 text-blue-600" />}
              />
              <div className="mt-2 divide-y">
                {proximity.water.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No sources nearby
                  </div>
                )}
                {proximity.water.map((w, i) => (
                  <ItemRow key={`w-${i}`} item={w} />
                ))}
              </div>
            </div>

            {/* Highways */}
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <CategoryRow
                title="Nearby Highways"
                icon={<Route className="w-4 h-4 text-emerald-600" />}
              />
              <div className="mt-2 divide-y">
                {proximity.highways.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No highways nearby
                  </div>
                )}
                {proximity.highways.map((r, i) => (
                  <ItemRow key={`r-${i}`} item={r} />
                ))}
              </div>
            </div>

            {/* Pipelines */}
            <div className="bg-lime-50 p-3 rounded-lg border border-lime-200">
              <CategoryRow
                title="Pipelines"
                icon={<span className="text-sm">⛽</span>}
              />
              <div className="mt-2 divide-y">
                {proximity.pipelines.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    No pipelines nearby
                  </div>
                )}
                {proximity.pipelines.map((p, i) => (
                  <ItemRow key={`p-${i}`} item={p} />
                ))}
              </div>
            </div>
          </div>
        )}

  <Separator className="bg-border" />
      </CardContent>
    </>
  );
};

export default LocationDetails;
