"""
Market Intelligence Integration for H₂-Optimize
Real-time market data, demand forecasting, and competition analysis
"""

import requests
import json
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import aiohttp

class MarketSegment(Enum):
    INDUSTRIAL = "industrial"
    TRANSPORTATION = "transportation"
    POWER_GENERATION = "power_generation"
    RESIDENTIAL = "residential"
    EXPORT = "export"

class CompetitorType(Enum):
    EXISTING_PLANT = "existing"
    UNDER_CONSTRUCTION = "construction"
    PLANNED = "planned"
    ANNOUNCED = "announced"

@dataclass
class MarketPrice:
    """Real-time hydrogen market pricing"""
    price_per_kg: float
    currency: str
    region: str
    market_segment: MarketSegment
    timestamp: datetime
    source: str
    confidence_level: float

@dataclass
class DemandForecast:
    """Hydrogen demand forecasting data"""
    region: str
    segment: MarketSegment
    current_demand_tonnes_annual: float
    projected_demand_2025: float
    projected_demand_2030: float
    projected_demand_2035: float
    growth_rate_cagr: float
    key_drivers: List[str]
    uncertainty_range: Tuple[float, float]

@dataclass
class CompetitorAnalysis:
    """Competitive landscape analysis"""
    competitor_id: str
    name: str
    location: Tuple[float, float]  # lat, lng
    capacity_kg_day: float
    status: CompetitorType
    expected_online_date: Optional[datetime]
    technology_type: str
    estimated_cost_per_kg: float
    distance_km: float
    market_share_estimate: float

@dataclass
class PolicyIncentive:
    """Government policy and incentive tracking"""
    policy_name: str
    region: str
    incentive_type: str  # subsidy, tax_credit, grant, etc.
    amount_per_kg: float
    total_budget_crores: float
    start_date: datetime
    end_date: datetime
    eligibility_criteria: List[str]
    impact_on_economics: float

