// Pollution zones data generator

export const POLLUTION_ZONES = [
  {
    id: 'zone_1',
    name: 'Industrial District North',
    level: 'critical', // red
    center: { lat: 33.8950, lng: 10.1100 },
    pollution: 85,
    trend: 'increasing',
  },
  {
    id: 'zone_2',
    name: 'Coastal Area East',
    level: 'warning', // orange
    center: { lat: 33.8750, lng: 10.1250 },
    pollution: 55,
    trend: 'stable',
  },
  {
    id: 'zone_3',
    name: 'Residential Zone West',
    level: 'moderate', // yellow
    center: { lat: 33.8900, lng: 10.0800 },
    pollution: 35,
    trend: 'decreasing',
  },
  {
    id: 'zone_4',
    name: 'Factory Complex South',
    level: 'critical', // red
    center: { lat: 33.8680, lng: 10.0950 },
    pollution: 92,
    trend: 'increasing',
  },
  {
    id: 'zone_5',
    name: 'Agricultural Area',
    level: 'moderate', // yellow
    center: { lat: 33.9050, lng: 10.0950 },
    pollution: 28,
    trend: 'stable',
  },
  {
    id: 'zone_6',
    name: 'Port District',
    level: 'warning', // orange
    center: { lat: 33.8820, lng: 10.1350 },
    pollution: 68,
    trend: 'increasing',
  },
  {
    id: 'zone_7',
    name: 'Downtown Area',
    level: 'warning', // orange
    center: { lat: 33.8815, lng: 10.0982 },
    pollution: 47,
    trend: 'stable',
  },
  {
    id: 'zone_8',
    name: 'Chemical Plant Zone',
    level: 'critical', // red
    center: { lat: 33.8580, lng: 10.1050 },
    pollution: 78,
    trend: 'increasing',
  },
  {
    id: 'zone_9',
    name: 'University District',
    level: 'moderate', // yellow
    center: { lat: 33.9000, lng: 10.1050 },
    pollution: 22,
    trend: 'decreasing',
  },
  {
    id: 'zone_10',
    name: 'Market Area',
    level: 'warning', // orange
    center: { lat: 33.8700, lng: 10.0850 },
    pollution: 51,
    trend: 'stable',
  },
];

// Generate polygon coordinates around center point
export const generatePolygonPath = (center, size = 0.025) => {
  const points = 8; // octagon for more visible shape
  const path = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const lat = center.lat + size * Math.cos(angle);
    const lng = center.lng + size * Math.sin(angle);
    path.push({ lat, lng });
  }
  
  return path;
};

// Get color based on pollution level
export const getPollutionColor = (level) => {
  switch (level) {
    case 'critical':
      return {
        fill: '#FC5A5A',
        stroke: '#DC2626',
        label: 'Critical',
      };
    case 'warning':
      return {
        fill: '#FFC542',
        stroke: '#F59E0B',
        label: 'Warning',
      };
    case 'moderate':
      return {
        fill: '#FDE047',
        stroke: '#EAB308',
        label: 'Moderate',
      };
    default:
      return {
        fill: '#3DD598',
        stroke: '#10B981',
        label: 'Safe',
      };
  }
};

// Generate historical pollution data for a zone
export const generateZonePollutionHistory = (baseLevel) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 20; i >= 0; i--) {
    const timestamp = now - i * 600000; // 10 minutes intervals
    const variance = Math.random() * 10 - 5;
    data.push({
      timestamp,
      pollution: Math.max(0, Math.min(100, baseLevel + variance)),
    });
  }
  
  return data;
};

// Generate future predictions
export const generateZonePredictions = (currentLevel, trend) => {
  let pred1h = currentLevel;
  let pred6h = currentLevel;
  
  if (trend === 'increasing') {
    pred1h = Math.min(100, currentLevel + Math.random() * 8 + 2);
    pred6h = Math.min(100, currentLevel + Math.random() * 20 + 10);
  } else if (trend === 'decreasing') {
    pred1h = Math.max(0, currentLevel - Math.random() * 5 - 2);
    pred6h = Math.max(0, currentLevel - Math.random() * 15 - 5);
  } else {
    pred1h = currentLevel + (Math.random() * 4 - 2);
    pred6h = currentLevel + (Math.random() * 8 - 4);
  }
  
  return {
    current: currentLevel,
    pred1h: pred1h,
    pred6h: pred6h,
  };
};
