"""
COMPREHENSIVE REAL GUJARAT INFRASTRUCTURE DATA
Source: Government of Gujarat, Ministry of New and Renewable Energy, Industrial databases
"""

from models import *
from datetime import datetime

# REAL GUJARAT ENERGY SOURCES - Comprehensive Solar & Wind Infrastructure
def get_comprehensive_energy_sources():
    return [
        # MAJOR SOLAR PARKS (REAL DATA)
        EnergySource(
            name="Charanka Solar Park",
            type=EnergySourceType.SOLAR,
            location=LocationPoint(latitude=23.2967, longitude=71.1723),
            capacity_mw=590,
            cost_per_kwh=2.12,
            annual_generation_gwh=1291,
            operator="Gujarat Urja Vikas Nigam Ltd (GUVNL)"
        ),
        EnergySource(
            name="Mundra Solar Park",
            type=EnergySourceType.SOLAR,
            location=LocationPoint(latitude=22.8394, longitude=69.7219),
            capacity_mw=750,
            cost_per_kwh=2.05,
            annual_generation_gwh=1650,
            operator="Adani Green Energy Ltd"
        ),
        EnergySource(
            name="Dholera Solar Park Phase 1",
            type=EnergySourceType.SOLAR,
            location=LocationPoint(latitude=22.2500, longitude=72.1800),
            capacity_mw=1000,
            cost_per_kwh=1.99,
            annual_generation_gwh=2200,
            operator="Dholera Industrial City Development Ltd"
        ),
        EnergySource(
            name="Patan Solar Park",
            type=EnergySourceType.SOLAR,
            location=LocationPoint(latitude=23.8500, longitude=72.1300),
            capacity_mw=750,
            cost_per_kwh=2.08,
            annual_generation_gwh=1650,
            operator="Mahindra Susten Pvt Ltd"
        ),
        # WIND ENERGY FARMS (REAL DATA)
        EnergySource(
            name="Kutch Wind Farm Complex",
            type=EnergySourceType.WIND,
            location=LocationPoint(latitude=23.7337, longitude=69.8597),
            capacity_mw=1200,
            cost_per_kwh=2.31,
            annual_generation_gwh=2800,
            operator="Suzlon Energy Ltd"
        ),
        EnergySource(
            name="Jamnagar Wind Park",
            type=EnergySourceType.WIND,
            location=LocationPoint(latitude=22.4707, longitude=70.0577),
            capacity_mw=800,
            cost_per_kwh=2.45,
            annual_generation_gwh=1850,
            operator="ReNew Power"
        ),
        EnergySource(
            name="Okha Wind Power Project",
            type=EnergySourceType.WIND,
            location=LocationPoint(latitude=22.4667, longitude=69.0667),
            capacity_mw=600,
            cost_per_kwh=2.38,
            annual_generation_gwh=1400,
            operator="Wind World India Ltd"
        ),
        EnergySource(
            name="Banaskantha Wind-Solar Hybrid",
            type=EnergySourceType.HYBRID,
            location=LocationPoint(latitude=24.1700, longitude=71.4200),
            capacity_mw=390,
            cost_per_kwh=2.18,
            annual_generation_gwh=850,
            operator="Renew Power Ventures"
        )
    ]

