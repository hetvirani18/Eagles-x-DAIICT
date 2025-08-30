# H₂-Optimize — Technical Overview (August 2025)

A full-stack platform for Green Hydrogen location intelligence in Gujarat, India, combining geospatial analysis, economic modeling, and an interactive UI.

## 1) Problem Statement

- Green hydrogen plants must be sited near renewable energy, industrial demand, water sources, and infrastructure to be viable.
- Decisions are hard due to multi-factor tradeoffs: energy cost/reliability, demand proximity, water availability/quality, pipelines, and transport.
- Stakeholders need transparent, data-driven scoring, economics, and visuals to choose locations confidently.

## 2) Solution Summary

- Weighted multi-criteria scoring of any lat/lng in Gujarat across five infrastructure factors, plus economic viability:
  - Energy, Demand, Water, Gas Pipeline, Transport (+ optional Water Bodies)
  - Combined into a final investment-grade score and grade label
- Real data (Gujarat) ingested into MongoDB, surfaced via FastAPI
- Interactive React map with markers, details, search, and “radius rings” to visualize nearby coverage
- Economic calculator modeling CAPEX/OPEX, ROI, payback, NPV, IRR for candidate sites

## 3) Architecture (High level)

- Frontend: React 19, Tailwind, React-Leaflet, Axios
- Backend: FastAPI (async), Motor/MongoDB, Pydantic v2, Uvicorn
- Data: Real Gujarat infrastructure seeded at startup (if empty)
- Docs: OpenAPI at /docs; code docs in repo .md files

```text
React (Map, Search, Details) ── Axios ─▶ FastAPI ──▶ MongoDB
      ▲                                 │
      │                                 └─ Algorithm/Economics services
      └──────────── Live data (WS fetch) and user interactions
```

## 4) Data Model (Backend Pydantic)

Key models (see `backend/models.py`):

- LocationPoint: { latitude: float, longitude: float }
- EnergySource: name, type(Solar|Wind|Hybrid), location, capacity_mw, cost_per_kwh, annual_generation_gwh, operator
- DemandCenter: name, type(Refinery|Chemical|Steel|Fertilizer|Port|Automotive), location, hydrogen_demand_mt_year, willingness_to_pay, etc.
- WaterSource: name, type(River|Canal|Reservoir|Groundwater), location, capacity_liters_day, quality_score, extraction_cost, etc.
- GasPipeline: name, operator, route[LocationPoint], capacity_mmscmd, etc.
- RoadNetwork: name, type(National/State/MDR), route[LocationPoint], connectivity_score, etc.
- WaterBody: name, type, location, area/depth/quality/access
- City: name, state, location, population, district
- SearchBounds and WeightedAnalysisRequest: bounds + per-factor weights

Database connection (`backend/database.py`):

- Env vars used by code: MONGO_URL, DB_NAME (note: differs from README—see "Setup" below)
- Creates basic indexes on location.lat/long (per collection); routes not yet 2dsphere-indexed

Data population on startup (`backend/server.py` lifespan):

- If `energy_sources` is empty: calls `data/populate_data.py:populate_comprehensive_data()` to insert real Gujarat data
- Real datasets provided in `backend/data/real_gujarat_data.py`

## 5) Algorithm Overview

Code: `backend/services/algorithm.py`, detailed doc: `ALGORITHM_EXPLANATION.md`

### Factors and weights

- Energy (30%): proximity to solar/wind + capacity/cost bonuses
- Demand (25%): proximity to buyers + demand volume/premium bonuses
- Water (20%): proximity + capacity/quality bonuses (includes WaterBody)
- Pipeline (15%): distance to gas pipeline + capacity bonus
- Transport (10%): road proximity + connectivity bonus

All scores are 0–100 from inverse-distance curves (Haversine-based):

- score_proximity(d, max) = 0 if d≥max else 100 * (1 − d/max)

### Economic viability (integrated)

- EnhancedEconomicCalculator (`backend/services/economic_calculator.py`):
  - CAPEX: electrolyzer, plant, infrastructure (power/water lines), land
  - OPEX: electricity, water, labor, maintenance, transport
  - Revenue: price per kg adjusted by demand willingness-to-pay and market conditions
  - Metrics: ROI, payback years, NPV (10y @12%), IRR (binary search)
