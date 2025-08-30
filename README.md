# H₂-Optimize - Green Hydrogen Location Intelligence

🌱 **Platform for optimizing green hydrogen production facilities in Gujarat, India**

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** (Backend)
- **Node.js 18+** (Frontend) 
- **MongoDB** (Database)

#### Windows (PowerShell)
```powershell
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
```

#### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
PORT=3001 npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3001
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

## 🏗️ Architecture

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

## 📊 Features

- 🗺️ **Interactive Map Visualization** (✅ Fully Tested)
- 🏭 **Industrial Demand Analysis** (✅ Fully Tested)
- 💧 **Water Source Optimization** (✅ Fully Tested)
- ⛽ **Gas Pipeline Integration** (✅ Fully Tested)
- 🛣️ **Transportation Network Analysis** (✅ Fully Tested)
- 📈 **Location Scoring Algorithm** (✅ Fully Tested)
- 🎯 **Real Gujarat Infrastructure Data** (✅ Fully Tested)
- 🔍 **City Search Functionality** (⚠️ Autocomplete needs improvement)
- 🚀 **React 19 Performance Features** (✅ Fully Implemented)
- 📱 **Responsive Design** (✅ Professional Grade)

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
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=h2_optimize
```

**Frontend (.env)**  
```env
REACT_APP_BACKEND_URL=http://localhost:8080
WDS_SOCKET_PORT=0
```

## 📝 API Endpoints

- `GET /api/energy-sources` - Get renewable energy sources
- `GET /api/demand-centers` - Get industrial demand centers  
- `GET /api/water-sources` - Get water infrastructure
- `GET /api/optimal-locations` - Get optimized facility locations
- More endpoints available in API docs at `/docs`

## 🎯 Project Goals

Optimize green hydrogen production facility placement by analyzing:
- **Renewable energy availability** (solar/wind)
- **Industrial demand proximity** (refineries, ports, chemical plants)
- **Water resource accessibility** 
- **Transportation infrastructure**
- **Economic viability factors**

## Here is a live demo
  
https://github.com/user-attachments/assets/23253301-1e40-41c4-adbf-d7c1512f0c31


💡 **Built for Gujarat's Green Energy Future** 🌿