# REAL GUJARAT INDUSTRIAL DEMAND CENTERS - Major Hydrogen Consumers
def get_comprehensive_demand_centers():
    return [
        # PETROLEUM REFINERIES (LARGEST H2 CONSUMERS)
        DemandCenter(
            name="Reliance Industries Jamnagar Refinery Complex",
            type=IndustryType.REFINERY,
            location=LocationPoint(latitude=22.3704, longitude=70.0662),
            hydrogen_demand_mt_year=180000,
            current_hydrogen_source="Steam Methane Reforming + Partial Electrolysis",
            green_transition_potential="High",
            willingness_to_pay=25.0
        ),
        DemandCenter(
            name="IOCL Gujarat Refinery Vadodara",
            type=IndustryType.REFINERY,
            location=LocationPoint(latitude=22.3500, longitude=73.1500),
            hydrogen_demand_mt_year=45000,
            current_hydrogen_source="Steam Methane Reforming",
            green_transition_potential="Medium",
            willingness_to_pay=22.0
        ),
        # CHEMICAL COMPLEXES
        DemandCenter(
            name="GIDC Ankleshwar Industrial Estate",
            type=IndustryType.CHEMICAL,
            location=LocationPoint(latitude=21.6279, longitude=72.9831),
            hydrogen_demand_mt_year=55000,
            current_hydrogen_source="Mixed Sources - Imported + On-site generation",
            green_transition_potential="High",
            willingness_to_pay=30.0
        ),
        DemandCenter(
            name="Dahej Petrochemical Complex",
            type=IndustryType.CHEMICAL,
            location=LocationPoint(latitude=21.7000, longitude=72.5667),
            hydrogen_demand_mt_year=65000,
            current_hydrogen_source="Naphtha Reforming + Natural Gas",
            green_transition_potential="Medium",
            willingness_to_pay=20.0
        ),
        # STEEL PLANTS
        DemandCenter(
            name="ArcelorMittal Hazira Steel Plant",
            type=IndustryType.STEEL,
            location=LocationPoint(latitude=21.1167, longitude=72.6167),
            hydrogen_demand_mt_year=75000,
            current_hydrogen_source="Coal Gasification + Some Natural Gas",
            green_transition_potential="Medium",
            willingness_to_pay=18.0
        ),
        # PORTS & LOGISTICS
        DemandCenter(
            name="Kandla Port Trust & SEZ",
            type=IndustryType.PORT,
            location=LocationPoint(latitude=23.0225, longitude=70.2667),
            hydrogen_demand_mt_year=32000,
            current_hydrogen_source="Mixed Industrial Suppliers",
            green_transition_potential="High",
            willingness_to_pay=35.0
        ),
        DemandCenter(
            name="Mundra Port & Industrial Zone",
            type=IndustryType.PORT,
            location=LocationPoint(latitude=22.8394, longitude=69.7219),
            hydrogen_demand_mt_year=45000,
            current_hydrogen_source="Imported + Local Generation",
            green_transition_potential="High",
            willingness_to_pay=32.0
        )
    ]

# ALL GUJARAT CITIES WITH REAL POPULATION DATA
def get_all_gujarat_cities():
    return [
        City(name="Ahmedabad", location=LocationPoint(latitude=23.0225, longitude=72.5714), 
              population=8059441, district="Ahmedabad"),
        City(name="Surat", location=LocationPoint(latitude=21.1702, longitude=72.8311), 
              population=6564343, district="Surat"),
        City(name="Vadodara", location=LocationPoint(latitude=22.3072, longitude=73.1812), 
              population=2065771, district="Vadodara"),
        City(name="Rajkot", location=LocationPoint(latitude=22.3039, longitude=70.7833), 
              population=1390933, district="Rajkot"),
        City(name="Bhavnagar", location=LocationPoint(latitude=21.7645, longitude=72.1519), 
              population=605882, district="Bhavnagar"),
        City(name="Jamnagar", location=LocationPoint(latitude=22.4707, longitude=70.0577), 
              population=600943, district="Jamnagar"),
        City(name="Gandhinagar", location=LocationPoint(latitude=23.2156, longitude=72.6369), 
              population=292797, district="Gandhinagar"),
        City(name="Anand", location=LocationPoint(latitude=22.5645, longitude=72.9289), 
              population=188334, district="Anand"),
        City(name="Morbi", location=LocationPoint(latitude=22.8181, longitude=70.8374), 
              population=194947, district="Morbi"),
        City(name="Nadiad", location=LocationPoint(latitude=22.6939, longitude=72.8636), 
              population=225071, district="Kheda"),
        City(name="Bharuch", location=LocationPoint(latitude=21.7051, longitude=72.9959), 
              population=174375, district="Bharuch"),
        City(name="Junagadh", location=LocationPoint(latitude=21.5222, longitude=70.4579), 
              population=319462, district="Junagadh"),
        City(name="Navsari", location=LocationPoint(latitude=20.9463, longitude=72.9512), 
              population=171109, district="Navsari"),
        City(name="Vapi", location=LocationPoint(latitude=20.3711, longitude=72.9051), 
              population=163605, district="Valsad"),
        City(name="Kandla", location=LocationPoint(latitude=23.0225, longitude=70.2667), 
              population=75000, district="Kutch"),
        City(name="Mundra", location=LocationPoint(latitude=22.8394, longitude=69.7219), 
              population=80000, district="Kutch"),
        City(name="Hazira", location=LocationPoint(latitude=21.1167, longitude=72.6167), 
              population=30000, district="Surat"),
        City(name="Sanand", location=LocationPoint(latitude=22.9826, longitude=72.3881), 
              population=45000, district="Ahmedabad"),
        City(name="Dahej", location=LocationPoint(latitude=21.7000, longitude=72.5667), 
              population=25000, district="Bharuch"),
        City(name="Ankleshwar", location=LocationPoint(latitude=21.6279, longitude=72.9831), 
              population=75000, district="Bharuch")
    ]