- Economic score combines ROI/Payback/Cost/NPV/Margin with weights, then
- Final score = 70% infrastructure + 30% economic viability
- Investment grade: AAA .. C, based on final score

### Grid search (optimal locations)

- Given bounds (N/S/E/W), create a 20×20 grid but sample every other node (10×10) for performance
- Analyze each node; keep those with overall_score > 200; sort and return top N

### Distance

- Haversine for point-point
- Point-to-route = minimum distance to any route vertex (simple, non-segment-aware)

## 6) Backend API

Base URL: `${REACT_APP_BACKEND_URL}/api` (frontend) or `http://localhost:8080/api` (default)

Implemented in `backend/server.py`:

Data:

- GET /energy-sources — list
- POST /energy-sources — create
- GET /demand-centers — list
- POST /demand-centers — create
- GET /water-sources — list
- POST /water-sources — create
- GET /water-bodies — list
- POST /water-bodies — create
- GET /gas-pipelines — list
- POST /gas-pipelines — create
- GET /road-networks — list
- POST /road-networks — create
- GET /cities?q=Ahmed — case-insensitive search with optional query

Algorithm:

- POST /analyze-location
  - Body: { location: {latitude, longitude}, weights?: WeightedAnalysisRequest }
  - Returns: overall/infrastructure/economic scores, nearest assets, production metrics
- POST /calculate-optimal-locations
  - Body: { bounds: {n,s,e,w}, weights?, limit? }
  - Returns: top N analyses from grid sampling
- GET /optimal-locations
  - Pre-calculated sample results for UI

OpenAPI docs: GET /docs

### Request/Response examples

Analyze a point:

```http
POST /api/analyze-location
{
  "location": {"latitude": 22.3, "longitude": 72.8}
}
```

Response (abridged):

```json
{
  "location": {"latitude": 22.3, "longitude": 72.8},
  "overall_score": 76.3,
  "infrastructure_score": 70.1,
  "economic_score": 90.0,
  "overall_grade": "AA (Excellent Investment)",
  "energy_score": 82.2,
  // ... demand/water/pipeline/transport scores
  "nearest_energy": {"nearest_source": "Charanka Solar Park", "distance_km": 18.7, ...},
  // ... nearest_* details
  "economic_analysis": {
    "roi_percentage": 20.2, "payback_years": 5.8, "production_cost_per_kg": 260,
    "npv_10_years_crores": 22.1, "profit_margin_percentage": 31.5,
    "overall_economic_score": 90.0, "economic_grade": "A+ (Excellent)"
  },
  "production_metrics": {
    "capacity_kg_day": 2000, "annual_capacity_mt": 22000, "projected_cost_per_kg": 260,
    "payback_period_years": 5.8, "roi_percentage": 20.2,
    // if detailed calc available, also includes capex/opex/revenue breakdowns
  }
}
```

## 7) Frontend Flow

Files of interest:

- `src/App.js` (classic UI) and `src/AppReact19.js` (feature toggle demo)
- `src/components/MapComponent.jsx` — React-Leaflet map with energy/demand/water/water-body markers, optimal stars, popups, and resource “radius rings” when a star is clicked
- `src/components/SearchComponent.jsx` and `SearchComponentReact19.jsx` — city autocomplete using `/api/cities`, selects nearest relevant location (optimal>energy>demand)
- `src/components/LocationDetails.jsx` — detailed panel showing scores, proximity, and economic metrics
- `src/hooks/useApiData.js` — loads all datasets in parallel; robust error handling
- `src/services/api.js` — Axios client with interceptors, endpoint wrappers; REACT_APP_BACKEND_URL required

UI concepts:

- Desktop: Left controls, center map, right docked analysis panel (on selection)
- Mobile: Bottom sheet for analysis, compact legend
- Legend and toggles for clarity; About panel for product explainer

React 19 enhancements (optional):

- `useDeferredValue`, `startTransition`, enhanced ErrorBoundary, Suspense fallbacks
- React 19 search variant and data hooks for non-blocking updates

### Radius Rings (coverage visualization)