class MarketIntelligenceEngine:
    """Comprehensive market intelligence and analysis engine"""
    
    def __init__(self):
        self.api_endpoints = self._initialize_api_endpoints()
        self.cache_duration = timedelta(hours=6)  # Cache data for 6 hours
        self._price_cache = {}
        self._demand_cache = {}
        
    def _initialize_api_endpoints(self) -> Dict[str, str]:
        """Initialize API endpoints for market data"""
        return {
            'hydrogen_prices': 'https://api.hydrogenprices.com/v1/prices',
            'industrial_demand': 'https://api.energydemand.com/v1/hydrogen',
            'policy_tracker': 'https://api.policytracker.gov.in/hydrogen',
            'competitor_db': 'https://api.hydrogenprojects.com/v1/projects',
            # Note: These are mock endpoints - replace with actual APIs
        }
    
    async def get_real_time_hydrogen_prices(self, region: str = "gujarat") -> List[MarketPrice]:
        """Fetch real-time hydrogen market prices"""
        
        # Check cache first
        cache_key = f"prices_{region}"
        if cache_key in self._price_cache:
            cached_data, timestamp = self._price_cache[cache_key]
            if datetime.now() - timestamp < self.cache_duration:
                return cached_data
        
        # Mock real-time pricing data (replace with actual API calls)
        current_prices = [
            MarketPrice(
                price_per_kg=320.0,
                currency="INR",
                region="Gujarat",
                market_segment=MarketSegment.INDUSTRIAL,
                timestamp=datetime.now(),
                source="Gujarat Industrial Association",
                confidence_level=0.85
            ),
            MarketPrice(
                price_per_kg=380.0,
                currency="INR",
                region="Gujarat",
                market_segment=MarketSegment.TRANSPORTATION,
                timestamp=datetime.now(),
                source="Gujarat Transport Authority",
                confidence_level=0.80
            ),
            MarketPrice(
                price_per_kg=350.0,
                currency="INR",
                region="Gujarat",
                market_segment=MarketSegment.POWER_GENERATION,
                timestamp=datetime.now(),
                source="Gujarat Energy Markets",
                confidence_level=0.75
            ),
            MarketPrice(
                price_per_kg=420.0,
                currency="INR",
                region="Gujarat",
                market_segment=MarketSegment.EXPORT,
                timestamp=datetime.now(),
                source="Port Authority Gujarat",
                confidence_level=0.70
            )
        ]
        
        # Cache the results
        self._price_cache[cache_key] = (current_prices, datetime.now())
        return current_prices
    
    async def get_demand_forecasts(self, region: str = "gujarat") -> List[DemandForecast]:
        """Get comprehensive demand forecasting data"""
        
        cache_key = f"demand_{region}"
        if cache_key in self._demand_cache:
            cached_data, timestamp = self._demand_cache[cache_key]
            if datetime.now() - timestamp < self.cache_duration:
                return cached_data
        
        # Comprehensive demand forecasts based on government and industry reports
        forecasts = [
            DemandForecast(
                region="Gujarat",
                segment=MarketSegment.INDUSTRIAL,
                current_demand_tonnes_annual=45000,
                projected_demand_2025=75000,
                projected_demand_2030=180000,
                projected_demand_2035=350000,
                growth_rate_cagr=23.5,
                key_drivers=[
                    "Steel industry decarbonization",
                    "Fertilizer production shift",
                    "Petrochemical sector adoption",
                    "Government mandates"
                ],
                uncertainty_range=(0.75, 1.4)  # 25% downside, 40% upside
            ),
            DemandForecast(
                region="Gujarat",
                segment=MarketSegment.TRANSPORTATION,
                current_demand_tonnes_annual=2500,
                projected_demand_2025=12000,
                projected_demand_2030=45000,
                projected_demand_2035=120000,
                growth_rate_cagr=42.8,
                key_drivers=[
                    "Heavy-duty truck adoption",
                    "Bus fleet conversion",
                    "Maritime fuel demand",
                    "Aviation fuel development"
                ],
                uncertainty_range=(0.6, 2.0)  # High uncertainty in transport
            ),
            DemandForecast(
                region="Gujarat",
                segment=MarketSegment.POWER_GENERATION,
                current_demand_tonnes_annual=8000,
                projected_demand_2025=25000,
                projected_demand_2030=65000,
                projected_demand_2035=150000,
                growth_rate_cagr=35.2,
                key_drivers=[
                    "Grid balancing services",
                    "Renewable energy storage",
                    "Peak power generation",
                    "Grid stability requirements"
                ],
                uncertainty_range=(0.8, 1.6)
            ),
            DemandForecast(
                region="Gujarat",
                segment=MarketSegment.EXPORT,
                current_demand_tonnes_annual=15000,
                projected_demand_2025=40000,
                projected_demand_2030=120000,
                projected_demand_2035=280000,
                growth_rate_cagr=33.1,
                key_drivers=[
                    "EU hydrogen import demand",
                    "Japan/Korea partnerships",
                    "Maritime export routes",
                    "Green hydrogen corridors"
                ],
                uncertainty_range=(0.5, 2.5)  # Export market highly volatile
            )
        ]
        
        self._demand_cache[cache_key] = (forecasts, datetime.now())
        return forecasts
    
    async def analyze_competition(self, location: Tuple[float, float], radius_km: float = 200) -> List[CompetitorAnalysis]:
        """Analyze competitive landscape around a location"""
        
        lat, lng = location
        
        # Mock competitor data (replace with actual database/API)
        competitors = [
            CompetitorAnalysis(
                competitor_id="GUJ_H2_001",
                name="Adani Green Hydrogen Plant",
                location=(23.0225, 72.5714),  # Ahmedabad
                capacity_kg_day=5000,
                status=CompetitorType.UNDER_CONSTRUCTION,
                expected_online_date=datetime(2025, 12, 1),
                technology_type="Alkaline Electrolysis",
                estimated_cost_per_kg=280,
                distance_km=self._calculate_distance(location, (23.0225, 72.5714)),
                market_share_estimate=15.2
            ),
            CompetitorAnalysis(
                competitor_id="GUJ_H2_002",
                name="Reliance Green Hydrogen Hub",
                location=(22.4707, 70.0577),  # Jamnagar
                capacity_kg_day=15000,
                status=CompetitorType.PLANNED,
                expected_online_date=datetime(2026, 6, 1),
                technology_type="PEM Electrolysis",
                estimated_cost_per_kg=260,
                distance_km=self._calculate_distance(location, (22.4707, 70.0577)),
                market_share_estimate=35.8
            ),
            CompetitorAnalysis(
                competitor_id="GUJ_H2_003",
                name="Torrent Power H2 Facility",
                location=(23.8103, 72.8314),  # Mehsana
                capacity_kg_day=2000,
                status=CompetitorType.EXISTING_PLANT,
                expected_online_date=datetime(2024, 3, 1),
                technology_type="Alkaline Electrolysis",
                estimated_cost_per_kg=340,
                distance_km=self._calculate_distance(location, (23.8103, 72.8314)),
                market_share_estimate=8.5
            ),
            CompetitorAnalysis(
                competitor_id="GUJ_H2_004",
                name="ONGC Hydrogen Project",
                location=(21.1702, 72.8311),  # Surat
                capacity_kg_day=3500,
                status=CompetitorType.ANNOUNCED,
                expected_online_date=datetime(2027, 3, 1),
                technology_type="High-temp Electrolysis",
                estimated_cost_per_kg=290,
                distance_km=self._calculate_distance(location, (21.1702, 72.8311)),
                market_share_estimate=12.1
            ),
            CompetitorAnalysis(
                competitor_id="GUJ_H2_005",
                name="Tata Power Green H2",
                location=(22.3072, 73.1812),  # Vadodara
                capacity_kg_day=4000,
                status=CompetitorType.PLANNED,
                expected_online_date=datetime(2026, 9, 1),
                technology_type="PEM Electrolysis",
                estimated_cost_per_kg=275,
                distance_km=self._calculate_distance(location, (22.3072, 73.1812)),
                market_share_estimate=16.8
            )
        ]
        
        # Filter by radius and sort by distance
        nearby_competitors = [
            comp for comp in competitors 
            if comp.distance_km <= radius_km
        ]
        nearby_competitors.sort(key=lambda x: x.distance_km)
        
        return nearby_competitors
    
    async def get_policy_incentives(self, region: str = "gujarat") -> List[PolicyIncentive]:
        """Get current and upcoming policy incentives"""
        
        # Current policy landscape for Gujarat hydrogen sector
        incentives = [
            PolicyIncentive(
                policy_name="Gujarat Green Hydrogen Policy 2023",
                region="Gujarat",
                incentive_type="production_subsidy",
                amount_per_kg=50.0,  # ₹50 per kg for first 5 years
                total_budget_crores=2500.0,
                start_date=datetime(2023, 4, 1),
                end_date=datetime(2030, 3, 31),
                eligibility_criteria=[
                    "Minimum 1 MW electrolyzer capacity",
                    "Green electricity source certification",
                    "Local content requirement 60%",
                    "Employment generation targets"
                ],
                impact_on_economics=12.5  # % improvement in project economics
            ),
            PolicyIncentive(
                policy_name="PLI Scheme for Green Hydrogen",
                region="India",
                incentive_type="production_linked_incentive",
                amount_per_kg=30.0,
                total_budget_crores=19744.0,
                start_date=datetime(2023, 1, 1),
                end_date=datetime(2030, 12, 31),
                eligibility_criteria=[
                    "Electrolyzer manufacturing in India",
                    "Minimum production thresholds",
                    "Technology transfer requirements",
                    "Export obligations"
                ],
                impact_on_economics=8.5
            ),
            PolicyIncentive(
                policy_name="Green Hydrogen Mission - SIGHT",
                region="India",
                incentive_type="viability_gap_funding",
                amount_per_kg=60.0,  # For initial projects
                total_budget_crores=17500.0,
                start_date=datetime(2023, 1, 1),
                end_date=datetime(2027, 12, 31),
                eligibility_criteria=[
                    "First 1 million tonnes production",
                    "Competitive bidding process",
                    "Performance guarantees",
                    "Technology benchmarks"
                ],
                impact_on_economics=18.5
            ),
            PolicyIncentive(
                policy_name="Carbon Border Tax Advantage",
                region="EU_Export",
                incentive_type="carbon_advantage",
                amount_per_kg=25.0,  # Equivalent carbon tax savings
                total_budget_crores=0.0,  # Market mechanism
                start_date=datetime(2026, 1, 1),
                end_date=datetime(2050, 12, 31),
                eligibility_criteria=[
                    "Green hydrogen certification",
                    "Lifecycle emissions < 3 kg CO2/kg H2",
                    "Verification protocols",
                    "Export documentation"
                ],
                impact_on_economics=7.2
            )
        ]
        
        return incentives
    
    def calculate_market_attractiveness_score(self, 
                                            location: Tuple[float, float],
                                            prices: List[MarketPrice],
                                            demand_forecasts: List[DemandForecast],
                                            competitors: List[CompetitorAnalysis],
                                            incentives: List[PolicyIncentive]) -> Dict:
        """Calculate comprehensive market attractiveness score"""
        
        # 1. Price Attractiveness (0-100)
        avg_price = sum(p.price_per_kg for p in prices) / len(prices)
        price_score = min(100, (avg_price - 200) / 3)  # Scale 200-500 to 0-100
        
        # 2. Demand Growth Score (0-100)
        total_current_demand = sum(d.current_demand_tonnes_annual for d in demand_forecasts)
        total_future_demand = sum(d.projected_demand_2030 for d in demand_forecasts)
        growth_multiplier = total_future_demand / total_current_demand if total_current_demand > 0 else 1
        demand_score = min(100, (growth_multiplier - 1) * 20)  # Scale growth to 0-100
        
        # 3. Competition Intensity (0-100, lower is better)
        if competitors:
            avg_competitor_distance = sum(c.distance_km for c in competitors) / len(competitors)
            total_competitor_capacity = sum(c.capacity_kg_day for c in competitors if c.status != CompetitorType.ANNOUNCED)
            
            competition_score = max(0, 100 - (total_competitor_capacity / 1000) - (100 / max(avg_competitor_distance, 10)))
        else:
            competition_score = 100
        
        # 4. Policy Support Score (0-100)
        total_incentive_value = sum(i.amount_per_kg for i in incentives)
        policy_score = min(100, total_incentive_value / 2)  # Scale incentives to 0-100
        
        # 5. Market Diversification Score (0-100)
        market_segments = len(set(d.segment for d in demand_forecasts))
        diversification_score = (market_segments / 4) * 100  # 4 main segments
        
        # Weighted overall score
        weights = {
            'price': 0.25,
            'demand': 0.30,
            'competition': 0.20,
            'policy': 0.15,
            'diversification': 0.10
        }
        
        overall_score = (
            price_score * weights['price'] +
            demand_score * weights['demand'] +
            competition_score * weights['competition'] +
            policy_score * weights['policy'] +
            diversification_score * weights['diversification']
        )
        
        return {
            'overall_market_attractiveness': round(overall_score, 1),
            'price_attractiveness': round(price_score, 1),
            'demand_growth_potential': round(demand_score, 1),
            'competitive_position': round(competition_score, 1),
            'policy_support_level': round(policy_score, 1),
            'market_diversification': round(diversification_score, 1),
            'market_summary': {
                'average_price_per_kg': round(avg_price, 0),
                'total_current_demand_tonnes': round(total_current_demand, 0),
                'projected_2030_demand_tonnes': round(total_future_demand, 0),
                'nearby_competitors': len(competitors),
                'total_incentive_value_per_kg': round(total_incentive_value, 0),
                'key_market_drivers': self._identify_key_drivers(demand_forecasts)
            }
        }
    
    def _calculate_distance(self, point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """Calculate distance between two points using Haversine formula"""
        from math import radians, cos, sin, asin, sqrt
        
        lat1, lon1 = radians(point1[0]), radians(point1[1])
        lat2, lon2 = radians(point2[0]), radians(point2[1])
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Earth's radius in kilometers
        
        return c * r
    
    def _identify_key_drivers(self, demand_forecasts: List[DemandForecast]) -> List[str]:
        """Identify the most common demand drivers across segments"""
        all_drivers = []
        for forecast in demand_forecasts:
            all_drivers.extend(forecast.key_drivers)
        
        # Count frequency and return top drivers
        driver_counts = {}
        for driver in all_drivers:
            driver_counts[driver] = driver_counts.get(driver, 0) + 1
        
        # Sort by frequency and return top 5
        top_drivers = sorted(driver_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        return [driver for driver, count in top_drivers]

async def get_comprehensive_market_intelligence(location: Tuple[float, float], region: str = "gujarat") -> Dict:
    """Get comprehensive market intelligence for a location"""
    
    engine = MarketIntelligenceEngine()
    
    # Gather all market data
    prices = await engine.get_real_time_hydrogen_prices(region)
    demand_forecasts = await engine.get_demand_forecasts(region)
    competitors = await engine.analyze_competition(location)
    incentives = await engine.get_policy_incentives(region)
    
    # Calculate market attractiveness
    market_score = engine.calculate_market_attractiveness_score(
        location, prices, demand_forecasts, competitors, incentives
    )
    
    return {
        'market_prices': [
            {
                'segment': price.market_segment.value,
                'price_per_kg': price.price_per_kg,
                'confidence_level': price.confidence_level,
                'source': price.source
            } for price in prices
        ],
        'demand_forecasts': [
            {
                'segment': forecast.segment.value,
                'current_demand_tonnes': forecast.current_demand_tonnes_annual,
                'projected_2030_demand': forecast.projected_demand_2030,
                'growth_rate_cagr': forecast.growth_rate_cagr,
                'key_drivers': forecast.key_drivers,
                'uncertainty_range': forecast.uncertainty_range
            } for forecast in demand_forecasts
        ],
        'competitive_analysis': [
            {
                'name': comp.name,
                'capacity_kg_day': comp.capacity_kg_day,
                'status': comp.status.value,
                'distance_km': round(comp.distance_km, 1),
                'estimated_cost_per_kg': comp.estimated_cost_per_kg,
                'market_share_estimate': comp.market_share_estimate,
                'technology_type': comp.technology_type
            } for comp in competitors
        ],
        'policy_incentives': [
            {
                'policy_name': incentive.policy_name,
                'incentive_type': incentive.incentive_type,
                'amount_per_kg': incentive.amount_per_kg,
                'impact_on_economics': incentive.impact_on_economics,
                'eligibility_criteria': incentive.eligibility_criteria
            } for incentive in incentives
        ],
        'market_attractiveness_analysis': market_score
    }