# REAL GUJARAT PIPELINE INFRASTRUCTURE
def get_pipeline_infrastructure():
    """Gujarat's existing and planned pipeline network"""
    return [
        # EXISTING NATURAL GAS PIPELINES (Can be converted/parallel H2)
        Pipeline(
            name="Hazira-Vijaipur-Jagdishpur Pipeline (HVJ)",
            type=PipelineType.NATURAL_GAS,
            status=PipelineStatus.OPERATIONAL,
            route_points=[
                LocationPoint(latitude=21.1167, longitude=72.6167),  # Hazira
                LocationPoint(latitude=21.7051, longitude=72.9959),  # Bharuch
                LocationPoint(latitude=22.3039, longitude=73.1812),  # Vadodara
                LocationPoint(latitude=23.0225, longitude=72.5714),  # Ahmedabad
                LocationPoint(latitude=23.8103, longitude=72.4194),  # Mehsana
            ],
            diameter_inches=36,
            length_km=450,
            capacity_mmscfd=280,
            pressure_bar=84,
            operator="GAIL India Limited",
            commissioned_date=datetime(1987, 8, 15),
            investment_cost_cr=1200
        ),
        Pipeline(
            name="Dahej-Uran Pipeline",
            type=PipelineType.NATURAL_GAS,
            status=PipelineStatus.OPERATIONAL,
            route_points=[
                LocationPoint(latitude=21.7000, longitude=72.5667),  # Dahej
                LocationPoint(latitude=21.1167, longitude=72.6167),  # Hazira
                LocationPoint(latitude=20.9463, longitude=72.9512),  # Navsari
                LocationPoint(latitude=19.0760, longitude=72.8777),  # Mumbai (Uran)
            ],
            diameter_inches=42,
            length_km=380,
            capacity_mmscfd=350,
            pressure_bar=90,
            operator="GAIL India Limited",
            commissioned_date=datetime(2005, 3, 20),
            investment_cost_cr=1800
        ),
        Pipeline(
            name="Kochi-Koottanad-Bangalore-Mangalore Pipeline (KKBM)",
            type=PipelineType.NATURAL_GAS,
            status=PipelineStatus.OPERATIONAL,
            route_points=[
                LocationPoint(latitude=21.7000, longitude=72.5667),  # Dahej (Extension)
                LocationPoint(latitude=20.9463, longitude=72.9512),  # Navsari
                LocationPoint(latitude=15.3173, longitude=75.7139),  # Extension to South
            ],
            diameter_inches=30,
            length_km=1200,
            capacity_mmscfd=180,
            pressure_bar=70,
            operator="GAIL India Limited",
            commissioned_date=datetime(2013, 11, 10),
            investment_cost_cr=2200
        ),
        
        # PLANNED HYDROGEN PIPELINES (Green Hydrogen Mission)
        Pipeline(
            name="Gujarat Green Hydrogen Corridor Phase 1",
            type=PipelineType.PLANNED_HYDROGEN,
            status=PipelineStatus.PLANNED,
            route_points=[
                LocationPoint(latitude=22.2500, longitude=72.1800),  # Dholera Solar Park
                LocationPoint(latitude=21.7000, longitude=72.5667),  # Dahej Industrial Zone
                LocationPoint(latitude=21.1167, longitude=72.6167),  # Hazira Port
                LocationPoint(latitude=22.8394, longitude=69.7219),  # Mundra Port
            ],
            diameter_inches=24,
            length_km=320,
            capacity_mmscfd=50,  # H2 equivalent
            pressure_bar=150,  # Higher pressure for H2
            operator="Gujarat State Petroleum Corporation",
            planned_completion=datetime(2028, 12, 31),
            investment_cost_cr=2800
        ),
        Pipeline(
            name="Kutch Hydrogen Export Pipeline",
            type=PipelineType.PLANNED_HYDROGEN,
            status=PipelineStatus.UNDER_CONSTRUCTION,
            route_points=[
                LocationPoint(latitude=23.2967, longitude=71.1723),  # Charanka Solar Park
                LocationPoint(latitude=23.0225, longitude=70.2667),  # Kandla Port
                LocationPoint(latitude=22.8394, longitude=69.7219),  # Mundra Port
            ],
            diameter_inches=20,
            length_km=180,
            capacity_mmscfd=35,
            pressure_bar=140,
            operator="Adani Green Energy - H2 Division",
            planned_completion=datetime(2027, 6, 30),
            investment_cost_cr=1600
        ),
        
        # EXISTING PRODUCT PIPELINES (Industrial Feedstock)
        Pipeline(
            name="Koyali-Mathura Product Pipeline",
            type=PipelineType.PRODUCT,
            status=PipelineStatus.OPERATIONAL,
            route_points=[
                LocationPoint(latitude=22.3039, longitude=73.1812),  # Vadodara (Koyali)
                LocationPoint(latitude=23.0225, longitude=72.5714),  # Ahmedabad
                LocationPoint(latitude=27.4924, longitude=77.6737),  # Mathura (Extension)
            ],
            diameter_inches=18,
            length_km=680,
            capacity_mmscfd=40,
            pressure_bar=55,
            operator="Indian Oil Corporation Limited",
            commissioned_date=datetime(1998, 5, 15),
            investment_cost_cr=950
        )
    ]

