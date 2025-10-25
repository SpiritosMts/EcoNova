// Fake data generator for sensor nodes

export const NODES = ['Node_A', 'Node_B', 'Node_C', 'Node_D'];

/**
 * Generate random sensor data for a single node
 */
export function generateSensorData(nodeId, previousData = null) {
  // If we have previous data, drift slightly from it for smooth transitions
  const basePh = previousData?.pH || 7.0;
  const baseTurbidity = previousData?.turbidity || 75;
  const baseFlow = previousData?.flow || 100;
  const baseTemp = previousData?.temperature || 25;

  return {
    node_id: nodeId,
    pH: Math.max(4, Math.min(10, basePh + (Math.random() - 0.5) * 0.5)),
    turbidity: Math.max(0, Math.min(200, baseTurbidity + (Math.random() - 0.5) * 15)),
    flow: Math.max(0, Math.min(200, baseFlow + (Math.random() - 0.5) * 10)),
    temperature: Math.max(15, Math.min(40, baseTemp + (Math.random() - 0.5) * 2)),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calculate danger score based on sensor values
 */
export function calculateDangerScore(sensorData, thresholds) {
  let score = 0;
  
  // pH danger
  if (sensorData.pH < thresholds.pH.min || sensorData.pH > thresholds.pH.max) {
    score += 30;
  } else if (sensorData.pH < 6 || sensorData.pH > 8.5) {
    score += 15;
  }
  
  // Turbidity danger
  if (sensorData.turbidity > thresholds.turbidity.max) {
    score += 25;
  } else if (sensorData.turbidity > 100) {
    score += 10;
  }
  
  // Flow danger
  if (sensorData.flow < thresholds.flow.min) {
    score += 25;
  } else if (sensorData.flow < 70) {
    score += 10;
  }
  
  // Temperature danger
  if (sensorData.temperature > thresholds.temperature.max) {
    score += 20;
  } else if (sensorData.temperature > 32) {
    score += 10;
  }
  
  return Math.min(100, score);
}

/**
 * Generate fake AI prediction (just random drift)
 */
export function generatePrediction(currentValue, hoursAhead) {
  const drift = (Math.random() - 0.5) * 0.2 * hoursAhead;
  return currentValue + drift;
}

/**
 * Generate all node predictions
 */
export function generateNodePredictions(currentData) {
  return NODES.map(nodeId => {
    const current = currentData[nodeId] || generateSensorData(nodeId);
    
    return {
      nodeId,
      predictions: {
        pH: {
          current: current.pH,
          pred1h: generatePrediction(current.pH, 1),
          pred6h: generatePrediction(current.pH, 6),
        },
        turbidity: {
          current: current.turbidity,
          pred1h: generatePrediction(current.turbidity, 1),
          pred6h: generatePrediction(current.turbidity, 6),
        },
        flow: {
          current: current.flow,
          pred1h: generatePrediction(current.flow, 1),
          pred6h: generatePrediction(current.flow, 6),
        },
        temperature: {
          current: current.temperature,
          pred1h: generatePrediction(current.temperature, 1),
          pred6h: generatePrediction(current.temperature, 6),
        },
      },
    };
  });
}

/**
 * Generate fake AI insights
 */
export function generateAIInsights() {
  const insights = [
    'AI predicts 72% chance of high turbidity in next 2 hours',
    'pH levels trending downward across all nodes',
    'Flow rate stability expected for next 6 hours',
    'Temperature spike detected - monitoring recommended',
    'All parameters within normal range',
    'Unusual turbidity pattern detected in Node B',
    'Predictive maintenance suggested for Node A',
    'Water quality improving across factory',
  ];
  
  return insights
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

/**
 * Generate fake map coordinates for nodes (around Gabès, Tunisia)
 */
export function getNodeCoordinates(nodeId) {
  const baseCoords = { lat: 33.8815, lng: 10.0982 }; // Gabès, Tunisia
  
  const offsets = {
    Node_A: { lat: 0.02, lng: 0.01 },
    Node_B: { lat: -0.01, lng: 0.03 },
    Node_C: { lat: 0.01, lng: -0.02 },
    Node_D: { lat: -0.02, lng: -0.01 },
  };
  
  const offset = offsets[nodeId] || { lat: 0, lng: 0 };
  
  return {
    lat: baseCoords.lat + offset.lat,
    lng: baseCoords.lng + offset.lng,
  };
}
