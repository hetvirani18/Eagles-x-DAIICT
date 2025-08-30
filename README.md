# H₂-Optimize - Green Hydrogen Location Intelligence

🌱 **AI-powered platform for optimizing green hydrogen production facilities in Gujarat, India**

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** (Backend)
- **Node.js 18+** (Frontend) 
- **MongoDB** (Database)

### Option 1: Using Startup Scripts (Recommended)

#### Windows (PowerShell)
```powershell
# Start Backend
.\start-backend.ps1

# Start Frontend (in another terminal)
.\start-frontend.ps1
```

#### Linux/Mac (Bash)
```bash
# Make scripts executable
chmod +x start-backend.sh start-frontend.sh

# Start Backend
./start-backend.sh

# Start Frontend (in another terminal)  
./start-frontend.sh
```

### Option 2: Manual Setup

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

## 🔧 Recent Updates (v2.0)

### ✅ Modernized Backend
- **Updated FastAPI to v0.116.1** (latest stable)
- **Replaced deprecated `@app.on_event()`** with modern `lifespan` context manager
- **Updated all dependencies** to latest stable versions
- **Added uvicorn[standard]** with enhanced performance features
- **Improved startup/shutdown lifecycle management**

### 🔄 Dependency Updates
- **FastAPI**: 0.110.1 → 0.116.1
- **Uvicorn**: 0.25.0 → 0.35.0 (with standard extras)
- **PyMongo**: 4.5.0 → 4.14.1
- **Motor**: 3.3.1 → 3.7.1
- **Pydantic**: Updated to 2.9.0+
- **All other dependencies** updated to latest stable versions

### 🚫 Eliminated Deprecation Warnings
- ✅ No more `on_event` deprecation warnings
- ✅ Modern async context managers
- ✅ Future-proof codebase

## 🏗️ Architecture

### Backend (FastAPI)
- **Modern Python 3.13** async/await patterns
- **MongoDB** with Motor async driver
- **Pydantic v2** for data validation
- **CORS enabled** for frontend integration
- **Auto-generated OpenAPI docs**

### Frontend (React)
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Component-based architecture**

## 📊 Features

- 🗺️ **Interactive Map Visualization**
- 🏭 **Industrial Demand Analysis** 
- 💧 **Water Source Optimization**
- ⛽ **Gas Pipeline Integration**
- 🛣️ **Transportation Network Analysis**
- 📈 **Location Scoring Algorithm**
- 🎯 **Real Gujarat Infrastructure Data**

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

## 📄 License

MIT License - See LICENSE file for details

---

💡 **Built for Gujarat's Green Energy Future** 🌿