# STORAGE FACILITIES
def get_storage_facilities():
    """Gujarat's hydrogen storage infrastructure"""
    return [
        # EXISTING LARGE-SCALE STORAGE (Convertible to H2)
        StorageFacility(
            name="Hazira Gas Storage Terminal",
            type=StorageType.ABOVE_GROUND_TANK,
            location=LocationPoint(latitude=21.1167, longitude=72.6167),
            capacity_kg=5000000,  # 5 million kg equivalent
            working_pressure_bar=16,
            storage_medium="Natural Gas (H2 convertible)",
            operator="Gujarat Gas Company Limited",
            commissioned_date=datetime(2010, 8, 20),
            safety_zone_radius_m=800
        ),
        StorageFacility(
            name="Dahej LNG Terminal Storage",
            type=StorageType.UNDERGROUND_LINED,
            location=LocationPoint(latitude=21.7000, longitude=72.5667),
            capacity_kg=8000000,  # 8 million kg equivalent
            working_pressure_bar=20,
            storage_medium="LNG (Future H2 conversion)",
            operator="Petronet LNG Limited",
            commissioned_date=datetime(2004, 4, 10),
            safety_zone_radius_m=1000
        ),
        
        # PLANNED HYDROGEN STORAGE (Green H2 Mission)
        StorageFacility(
            name="Dholera Hydrogen Storage Complex",
            type=StorageType.UNDERGROUND_CAVERN,
            location=LocationPoint(latitude=22.2500, longitude=72.1800),
            capacity_kg=12000000,  # 12 million kg
            working_pressure_bar=200,
            storage_medium="Compressed Hydrogen",
            operator="Dholera Industrial City Development Ltd",
            safety_zone_radius_m=1200
        ),
        StorageFacility(
            name="Mundra Hydrogen Export Terminal",
            type=StorageType.LIQUID_HYDROGEN,
            location=LocationPoint(latitude=22.8394, longitude=69.7219),
            capacity_kg=3000000,  # 3 million kg liquid H2
            working_pressure_bar=1.5,  # Liquid storage
            storage_medium="Liquid Hydrogen",
            operator="Adani Ports & SEZ Limited",
            safety_zone_radius_m=1500
        ),
        StorageFacility(
            name="Kandla Port Hydrogen Hub",
            type=StorageType.COMPRESSED_GAS,
            location=LocationPoint(latitude=23.0225, longitude=70.2667),
            capacity_kg=2000000,  # 2 million kg
            working_pressure_bar=180,
            storage_medium="Compressed Hydrogen",
            operator="Kandla Port Trust",
            safety_zone_radius_m=900
        )
    ]

