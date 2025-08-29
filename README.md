# Hydrogen Plant Site Selection Tool 🏭⚡

A comprehensive MERN stack application for finding optimal hydrogen plant locations in Gujarat, India using advanced geospatial analysis and multi-criteria decision making.

## 🎯 Project Overview

This tool helps energy companies and planners identify the best locations for hydrogen plants by analyzing multiple factors:
- ✅ Proximity to green energy sources (solar/wind)
- 💧 Water resource availability
- 🏭 Industrial customers (hydrogen demand)
- 🛣️ Transportation infrastructure

## 🧮 Algorithm Explanation

### Multi-Criteria Decision Analysis (MCDA)

The application uses a sophisticated scoring algorithm that combines multiple factors:

```
Site Score = (0.3 × Green_Energy_Score) + 
             (0.25 × Water_Access_Score) + 
             (0.25 × Industry_Proximity_Score) + 
             (0.2 × Transportation_Score)
```

### Scoring Methodology

1. **Proximity Scoring**: Uses inverse distance weighting
   ```
   Proximity Score = (1 - distance/max_distance) × 100
   ```

2. **Capacity Bonus**: Logarithmic scaling for resource capacity
   ```
   Capacity Bonus = log₁₀(capacity + 1) × 5
   ```

3. **Golden Location Selection**: Top 10% of analyzed sites

### Key Features

- **Grid-based Analysis**: Systematic evaluation of candidate locations
- **Real-time Scoring**: Instant calculation of site viability
- **Resource Mapping**: Visual connections to nearest facilities
- **Export Capabilities**: CSV, JSON, and GeoJSON formats
- **Cost Estimation**: Infrastructure development projections

## 🏗️ Architecture

```
├── backend/                 # Node.js + Express + MongoDB
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── services/           # Core algorithm
│   └── scripts/            # Data seeding
├── frontend/               # React + Vite + Mapbox
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API integration
│   │   └── types/          # TypeScript definitions
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Mapbox API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Mapbox token
npm run seed     # Load sample data
npm run dev      # Start development server
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with VITE_MAPBOX_ACCESS_TOKEN
npm run dev      # Start development server
```

## 📊 Sample Data

The application includes sample data for Gujarat:

- **5 Green Energy Sources**: Solar parks and wind farms
- **5 Water Bodies**: Rivers, reservoirs, and canals  
- **5 Industries**: Refineries, chemical plants, steel mills
- **5 Transportation Hubs**: Highways, railways, ports

## 🔧 API Endpoints

### Sites Analysis
- `POST /api/sites/analyze` - Analyze region for optimal sites
- `GET /api/sites/:region` - Get optimal sites for region
- `GET /api/sites/details/:siteId` - Get detailed site analysis
- `GET /api/sites/export` - Export site data

### Resources
- `GET /api/resources/green-energy` - Green energy sources
- `GET /api/resources/water-bodies` - Water resources
- `GET /api/resources/industries` - Industrial facilities
- `GET /api/resources/transportation` - Transport infrastructure

## 🎮 How to Use

1. **Search**: Enter a Gujarat district (e.g., "Ahmedabad")
2. **Analyze**: System automatically identifies golden locations
3. **Explore**: Click on star markers for detailed analysis
4. **Export**: Download results in your preferred format

## 🌟 Key Components

### Backend
- **SiteAnalysisService**: Core MCDA algorithm implementation
- **Resource Models**: MongoDB schemas for all data types
- **RESTful API**: Comprehensive endpoints for all operations

### Frontend
- **MapView**: Interactive Mapbox GL JS integration
- **SearchBar**: Intelligent district search with suggestions
- **SiteDetailsPanel**: Comprehensive site analysis display
- **ResourcesPanel**: Regional resource overview

## 📈 Performance Features

- **Geospatial Indexing**: 2dsphere indexes for fast proximity queries
- **Grid-based Analysis**: Efficient candidate site generation
- **Caching**: Optimized data retrieval and storage
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with geospatial capabilities
- **Mongoose** - ODM for MongoDB
- **Turf.js** - Geospatial analysis
- **Joi** - Data validation

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Mapbox GL JS** - Interactive maps
- **Tailwind CSS** - Styling
- **Axios** - API client

## 🗂️ Database Schema

### Collections
1. **greenEnergies** - Solar and wind installations
2. **waterBodies** - Rivers, reservoirs, canals
3. **industries** - Manufacturing facilities
4. **transportation** - Roads, railways, ports
5. **optimalSites** - Calculated optimal locations

## 🎯 Future Enhancements

- [ ] Machine learning model integration
- [ ] Real-time environmental data
- [ ] 3D terrain analysis
- [ ] Multi-state expansion
- [ ] Advanced cost modeling
- [ ] Regulatory compliance checker

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Gujarat Energy Department for data insights
- Mapbox for mapping platform
- MongoDB for geospatial capabilities
- The open-source community

---

**Made with ❤️ for sustainable energy planning in Gujarat**
