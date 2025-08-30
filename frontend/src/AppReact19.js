import React, { useState, startTransition, useDeferredValue, Suspense } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import SearchComponent from './components/SearchComponent';
import SearchComponentReact19 from './components/SearchComponentReact19';
import LocationDetails from './components/LocationDetails';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { 
  Layers, Info, Star, Zap, Factory, Droplets, 
  Sparkles, Settings, ChevronRight 
} from 'lucide-react';

// React 19: Error Boundary Component
class React19ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React 19 Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">React 19 Error Boundary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Something went wrong with the React 19 enhanced features.
              </p>
              <Button onClick={() => window.location.reload()}>
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// React 19: Enhanced Loading Component
const React19LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3 text-blue-600">
      <Sparkles className="w-5 h-5 animate-pulse" />
      <span className="text-sm font-medium">Loading React 19 Enhanced Component...</span>
    </div>
  </div>
);

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [useReact19Features, setUseReact19Features] = useState(true);
  const [isPending, setIsPending] = useState(false);

  // React 19: Deferred value for better performance
  const deferredSearchLocation = useDeferredValue(searchLocation);

  const handleLocationSelect = (location) => {
    startTransition(() => {
      setIsPending(true);
      setSearchLocation(location);
      setTimeout(() => setIsPending(false), 100);
    });
  };

  const handleOptimalLocationSelect = (location) => {
    startTransition(() => {
      setSelectedLocation(location);
    });
  };

  const clearSearch = () => {
    startTransition(() => {
      setSearchLocation(null);
      setSelectedLocation(null);
      setIsPending(false);
    });
  };

  const toggleReact19Features = () => {
    startTransition(() => {
      setUseReact19Features(!useReact19Features);
    });
  };

  return (
    <React19ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
        {/* React 19 Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      H₂-Optimize
                    </h1>
                    <p className="text-sm text-gray-600">
                      Green Hydrogen Location Intelligence
                    </p>
                  </div>
                </div>

                {/* React 19 Feature Toggle */}
                <div className="flex items-center gap-3 ml-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <Label htmlFor="react19-toggle" className="text-sm font-medium text-blue-800">
                    React 19 Enhanced
                  </Label>
                  <Switch
                    id="react19-toggle"
                    checked={useReact19Features}
                    onCheckedChange={toggleReact19Features}
                  />
                  <Badge variant={useReact19Features ? "default" : "secondary"} className="text-xs">
                    {useReact19Features ? "Active" : "Classic"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Performance Indicator */}
                {isPending && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>React 19 Transition</span>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className="flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  About
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* React 19 Info Panel */}
        {showInfo && (
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    React 19 Enhanced Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <code>useDeferredValue</code> for better search performance
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <code>startTransition</code> for non-blocking updates
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Enhanced concurrent features
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Improved error boundaries
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Factory className="w-5 h-5" />
                    Application Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Interactive Gujarat infrastructure map
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      AI-powered location optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Real-time data analysis
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Search Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Location Search
                    {useReact19Features && (
                      <Badge variant="secondary" className="text-xs">
                        React 19
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<React19LoadingFallback />}>
                    {useReact19Features ? (
                      <SearchComponentReact19
                        onLocationSelect={handleLocationSelect}
                        onClear={clearSearch}
                      />
                    ) : (
                      <SearchComponent
                        onLocationSelect={handleLocationSelect}
                        onClear={clearSearch}
                      />
                    )}
                  </Suspense>
                </CardContent>
              </Card>

              {/* Location Details */}
              {(selectedLocation || deferredSearchLocation) && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LocationDetails
                      location={selectedLocation || deferredSearchLocation}
                      isOptimal={!!selectedLocation}
                    />
                  </CardContent>
                </Card>
              )}

              {/* React 19 Performance Metrics */}
              {useReact19Features && (
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Settings className="w-4 h-4 text-blue-600" />
                      React 19 Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Deferred Updates:</span>
                      <Badge variant={deferredSearchLocation !== searchLocation ? "default" : "secondary"} className="text-xs">
                        {deferredSearchLocation !== searchLocation ? "Active" : "Synced"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Concurrent Mode:</span>
                      <Badge variant="default" className="text-xs">Enabled</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Transitions:</span>
                      <Badge variant={isPending ? "default" : "secondary"} className="text-xs">
                        {isPending ? "Pending" : "Idle"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map Panel */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      Gujarat Infrastructure Map
                    </div>
                    <div className="flex items-center gap-2">
                      {useReact19Features && (
                        <Badge variant="outline" className="text-xs">
                          React 19 Enhanced
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        Live Data
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <MapComponent
                    searchLocation={deferredSearchLocation}
                    onOptimalLocationSelect={handleOptimalLocationSelect}
                    selectedLocation={selectedLocation}
                    react19Enhanced={useReact19Features}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* React 19 Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>© 2025 H₂-Optimize</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Built with React 19</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Enhanced with Modern React Features</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </React19ErrorBoundary>
  );
}

export default App;