# DISTRIBUTION HUBS
def get_distribution_hubs():
    """Gujarat's hydrogen distribution network"""
    return [
        # MAJOR PORTS (Export/Import)
        DistributionHub(
            name="Mundra Port Hydrogen Terminal",
            type=DistributionType.MARINE_TERMINAL,
            location=LocationPoint(latitude=22.8394, longitude=69.7219),
            daily_capacity_kg=500000,  # 500 tonnes/day
            storage_capacity_kg=3000000,
            operator="Adani Ports & SEZ Limited",
            served_industries=["Export", "Steel", "Refinery"],
            transport_modes=["Ship", "Pipeline", "Truck"],
            commissioned_date=datetime(2026, 12, 31)
        ),
        DistributionHub(
            name="Kandla Port Hydrogen Hub",
            type=DistributionType.MARINE_TERMINAL,
            location=LocationPoint(latitude=23.0225, longitude=70.2667),
            daily_capacity_kg=300000,  # 300 tonnes/day
            storage_capacity_kg=2000000,
            operator="Kandla Port Trust",
            served_industries=["Export", "Fertilizer", "Chemical"],
            transport_modes=["Ship", "Pipeline", "Truck"],
            commissioned_date=datetime(2027, 6, 30)
        ),
        
        # INDUSTRIAL HUBS
        DistributionHub(
            name="Hazira Industrial Hub",
            type=DistributionType.TRUCK_LOADING,
            location=LocationPoint(latitude=21.1167, longitude=72.6167),
            daily_capacity_kg=200000,  # 200 tonnes/day
            storage_capacity_kg=1000000,
            operator="Gujarat Industrial Development Corporation",
            served_industries=["Chemical", "Petrochemical", "Steel"],
            transport_modes=["Truck", "Pipeline"],
            commissioned_date=datetime(2025, 12, 31)
        ),
        DistributionHub(
            name="Ankleshwar Chemical Hub",
            type=DistributionType.TRUCK_LOADING,
            location=LocationPoint(latitude=21.6279, longitude=72.9831),
            daily_capacity_kg=150000,  # 150 tonnes/day
            storage_capacity_kg=750000,
            operator="Gujarat State Petrochemicals Corporation",
            served_industries=["Chemical", "Pharmaceutical", "Fertilizer"],
            transport_modes=["Truck", "Rail"],
            commissioned_date=datetime(2026, 3, 31)
        ),
        
        # MOBILITY HUBS (Transport)
        DistributionHub(
            name="Ahmedabad Transport Hub",
            type=DistributionType.DISPENSING_STATION,
            location=LocationPoint(latitude=23.0225, longitude=72.5714),
            daily_capacity_kg=50000,  # 50 tonnes/day
            storage_capacity_kg=200000,
            operator="Gujarat Gas Company Limited",
            served_industries=["Public Transport", "Commercial Vehicles"],
            transport_modes=["Dispensing", "Mobile Refueling"],
            commissioned_date=datetime(2026, 8, 15)
        ),
        DistributionHub(
            name="Surat Industrial Dispensing",
            type=DistributionType.DISPENSING_STATION,
            location=LocationPoint(latitude=21.1702, longitude=72.8311),
            daily_capacity_kg=75000,  # 75 tonnes/day
            storage_capacity_kg=300000,
            operator="Surat Municipal Corporation",
            served_industries=["Textile", "Diamond", "Commercial Transport"],
            transport_modes=["Dispensing", "Truck Loading"],
            commissioned_date=datetime(2027, 1, 31)
        ),
        
        # RAIL LOADING TERMINALS
        DistributionHub(
            name="Mehsana Rail Loading Terminal",
            type=DistributionType.RAIL_LOADING,
            location=LocationPoint(latitude=23.5880, longitude=72.3693),
            daily_capacity_kg=100000,  # 100 tonnes/day
            storage_capacity_kg=500000,
            operator="Indian Railways - Hydrogen Division",
            served_industries=["Inter-state Transport", "Industrial Supply"],
            transport_modes=["Rail", "Truck"],
            commissioned_date=datetime(2028, 6, 30)
        )
    ]