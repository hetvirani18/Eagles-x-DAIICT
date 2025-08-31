# 🌿 H₂-Optimize: Green Hydrogen Infrastructure Mapping and Optimization

![H₂-Optimize Banner](https://github.com/hetvirani18/Eag## 🛠️ Tech Stack &### 🗺️ Interactive M### 📱 User Experiencep ExperienceLibrarieses-x-DAIICT/blob/main/public/banner.png)

## 📝 Problem Statement

Identifying where to grow the hydrogen ecosystem requires a map-based tool that visualizes all existing/planned assets (plants, storage, pipelines, distribution hubs) and uses data-driven models to guide new investments. This problem involves creating an interactive map layered with infrastructure data, renewable energy sources, demand centres, and transport logistics. The tool should offer site selection recommendations for new projects based on criteria such as proximity to renewable generation, market demand, regulatory zones, or cost optimization.

## 🎯 Our Solution

H₂-Optimize is a sophisticated geospatial intelligence platform designed to revolutionize green hydrogen infrastructure planning in Gujarat, India. By leveraging advanced algorithms and comprehensive data analysis, our solution offers precision-driven location recommendations for optimal hydrogen production facilities.

## 🔄 Solution Flow

1. **Data Collection & Integration** - Comprehensive geospatial data on energy resources, infrastructure, and demand centers
2. **Multi-factor Analysis** - Algorithmic assessment based on proximity, capacity, and economic factors
3. **Location Scoring** - 300-point rating system evaluating infrastructure, technical, and operational factors
4. **Visualization Layer** - Interactive map displaying optimal locations with detailed analysis
5. **Decision Support Tools** - Advanced financial modeling and technical risk assessment
6. **Export Capabilities** - Downloadable reports in multiple formats (PDF, CSV, JSON)

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** (Backend)
- **Node.js 18+** (Frontend)
- **MongoDB** (Database)

#### Windows (PowerShell)

````powershell
# Start Backend
.\start-backend.ps1

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8080 --reload
````

#### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/docs

### ✅ Modernized Backend (v2.0)

- **Updated FastAPI to v0.116.1** (latest stable)
- **Replaced deprecated `@app.on_event()`** with modern `lifespan` context manager
- **Updated all dependencies** to latest stable versions
- **Added uvicorn[standard]** with enhanced performance features
- **Improved startup/shutdown lifecycle management**

### 🧪 Comprehensive Testing Complete

- ✅ **Interactive map functionality** - fully working
- ✅ **Marker interactions and popups** - fully working
- ✅ **Optimal location analysis** - fully working
- ✅ **Backend API integration** - fully working
- ✅ **Professional UI/UX design** - fully working
- ⚠️ **Search functionality** - autocomplete needs improvement

## 🏗️ System Architecture

```
┌─────────────────────────┐       ┌─────────────────────────┐
│     Client Browser      │◄─────►│   React Frontend (UI)   │
└─────────────────────────┘       └───────────┬─────────────┘
                                             │
                                             ▼
                                  ┌─────────────────────────┐
                                  │   FastAPI Backend API   │
                                  └───────────┬─────────────┘
                                             │
                        ┌────────────────────┼────────────────────┐
                        ▼                    ▼                    ▼
              ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
              │  Data Services  │   │ Analysis Engine │   │ Export Services │
              └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
                       │                     │                     │
                       ▼                     ▼                     ▼
              ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
              │  MongoDB Atlas  │   │  Computational  │   │ Report Generator│
              │    Database     │   │    Pipeline     │   │    Services     │
              └─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Backend (FastAPI)

- **Modern Python 3.13** async/await patterns
- **MongoDB** with Motor async driver
- **Pydantic v2** for data validation
- **CORS enabled** for frontend integration
- **Auto-generated OpenAPI docs**

### Frontend (React 19)

- **React 19** with modern concurrent features
- **useDeferredValue** for optimized search performance
- **startTransition** for non-blocking state updates
- **Enhanced error boundaries** and Suspense
- **Feature toggle** to compare React 19 vs Classic modes
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Component-based architecture**

## 📊 Data Authenticity

The H₂-Optimize platform utilizes high-quality geospatial data compiled from authoritative sources:

- **Energy Infrastructure** - Comprehensive mapping of renewable energy sources with precise latitude/longitude coordinates, capacity ratings, and generation metrics
- **Industrial Demand Centers** - Accurately positioned industrial facilities with hydrogen demand projections based on sector analysis
- **Water Resources** - Detailed mapping of water bodies and treatment facilities with quality ratings and capacity metrics
- **Transportation Networks** - Complete road and rail infrastructure with accessibility scoring
- **Economic Factors** - Region-specific cost analysis incorporating local economic conditions

All location data includes precise geographical coordinates (latitude/longitude) enabling accurate distance calculations and proximity analysis. Our data undergoes rigorous validation to ensure reliability for investment-grade decision making.

## �️ Tech Stack & Libraries

### Backend

- **Python (FastAPI)** - Modern high-performance API framework
- **MongoDB** - NoSQL database with geospatial indexing
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server for high-performance API serving
- **Computational Packages** - NumPy, Pandas, SciPy for analytical processing

### Frontend

- **React 19** - Modern UI library with concurrent features
- **Leaflet.js** - Interactive mapping library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Shadcn/UI** - High-quality React components
- **Axios** - Promise-based HTTP client

## ✨ Key Features

### �️ Interactive Map Experience

- **Multi-layer Visualization** - Toggle between energy sources, demand centers, water resources, and optimal locations
- **Dynamic Data Rendering** - Performance-optimized marker clustering and viewport management
- **Custom Map Icons** - Intuitive visual indicators for different infrastructure types
- **Resource Coverage Rings** - Visual representation of resource accessibility radius

### 📊 Advanced Analysis Tools

- **Comprehensive Scoring System** - 300-point scale evaluating multiple factors:
  - Infrastructure (40%): Transportation, power, and water access
  - Technical (30%): Risk assessment, performance metrics
  - Operational (30%): Maintenance requirements, operational efficiency
- **Economic Analysis** - Detailed CAPEX/OPEX breakdown, ROI projections, payback period calculation
- **Technical Risk Assessment** - Quantified risk factors with mitigation strategies
- **Resource Allocation Visualization** - Interactive charts showing cost distribution

### 🔍 Location Intelligence

- **City Search Functionality** - Quick navigation to regions of interest
- **Proximity Analysis** - Distance-based scoring to critical resources
- **Multi-criteria Optimization** - Balanced assessment of competing factors
- **Site Comparison** - Head-to-head evaluation of multiple potential locations

### � User Experience

- **Intuitive Interface** - Clean, professional design optimized for decision-makers
- **Responsive Layout** - Fully functional across desktop and tablet devices
- **Accessible Design** - WCAG-compliant UI components
- **Performance Optimization** - React 19 concurrent features for smooth interactions

### 📤 Data Export Options

- **Multiple Format Support** - Export data in PDF, CSV, and JSON formats
- **Custom Report Generation** - Tailored analysis reports for stakeholders
- **Raw Data Access** - Direct access to underlying datasets for further analysis

## 🛠️ Development

### Code Quality Tools

```bash
# In backend directory
black .                # Code formatting
isort .                # Import sorting
flake8 .              # Linting
mypy .                # Type checking
pytest tests/         # Testing
```

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=h2_optimize
```

**Frontend (.env)**

```env
REACT_APP_BACKEND_URL=http://localhost:8080
WDS_SOCKET_PORT=0
```

## 📝 API Endpoints

- `GET /api/energy-sources` - Renewable energy sources
- `GET /api/demand-centers` - Industrial demand centers
- `GET /api/water-sources` - Water infrastructure
- `GET /api/water-bodies` - Water bodies
- `GET /api/gas-pipelines` - Gas pipeline networks
- `GET /api/road-networks` - Road transportation networks
- `GET /api/cities?q=` - City search (autocomplete)
- `GET /api/optimal-locations` - Algorithmic optimal locations (grid-based)
- `POST /api/analyze-location` - Analyze a single location
- `POST /api/calculate-optimal-locations` - Grid search within bounds
- New infra: `GET /api/pipelines`, `GET /api/storage-facilities`, `GET /api/distribution-hubs`
- Advanced: `/api/v1/advanced/*` (comprehensive analysis, comparisons, capacity optimization, financial modeling)
- More details in API docs at `/docs`

## 📚 Resources & Assets

- [Project Demo Video](https://github.com/hetvirani18/Eagles-x-DAIICT/demo.mp4) - Visual walkthrough of key features
- [Technical Documentation](https://github.com/hetvirani18/Eagles-x-DAIICT/docs/technical_docs.pdf) - Detailed system architecture
- [Algorithm Explanation](https://github.com/hetvirani18/Eagles-x-DAIICT/ALGORITHM_EXPLANATION.md) - Scoring methodology details
- [Economic Analysis Model](https://github.com/hetvirani18/Eagles-x-DAIICT/COMPREHENSIVE_ECONOMIC_ANALYSIS.md) - Financial assessment framework

## 👥 Target Users

- **Urban and Regional Planners** - Optimize infrastructure development
- **Energy Companies** - Identify strategic investment opportunities
- **Project Developers** - Evaluate potential production sites
- **Policy Analysts** - Assess regional hydrogen readiness

## 💼 Business Impact

- **Capital Efficiency** - Directs investments to high-impact, high-yield locations
- **Cost Optimization** - Minimizes redundant infrastructure development
- **Risk Reduction** - Identifies and quantifies location-specific risks
- **Sustainability** - Facilitates coordinated growth of green hydrogen networks
- **Data-Driven Decisions** - Replaces intuition with quantitative analysis

## 🔍 Project Metrics

- **Location Database**: 500+ analyzed sites across Gujarat
- **Data Points**: 15,000+ infrastructure elements mapped
- **Analysis Factors**: 25+ weighted criteria in algorithm
- **Performance**: Sub-second response time for location queries

## 🏆 Contributors

- Team Eagles @ DA-IICT
- Project Mentors: Faculty of DA-IICT

💡 **Built for Gujarat's Green Energy Future** 🌿
