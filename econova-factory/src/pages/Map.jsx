import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Sun, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  POLLUTION_ZONES,
  generatePolygonPath,
  getPollutionColor,
  generateZonePollutionHistory,
  generateZonePredictions,
} from '../utils/pollutionZones';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 33.8815,
  lng: 10.0982,
};

const libraries = ['drawing', 'geometry'];

export default function Map() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneData, setZoneData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [map, setMap] = useState(null);
  const [circles, setCircles] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAjiqioJHrrVKcC2BXqs65lbWdJSU7U5tA',
    libraries: libraries,
  });

  // Fit map to show all zones
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
    
    // Create circles and markers using native Google Maps API
    const newCircles = [];
    POLLUTION_ZONES.forEach((zone) => {
      const colorScheme = getPollutionColor(zone.level);
      
      // Create circle
      const circle = new window.google.maps.Circle({
        strokeColor: colorScheme.stroke,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colorScheme.fill,
        fillOpacity: 0.35,
        map: mapInstance,
        center: zone.center,
        radius: 500,
        clickable: true,
        zIndex: 1000,
      });
      
      // Create a marker at the center of the zone
      const marker = new window.google.maps.Marker({
        position: zone.center,
        map: mapInstance,
        title: zone.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: colorScheme.stroke,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
      });
      
      circle.addListener('click', () => {
        setSelectedZone(zone);
      });
      
      marker.addListener('click', () => {
        setSelectedZone(zone);
      });
      
      newCircles.push(circle);
    });
    
    setCircles(newCircles);
  };

  // Generate data for all zones
  useEffect(() => {
    const data = {};
    POLLUTION_ZONES.forEach((zone) => {
      data[zone.id] = {
        history: generateZonePollutionHistory(zone.pollution),
        predictions: generateZonePredictions(zone.pollution, zone.trend),
      };
    });
    setZoneData(data);
  }, []);

  // Cleanup circles on unmount
  useEffect(() => {
    return () => {
      circles.forEach(circle => {
        circle.setMap(null);
      });
    };
  }, [circles]);

  if (loadError) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <p className="text-danger mb-4">Error loading Google Maps</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Please add your Google Maps API key to the .env file
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safe mx-auto"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Loading map...</p>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-danger" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-safe" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  // Dark mode map styles
  const darkMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Header with Dark Mode Toggle */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Pollution Map
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time pollution levels across different areas
          </p>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          Pollution Levels
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FDE047' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Moderate (0-40)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFC542' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Warning (40-70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FC5A5A' }}></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Critical (70-100)</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          onLoad={onMapLoad}
          options={{
            mapTypeId: 'roadmap',
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            styles: isDarkMode ? darkMapStyles : [],
            zoomControl: true,
            clickableIcons: false,
          }}
        >
          {/* Circles are now created via native Google Maps API in onMapLoad */}
        </GoogleMap>
      </motion.div>

      {/* Selected Zone Details Panel */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-screen w-full md:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedZone.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      backgroundColor: getPollutionColor(selectedZone.level).stroke,
                    }}
                  >
                    {getPollutionColor(selectedZone.level).label}
                  </span>
                  <div className="flex items-center space-x-1 text-white text-sm">
                    {getTrendIcon(selectedZone.trend)}
                    <span className="capitalize">{selectedZone.trend}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Pollution Level */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Current Pollution Level
                </h3>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 text-center">
                  <div className="text-5xl font-bold mb-2" style={{
                    color: getPollutionColor(selectedZone.level).stroke,
                  }}>
                    {selectedZone.pollution}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Pollution Index
                  </div>
                </div>
              </div>

              {/* Historical Chart */}
              {zoneData[selectedZone.id] && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Pollution History (Last 3.5 hours)
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={zoneData[selectedZone.id].history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.3} />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(ts) => new Date(ts).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis stroke="#64748b" domain={[0, 100]} style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                          labelFormatter={(ts) => new Date(ts).toLocaleTimeString()}
                          formatter={(value) => [`${value.toFixed(1)}%`, 'Pollution']}
                        />
                        <Line
                          type="monotone"
                          dataKey="pollution"
                          stroke={getPollutionColor(selectedZone.level).stroke}
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Predictions */}
              {zoneData[selectedZone.id] && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Pollution Forecast
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { time: 'Now', value: zoneData[selectedZone.id].predictions.current },
                        { time: '1 hour', value: zoneData[selectedZone.id].predictions.pred1h },
                        { time: '6 hours', value: zoneData[selectedZone.id].predictions.pred6h },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.3} />
                        <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#64748b" domain={[0, 100]} style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                          formatter={(value) => [`${value.toFixed(1)}%`, 'Predicted Pollution']}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={getPollutionColor(selectedZone.level).stroke}
                          strokeWidth={3}
                          dot={{ fill: getPollutionColor(selectedZone.level).stroke, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Prediction Values */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {zoneData[selectedZone.id].predictions.current.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Current</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {zoneData[selectedZone.id].predictions.pred1h.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">In 1 Hour</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {zoneData[selectedZone.id].predictions.pred6h.toFixed(0)}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">In 6 Hours</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Zone Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Zone Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">Zone ID</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedZone.id.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">Coordinates</span>
                    <span className="font-mono text-sm text-slate-900 dark:text-white">
                      {selectedZone.center.lat.toFixed(4)}, {selectedZone.center.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-slate-600 dark:text-slate-300">Trend</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(selectedZone.trend)}
                      <span className="font-semibold text-slate-900 dark:text-white capitalize">
                        {selectedZone.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                  ⚠️ Safety Recommendations
                </h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                  {selectedZone.level === 'critical' && (
                    <>
                      <li>Avoid outdoor activities in this area</li>
                      <li>Use protective equipment if entry is necessary</li>
                      <li>Monitor health symptoms closely</li>
                    </>
                  )}
                  {selectedZone.level === 'warning' && (
                    <>
                      <li>Limit time spent outdoors</li>
                      <li>Consider wearing protective mask</li>
                      <li>Monitor air quality updates</li>
                    </>
                  )}
                  {selectedZone.level === 'moderate' && (
                    <>
                      <li>Safe for most outdoor activities</li>
                      <li>Sensitive individuals should take precautions</li>
                      <li>Regular monitoring recommended</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