- Implemented in `MapComponent.jsx`; documented in `RADIUS_RINGS_DOCUMENTATION.md` and `RADIUS_RINGS_IMPLEMENTATION.md`
- On star click: compute max resource distances within thresholds (Energy 100km, Demand 100km, Water 80km), convert to meters, draw styled `Circle`s

## 8) Performance & Resilience

- Backend async IO (Motor + FastAPI); lightweight prox calculations
- Startup seeding only if collections are empty
- Frontend loads all layers concurrently; Promise.allSettled to keep partial UI working
- Axios interceptors for logging and error reporting
- Map and panel transitions optimized; React 19 variant improves perceived responsiveness

## 9) Setup & Running (Windows, bash.exe shells)

Note the env var names used by the code vs. README defaults:

- Code expects: MONGO_URL, DB_NAME (backend/database.py)
- README shows: MONGODB_URL, DATABASE_NAME — prefer the code’s names or align `.env` to match database.py

### Backend

1) Create `.env` in `backend/`:

```ini
MONGO_URL=mongodb://localhost:27017
DB_NAME=h2_optimize
```

2) Install and run:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python server.py
```

- API at <http://localhost:8080> (Docs: /docs)

### Frontend

1) Create `.env` in `frontend/`:

```ini
REACT_APP_BACKEND_URL=http://localhost:8080
WDS_SOCKET_PORT=0
```

2) Install and run (CRACO/CRA):

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

- App at <http://localhost:3000> (set PORT=3001 if needed)

Troubleshooting:

- If you ran `npm start4` by mistake, use `npm start`.
- If frontend cannot reach backend, verify REACT_APP_BACKEND_URL and CORS (CORS is allow-all in server.py)
- If seeding doesn’t occur, ensure MongoDB is running and env vars match code (MONGO_URL/DB_NAME)

## 10) Files & Key Responsibilities

- Backend
  - `server.py`: API endpoints, lifespan startup/shutdown, CORS, pre-calculated optimal-locations endpoint
  - `models.py`: Pydantic schemas (Pydantic v2)
  - `database.py`: Motor client init, indexes, env var usage
  - `services/algorithm.py`: Scoring engine, economic integration, grid search
  - `services/economic_calculator.py`: CAPEX/OPEX, ROI, NPV, IRR; detailed production metrics
  - `data/real_gujarat_data.py`: Real infrastructure datasets
  - `data/populate_data.py`: Clears & inserts comprehensive seed data
- Frontend
  - `src/App.js` & `src/AppReact19.js`: Layout, panels, toggles
  - `src/components/MapComponent.jsx`: Map, markers, rings
  - `src/components/SearchComponent*.jsx`: City search & selection flow
  - `src/components/LocationDetails.jsx`: Score/economics UI
  - `src/hooks/useApiData.js`: Data loading, errors
  - `src/services/api.js`: Axios client + endpoints

## 11) Non-Functional & Security

- CORS: permissive (allow_origins=['*']) for local dev; tighten for prod
- Secrets: Use `.env`; don’t commit real credentials
- Indexing: basic lat/lon indexes; consider 2dsphere for route queries later
- Logging: Python logging in server; Axios console logs in client

## 12) Known Gaps & Roadmap

- Search autocomplete quality needs improvements (ranking, caching)
- Add 2dsphere indexes and true segment distance for pipelines/roads
- Expand data layers (more infrastructure, dynamic updates)
- SSR or code-splitting for initial TTI improvements
- Exportable reports (PDF) and advanced analytics dashboards
- Tests: add API unit tests and E2E smoke tests; there is no `tests/` folder yet

## 13) Contract Summary (APIs & Frontend)

See `contracts.md` for detailed integration notes. Frontend already migrated to API-driven data (`useApiData.js`), city search uses `/cities`, and analysis uses algorithm endpoints.

## 14) Operational Notes

- On first backend run with an empty DB, data is auto-seeded.
- Pre-calculated optimal-locations are hardcoded for immediate UX; replace with dynamic `/calculate-optimal-locations` as needed.
- Economic calculator supports multiple plant sizes (500/1000/2000 kg/day) and returns the most viable option.

— End of document —
