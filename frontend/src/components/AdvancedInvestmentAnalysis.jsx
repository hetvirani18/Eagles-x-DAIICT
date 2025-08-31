import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
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
  Globe
} from 'lucide-react';

const AdvancedInvestmentAnalysis = ({ location, onClose }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (location) {
      fetchComprehensiveAnalysis();
      // Don't call fetchInvestmentAlerts here - call it after analysis is complete
    }
  }, [location]);

  const fetchComprehensiveAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/advanced/comprehensive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          // Remove hardcoded capacity to allow dynamic calculation
          technology_type: 'pem',
          electricity_source: 'mixed_renewable'
        })
      });
      
      const data = await response.json();
      if (data && (data.summary || data.comprehensive_analysis)) {
        setAnalysisData(data);
        // Now fetch investment alerts with dynamic capacity
        await fetchInvestmentAlerts(data);
      } else if (data.status === 'success') {
        setAnalysisData(data);
        await fetchInvestmentAlerts(data);
      }
    } catch (error) {
      console.error('Error fetching comprehensive analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestmentAlerts = async (analysisDataParam = null) => {
    try {
      // Use passed analysis data or state analysis data
  const dataToUse = analysisDataParam || analysisData;
  const dynamicCapacity = dataToUse?.summary?.optimal_capacity_kg_day || 1000;
      const response = await fetch(
        `http://localhost:8080/api/v1/advanced/investment-alerts?latitude=${location.lat}&longitude=${location.lng}&capacity_kg_day=${dynamicCapacity}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        setAlerts(data.investment_alerts || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const downloadInvestorReport = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/advanced/generate-investor-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_data: analysisData,
          investor_profile: 'institutional'
        })
      });
      
      const reportData = await response.json();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `H2-Investment-Report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-center">Running comprehensive investment analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md">
          <p className="text-center text-red-600 mb-4">Failed to load analysis data</p>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    );
  }

  const {
    composite_scores,
    investment_recommendation,
    financial_analysis,
    market_intelligence,
    technical_risk_assessment,
    esg_sustainability
  } = analysisData;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getInvestmentGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade?.startsWith('B')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl max-h-[90vh] overflow-y-auto w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🎯 Advanced Investment Analysis
            </h2>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadInvestorReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        {/* Investment Alerts */}
        {alerts.length > 0 && (
          <div className="px-6 py-4 border-b bg-amber-50">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Investment Alerts ({alerts.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alerts.slice(0, 4).map((alert, index) => (
                <Alert key={index} className="border-amber-200">
                  <AlertDescription className="text-sm">
                    <span className={`font-medium ${alert.priority === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                      {alert.title}:
                    </span>
                    {' ' + alert.description}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics Dashboard */}
        <div className="px-6 py-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(composite_scores.overall_investment_score)}`}>
                  {composite_scores.overall_investment_score.toFixed(1)}/100
                </div>
                <p className="text-sm text-gray-600 mt-2">Overall Score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getInvestmentGradeColor(investment_recommendation.investment_grade || 'B')}`}>
                  {investment_recommendation.investment_grade || 'B'}
                </div>
                <p className="text-sm text-gray-600 mt-2">Investment Grade</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {financial_analysis.scenario_analysis?.most_likely?.roi_percentage?.toFixed(1) || 'N/A'}%
                </div>
                <p className="text-sm text-gray-600">Expected ROI</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(() => {
                    const v = financial_analysis.scenario_analysis?.most_likely?.payback_period_years;
                    return Number.isFinite(v) ? v.toFixed(1) : (v ? 'Never' : 'N/A');
                  })()}
                </div>
                <p className="text-sm text-gray-600">Payback (Years)</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis Tabs */}
        <div className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="esg">ESG</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Investment Recommendation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Investment Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Decision:</span>
                        <Badge className={
                          investment_recommendation.investment_decision === 'highly_recommended' ? 'bg-green-100 text-green-800' :
                          investment_recommendation.investment_decision === 'recommended' ? 'bg-blue-100 text-blue-800' :
                          investment_recommendation.investment_decision === 'conditional' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {investment_recommendation.investment_decision?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Confidence:</span>
                        <span className="font-medium">{investment_recommendation.confidence_level?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Risk Level:</span>
                        <Badge variant="outline">{investment_recommendation.risk_level}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Recommended Capacity:</span>
                        <span className="font-medium">{investment_recommendation.recommended_capacity_kg_day} kg/day</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Composite Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                      Performance Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: 'Financial', score: composite_scores.financial_score, icon: DollarSign },
                        { label: 'Market', score: composite_scores.market_score, icon: TrendingUp },
                        { label: 'Technical', score: composite_scores.technical_score, icon: Zap },
                        { label: 'ESG', score: composite_scores.esg_score, icon: Leaf }
                      ].map(({ label, score, icon: Icon }) => (
                        <div key={label} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {label}
                            </span>
                            <span className="font-medium">{score?.toFixed(1)}/100</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Success Factors & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Key Success Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {investment_recommendation.key_success_factors?.map((factor, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Shield className="w-5 h-5 mr-2" />
                      Major Risks & Mitigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {investment_recommendation.major_risks?.slice(0, 3).map((risk, index) => (
                        <div key={index} className="border-l-4 border-red-200 pl-3">
                          <p className="text-sm font-medium text-red-800">{risk}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {investment_recommendation.mitigation_strategies?.[index]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Scenario Analysis */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Financial Scenarios</CardTitle>
                    <CardDescription>ROI and NPV projections under different scenarios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {financial_analysis.scenario_analysis && Object.entries(financial_analysis.scenario_analysis).map(([scenario, data]) => (
                        <div key={scenario} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3 capitalize">{scenario.replace('_', ' ')}</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">ROI</p>
                              <p className="font-medium text-green-600">{data.roi_percentage?.toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">NPV</p>
                              <p className="font-medium text-blue-600">₹{data.npv_crores?.toFixed(1)}Cr</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Payback</p>
                              <p className="font-medium">{Number.isFinite(data.payback_period_years) ? data.payback_period_years?.toFixed(1) + ' yrs' : 'Never'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Monte Carlo Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>Monte Carlo simulation results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {financial_analysis.monte_carlo_simulation && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">ROI Range</p>
                          <p className="font-medium">
                            {financial_analysis.monte_carlo_simulation.roi_p10?.toFixed(1)}% - {financial_analysis.monte_carlo_simulation.roi_p90?.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Success Probability</p>
                          <p className="font-medium text-green-600">
                            {financial_analysis.monte_carlo_simulation.probability_positive_npv?.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Risk Level</p>
                          <Badge variant="outline">
                            {financial_analysis.monte_carlo_simulation.risk_level}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Financing Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Financing Options</CardTitle>
                  <CardDescription>Different financing structures and their impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {financial_analysis.financing_options && Object.entries(financial_analysis.financing_options).map(([option, data]) => (
                      <div key={option} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2 capitalize">{option.replace('_', ' ')}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Investment Grade:</span>
                            <Badge className={getInvestmentGradeColor(data.investment_grade)}>
                              {data.investment_grade}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>WACC:</span>
                            <span>{data.wacc_percentage?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Equity IRR:</span>
                            <span>{data.equity_irr_percentage?.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Market Tab */}
            <TabsContent value="market" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Attractiveness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {market_intelligence.market_attractiveness_analysis && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Overall Attractiveness:</span>
                            <span className="font-medium">{market_intelligence.market_attractiveness_analysis.overall_market_attractiveness?.toFixed(1)}/100</span>
                          </div>
                          <Progress value={market_intelligence.market_attractiveness_analysis.overall_market_attractiveness} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Demand Growth:</span>
                            <span className="font-medium text-green-600">{market_intelligence.market_attractiveness_analysis.demand_growth_potential?.toFixed(1)}% CAGR</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Competitive Position:</span>
                            <span className="font-medium">{market_intelligence.market_attractiveness_analysis.competitive_position?.toFixed(1)}/100</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {market_intelligence.pricing_analysis && (
                      <div className="space-y-3">
                        {Object.entries(market_intelligence.pricing_analysis.current_prices_inr_per_kg || {}).map(([segment, price]) => (
                          <div key={segment} className="flex justify-between items-center">
                            <span className="capitalize">{segment.replace('_', ' ')}:</span>
                            <span className="font-medium">₹{price}/kg</span>
                          </div>
                        ))}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span>Price Trend:</span>
                            <Badge className="bg-green-100 text-green-800">
                              {market_intelligence.pricing_analysis.price_trend_5_year}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Competition & Policy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {market_intelligence.competition_analysis?.major_competitors?.length > 0 && (
                      <div className="space-y-3">
                        {market_intelligence.competition_analysis.major_competitors.slice(0, 3).map((competitor, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <h4 className="font-medium">{competitor.name}</h4>
                            <p className="text-sm text-gray-600">{competitor.capacity_mw} MW • {competitor.location}</p>
                            <p className="text-xs text-gray-500 mt-1">{competitor.technology}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Policy Incentives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {market_intelligence.policy_incentives?.available_incentives?.length > 0 && (
                      <div className="space-y-3">
                        {market_intelligence.policy_incentives.available_incentives.map((incentive, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-3">
                            <h4 className="font-medium text-blue-800">{incentive.name}</h4>
                            <p className="text-sm text-gray-600">{incentive.description}</p>
                            <p className="text-xs text-green-600 mt-1">Value: {incentive.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technical_risk_assessment.overall_risk_assessment && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${
                            technical_risk_assessment.overall_risk_assessment.overall_risk_score <= 30 ? 'bg-green-100 text-green-800' :
                            technical_risk_assessment.overall_risk_assessment.overall_risk_score <= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {technical_risk_assessment.overall_risk_assessment.overall_risk_score?.toFixed(1)}/100
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Overall Risk Score</p>
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { label: 'Technology Risk', score: technical_risk_assessment.overall_risk_assessment.technology_risk },
                            { label: 'Performance Risk', score: technical_risk_assessment.overall_risk_assessment.performance_risk },
                            { label: 'Maintenance Risk', score: technical_risk_assessment.overall_risk_assessment.maintenance_risk },
                            { label: 'Grid Integration Risk', score: technical_risk_assessment.overall_risk_assessment.grid_integration_risk }
                          ].map(({ label, score }) => (
                            <div key={label} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">{label}:</span>
                                <span className="text-sm font-medium">{score?.toFixed(1)}/100</span>
                              </div>
                              <Progress value={score} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technology Maturity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technical_risk_assessment.technology_maturity_assessment && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Technology Type:</span>
                          <Badge variant="outline">
                            {technical_risk_assessment.technology_maturity_assessment.technology_type?.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>TRL Level:</span>
                          <span className="font-medium">
                            {technical_risk_assessment.technology_maturity_assessment.trl_level}/9
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Maturity Score:</span>
                          <span className="font-medium text-green-600">
                            {technical_risk_assessment.technology_maturity_assessment.maturity_score?.toFixed(1)}/100
                          </span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Key Advantages:</span>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {technical_risk_assessment.technology_maturity_assessment.advantages?.slice(0, 3).map((advantage, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                {advantage}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Performance & Maintenance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technical_risk_assessment.performance_degradation && (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Year 1 Efficiency:</span>
                          <span className="font-medium">{(technical_risk_assessment.performance_degradation.year_1_efficiency * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Year 10 Efficiency:</span>
                          <span className="font-medium">{(technical_risk_assessment.performance_degradation.year_10_efficiency * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Year 20 Efficiency:</span>
                          <span className="font-medium">{(technical_risk_assessment.performance_degradation.year_20_efficiency * 100)?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Degradation Rate:</span>
                          <span className="text-orange-600">{(technical_risk_assessment.performance_degradation.annual_degradation_rate * 100)?.toFixed(2)}%/year</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technical_risk_assessment.maintenance_schedule && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Annual OPEX:</span>
                          <span className="font-medium">₹{technical_risk_assessment.maintenance_schedule.annual_maintenance_cost_crores?.toFixed(2)}Cr</span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Key Activities:</span>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {technical_risk_assessment.maintenance_schedule.scheduled_activities?.slice(0, 3).map((activity, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{activity.activity}</span>
                                <span className="text-xs">{activity.frequency}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ESG Tab */}
            <TabsContent value="esg" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      Environmental
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {esg_sustainability.carbon_footprint_analysis && (
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {esg_sustainability.carbon_footprint_analysis.carbon_reduction_vs_grey_hydrogen_percent?.toFixed(1)}%
                          </div>
                          <p className="text-sm text-gray-600">Carbon Reduction vs Grey H₂</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Lifecycle Emissions:</span>
                            <span>{esg_sustainability.carbon_footprint_analysis.lifecycle_emissions_kg_co2_per_kg_h2?.toFixed(1)} kg CO₂/kg H₂</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual CO₂ Avoided:</span>
                            <span className="text-green-600">{esg_sustainability.carbon_footprint_analysis.annual_co2_avoided_tonnes?.toFixed(0)} tonnes</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Social
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {esg_sustainability.social_impact_metrics && (
                      <div className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Direct Jobs:</span>
                            <span className="font-medium">{esg_sustainability.social_impact_metrics.direct_employment_created}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Indirect Jobs:</span>
                            <span className="font-medium">{esg_sustainability.social_impact_metrics.indirect_employment_created}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Community Investment:</span>
                            <span className="text-blue-600">₹{esg_sustainability.social_impact_metrics.community_investment_annual_crores?.toFixed(2)}Cr/year</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Local Procurement:</span>
                            <span>{(esg_sustainability.social_impact_metrics.local_procurement_percentage * 100)?.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-600" />
                      Governance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {esg_sustainability.governance_metrics && (
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {esg_sustainability.governance_metrics.governance_score?.toFixed(1)}/100
                          </div>
                          <p className="text-sm text-gray-600">Governance Score</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Compliance Level:</span>
                            <Badge className="bg-green-100 text-green-800">
                              {esg_sustainability.governance_metrics.regulatory_compliance_level}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Transparency:</span>
                            <span>{esg_sustainability.governance_metrics.transparency_score?.toFixed(1)}/100</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* ESG Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>ESG Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">Sustainability Highlights</h4>
                      <ul className="space-y-2">
                        {esg_sustainability.esg_scorecard?.sustainability_highlights?.map((highlight, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getInvestmentGradeColor(esg_sustainability.esg_scorecard?.esg_rating)}`}>
                        {esg_sustainability.esg_scorecard?.esg_rating}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">ESG Rating</p>
                      <div className="mt-4">
                        <div className="text-2xl font-bold">
                          {esg_sustainability.esg_scorecard?.overall_esg_score?.toFixed(1)}/100
                        </div>
                        <p className="text-sm text-gray-600">Overall ESG Score</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scenarios Tab */}
            <TabsContent value="scenarios" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Comparison</CardTitle>
                    <CardDescription>Financial projections under different market conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {financial_analysis.scenario_analysis && (
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Metric</th>
                                <th className="text-center py-2">Optimistic</th>
                                <th className="text-center py-2">Most Likely</th>
                                <th className="text-center py-2">Pessimistic</th>
                              </tr>
                            </thead>
                            <tbody className="space-y-2">
                              <tr className="border-b">
                                <td className="py-2">ROI (%)</td>
                                <td className="text-center text-green-600">{financial_analysis.scenario_analysis.optimistic?.roi_percentage?.toFixed(1)}</td>
                                <td className="text-center">{financial_analysis.scenario_analysis.most_likely?.roi_percentage?.toFixed(1)}</td>
                                <td className="text-center text-red-600">{financial_analysis.scenario_analysis.pessimistic?.roi_percentage?.toFixed(1)}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="py-2">NPV (₹Cr)</td>
                                <td className="text-center text-green-600">{financial_analysis.scenario_analysis.optimistic?.npv_crores?.toFixed(1)}</td>
                                <td className="text-center">{financial_analysis.scenario_analysis.most_likely?.npv_crores?.toFixed(1)}</td>
                                <td className="text-center text-red-600">{financial_analysis.scenario_analysis.pessimistic?.npv_crores?.toFixed(1)}</td>
                              </tr>
                              <tr>
                                <td className="py-2">Payback (Yrs)</td>
                                <td className="text-center text-green-600">{(() => { const v = financial_analysis.scenario_analysis.optimistic?.payback_period_years; return Number.isFinite(v) ? v?.toFixed(1) : 'Never'; })()}</td>
                                <td className="text-center">{(() => { const v = financial_analysis.scenario_analysis.most_likely?.payback_period_years; return Number.isFinite(v) ? v?.toFixed(1) : 'Never'; })()}</td>
                                <td className="text-center text-red-600">{(() => { const v = financial_analysis.scenario_analysis.pessimistic?.payback_period_years; return Number.isFinite(v) ? v?.toFixed(1) : 'Never'; })()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sensitivity Analysis</CardTitle>
                    <CardDescription>Impact of key variables on returns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {financial_analysis.breakeven_analysis && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Break-even H₂ Price:</span>
                            <span className="font-medium">₹{financial_analysis.breakeven_analysis.breakeven_hydrogen_price_per_kg?.toFixed(0)}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Break-even Capacity Utilization:</span>
                            <span className="font-medium">{financial_analysis.breakeven_analysis.breakeven_capacity_utilization_percent?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CAPEX Sensitivity:</span>
                            <span className="font-medium">{financial_analysis.breakeven_analysis.capex_sensitivity_per_percent?.toFixed(2)}% ROI per 1% CAPEX change</span>
                          </div>
                          <div className="flex justify-between">
                            <span>OPEX Sensitivity:</span>
                            <span className="font-medium">{financial_analysis.breakeven_analysis.opex_sensitivity_per_percent?.toFixed(2)}% ROI per 1% OPEX change</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Implementation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Implementation Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { phase: 'Pre-Development', duration: '6 months', activities: ['Site acquisition', 'Permits', 'Financing'] },
                        { phase: 'Construction', duration: '18 months', activities: ['Equipment procurement', 'Site construction', 'Grid connection'] },
                        { phase: 'Commissioning', duration: '3 months', activities: ['Testing', 'Validation', 'Commercial operation'] },
                        { phase: 'Operations', duration: '20 years', activities: ['Production', 'Maintenance', 'Optimization'] }
                      ].map((phase, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium text-blue-800">{phase.phase}</h4>
                          <p className="text-sm text-gray-600 mb-2">{phase.duration}</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            {phase.activities.map((activity, i) => (
                              <li key={i}>• {activity}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInvestmentAnalysis;
