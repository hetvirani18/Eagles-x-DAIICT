import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Leaf,
  BarChart3,
  Target,
  Download,
  Calendar,
  MapPin,
  Zap,
  Users,
  Award,
  Lightbulb,
  Shield,
  Globe,
  ArrowLeft,
  PieChart,
  LineChart,
  Calculator,
  IndianRupee,
  Clock,
  Percent
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';
import { toNumber, clamp } from '../lib/numeric';

const FullAnalysisPage = () => {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const selectedLocation = locationState?.state?.location || null;

  // Guard for direct navigation
  if (!selectedLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold">No location selected</h1>
          <p className="text-muted-foreground">
            Please pick a site on the map to view full analysis.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Return to Map
          </Link>
        </div>
      </div>
    );
  }

  const safeScore = clamp(
    selectedLocation?.score ?? selectedLocation?.investmentScore ?? 0,
    0,
    100
  );
  const annualCapacity = toNumber(selectedLocation?.annualCapacityKg, 0);
  const roiPct = toNumber(selectedLocation?.roiPercent ?? selectedLocation?.roi, 0);

  useEffect(() => {
    if (selectedLocation) {
      fetchComprehensiveAnalysis();
    }
  }, [selectedLocation]);

  const fetchComprehensiveAnalysis = async () => {
    try {
      const response = await fetch('/api/v1/advanced/comprehensive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: selectedLocation.location?.latitude || selectedLocation.lat,
          longitude: selectedLocation.location?.longitude || selectedLocation.lng,
          capacity_kg_day: 1000,
          technology_type: 'pem',
          electricity_source: 'mixed_renewable'
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setAnalysisData(data);
      }
    } catch (error) {
      console.error('Error fetching comprehensive analysis:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const overallScore = selectedLocation.overall_score || selectedLocation.score || 0;
  const coordinates = selectedLocation.location
    ? [selectedLocation.location.latitude, selectedLocation.location.longitude]
    : selectedLocation.coordinates || [0, 0];

  const productionMetrics = selectedLocation.production_metrics || {
    projected_cost_per_kg: selectedLocation.projectedCost || 350,
    annual_capacity_mt: selectedLocation.annualCapacity || 25,
    payback_period_years: selectedLocation.payback_period_years || "N/A",
    roi_percentage: selectedLocation.roi_percentage || "N/A"
  };

  // Sanitize numeric metrics to avoid NaN in calculations
  const sanitizedRoi = toNumber(productionMetrics.roi_percentage, 0);

  // Generate chart data
  const generateCostProjectionData = () => {
    const baseCost = productionMetrics.projected_cost_per_kg || 350;
    const data = [];
    for (let year = 1; year <= 10; year++) {
      const efficiencyGain = year * 0.02; // 2% annual efficiency improvement
      const costReduction = baseCost * efficiencyGain;
      const projectedCost = Math.max(baseCost - costReduction, baseCost * 0.7); // Minimum 70% of base cost
      data.push({
        year: `Year ${year}`,
        cost: Math.round(projectedCost * 100) / 100,
        cumulativeSavings: Math.round(costReduction * 100) / 100
      });
    }
    return data;
  };

  const generateROIData = () => {
    const roi = sanitizedRoi || 15;
    const data = [];
    for (let year = 1; year <= 10; year++) {
      const cumulativeROI = roi * year;
      data.push({
        year: `Year ${year}`,
        roi: Math.round(cumulativeROI * 100) / 100,
        annualROI: roi
      });
    }
    return data;
  };

  const generateResourceAllocationData = () => {
    return [
      { name: 'Equipment & Technology', value: 45, color: '#3B82F6' },
      { name: 'Infrastructure', value: 25, color: '#10B981' },
      { name: 'Land & Site Development', value: 15, color: '#F59E0B' },
      { name: 'Working Capital', value: 10, color: '#EF4444' },
      { name: 'Permits & Licenses', value: 5, color: '#8B5CF6' }
    ];
  };

  const generateFinancialProjectionData = () => {
    const data = [];
    const initialInvestment = 375; // ₹375 Cr
    const annualRevenue = 153; // ₹153 Cr/year
    const annualOpex = 71; // ₹71 Cr/year
    const annualProfit = annualRevenue - annualOpex;

    let cumulativeCashFlow = -initialInvestment;

    for (let year = 1; year <= 20; year++) {
      const revenue = annualRevenue * (1 + (year - 1) * 0.03); // 3% annual growth
      const opex = annualOpex * (1 + (year - 1) * 0.02); // 2% annual increase
      const profit = revenue - opex;
      cumulativeCashFlow += profit;

      data.push({
        year: `Year ${year}`,
        revenue: Math.round(revenue),
        opex: Math.round(opex),
        profit: Math.round(profit),
        cumulativeCashFlow: Math.round(cumulativeCashFlow)
      });
    }
    return data;
  };

  // Prepare datasets for charts
  const costProjectionData = generateCostProjectionData();
  const roiData = generateROIData();
  const resourceAllocationData = generateResourceAllocationData();
  const financialProjectionData = generateFinancialProjectionData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Generating comprehensive analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Map
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Calculator className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Full Investment Analysis
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive financial and technical assessment
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getScoreColor(overallScore)} font-bold`}>
                Score: {overallScore}/300
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Investment Score</p>
                    <p className="text-2xl font-bold">{overallScore}/300</p>
                    <Badge variant="outline" className="mt-1">
                      {getScoreLabel(overallScore)}
                    </Badge>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Production Cost</p>
                    <p className="text-2xl font-bold">₹{productionMetrics.projected_cost_per_kg}</p>
                    <p className="text-xs text-muted-foreground">per kg H₂</p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual Capacity</p>
                    <p className="text-2xl font-bold">{productionMetrics.annual_capacity_mt}</p>
                    <p className="text-xs text-muted-foreground">MT per year</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expected ROI</p>
                    <p className="text-2xl font-bold">{productionMetrics.roi_percentage}%</p>
                    <p className="text-xs text-muted-foreground">per annum</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Model</TabsTrigger>
              <TabsTrigger value="projections">Financial Projections</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                        <p className="font-mono text-sm">
                          {coordinates[0]?.toFixed(4)}°, {coordinates[1]?.toFixed(4)}°
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Region</p>
                        <p className="text-sm">Gujarat, India</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Infrastructure Score</p>
                      <Progress value={(overallScore / 300) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {getScoreLabel(overallScore)} location for green hydrogen production
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Technology</p>
                        <p className="text-sm">PEM Electrolyzer</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                        <p className="text-sm">{productionMetrics.annual_capacity_mt} MT/year</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                        <p className="text-sm">65-70%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Energy Source</p>
                        <p className="text-sm">Mixed Renewable</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Resource Allocation
                  </CardTitle>
                  <CardDescription>
                    Major cost components for the hydrogen production facility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={resourceAllocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {resourceAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Allocation']}
                          labelFormatter={(label) => label}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {resourceAllocationData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">{item.name}</span>
                        <span className="font-medium ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>CAPEX Breakdown</CardTitle>
                    <CardDescription>Total capital expenditure components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Equipment & Machinery</span>
                        <span className="font-medium">₹280 Cr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Land & Infrastructure</span>
                        <span className="font-medium">₹45 Cr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Electrical Systems</span>
                        <span className="font-medium">₹35 Cr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Permits & Licenses</span>
                        <span className="font-medium">₹15 Cr</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total CAPEX</span>
                        <span>₹375 Cr</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>OPEX Breakdown</CardTitle>
                    <CardDescription>Annual operating expenditure components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Electricity</span>
                        <span className="font-medium">₹45 Cr/year</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Water & Utilities</span>
                        <span className="font-medium">₹8 Cr/year</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Maintenance</span>
                        <span className="font-medium">₹12 Cr/year</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Labor & Administration</span>
                        <span className="font-medium">₹6 Cr/year</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total OPEX</span>
                        <span>₹71 Cr/year</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost vs Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Cost Projections Over Time
                  </CardTitle>
                  <CardDescription>
                    Projected operating costs and efficiency improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={costProjectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'cost' ? `₹${value}/kg` : `₹${value}/kg`,
                            name === 'cost' ? 'Production Cost' : 'Cumulative Savings'
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="cost"
                        />
                        <Line
                          type="monotone"
                          dataKey="cumulativeSavings"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="cumulativeSavings"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Projected cost reduction through efficiency improvements and technology advancements</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Streams</CardTitle>
                    <CardDescription>Projected annual revenue breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hydrogen Sales</span>
                        <span className="font-medium">₹125 Cr/year</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Carbon Credits</span>
                        <span className="font-medium">₹15 Cr/year</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Grid Services</span>
                        <span className="font-medium">₹8 Cr/year</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Technology Licensing</span>
                        <span className="font-medium">₹5 Cr/year</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Revenue</span>
                        <span>₹153 Cr/year</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Model</CardTitle>
                    <CardDescription>Hydrogen pricing strategy and market positioning</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Production Cost</span>
                        <span className="font-medium">₹{productionMetrics.projected_cost_per_kg}/kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Market Price</span>
                        <span className="font-medium">₹450/kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Gross Margin</span>
                        <span className="font-medium text-green-600">22%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Premium Positioning</span>
                        <span className="font-medium">+15% above market</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Projection Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    ROI Projections
                  </CardTitle>
                  <CardDescription>
                    Return on investment over project lifetime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roiData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Cumulative ROI']}
                        />
                        <Legend />
                        <Bar
                          dataKey="roi"
                          fill="#3B82F6"
                          name="roi"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Cumulative ROI projection showing investment returns over 10-year period</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projections" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Payback Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-blue-600">
                        {productionMetrics.payback_period_years}
                      </p>
                      <p className="text-sm text-muted-foreground">years</p>
                      <Progress value={75} className="h-2 mt-4" />
                      <p className="text-xs text-muted-foreground">75% of target period</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Percent className="w-5 h-5" />
                      ROI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-green-600">
                        {sanitizedRoi}%
                      </p>
                      <p className="text-sm text-muted-foreground">annual return</p>
                      <Progress value={Math.min(sanitizedRoi * 2, 100)} className="h-2 mt-4" />
                      <p className="text-xs text-muted-foreground">Above industry average</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      NPV Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-purple-600">₹450 Cr</p>
                      <p className="text-sm text-muted-foreground">net present value</p>
                      <Progress value={85} className="h-2 mt-4" />
                      <p className="text-xs text-muted-foreground">20-year projection</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Projections Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    20-Year Financial Projections
                  </CardTitle>
                  <CardDescription>
                    Comprehensive cash flow, profitability, and investment returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={financialProjectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`₹${value} Cr`, '']}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Line
                          type="monotone"
                          dataKey="opex"
                          stroke="#EF4444"
                          strokeWidth={2}
                          name="Operating Expenses"
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Profit"
                        />
                        <Line
                          type="monotone"
                          dataKey="cumulativeCashFlow"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          name="Cumulative Cash Flow"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-green-600">Revenue Growth</p>
                      <p className="text-xs text-muted-foreground">3% annual increase</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-blue-600">Profit Margin</p>
                      <p className="text-xs text-muted-foreground">~53% average</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    Key risks and mitigation strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-sm">Technology Risk</p>
                          <p className="text-xs text-muted-foreground">Low - Proven PEM technology</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-sm">Market Risk</p>
                          <p className="text-xs text-muted-foreground">Medium - Growing demand</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-sm">Regulatory Risk</p>
                          <p className="text-xs text-muted-foreground">High - Policy dependent</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-sm">Execution Risk</p>
                          <p className="text-xs text-muted-foreground">Medium - Infrastructure ready</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default FullAnalysisPage;
