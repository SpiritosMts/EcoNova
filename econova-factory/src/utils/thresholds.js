// Default threshold values for sensor alerts

export const DEFAULT_THRESHOLDS = {
  pH: {
    min: 5.5,
    max: 9.0,
  },
  turbidity: {
    max: 100,
  },
  flow: {
    min: 50,
  },
  temperature: {
    max: 35,
  },
};

/**
 * Check if sensor data exceeds thresholds
 */
export function checkThresholds(sensorData, thresholds = DEFAULT_THRESHOLDS) {
  const alerts = [];
  
  // Check pH
  if (sensorData.pH < thresholds.pH.min) {
    alerts.push({
      id: `${sensorData.node_id}-ph-low-${Date.now()}`,
      nodeId: sensorData.node_id,
      parameter: 'pH',
      severity: 'critical',
      message: `pH too low: ${sensorData.pH.toFixed(2)} (min: ${thresholds.pH.min})`,
      timestamp: sensorData.timestamp,
    });
  } else if (sensorData.pH > thresholds.pH.max) {
    alerts.push({
      id: `${sensorData.node_id}-ph-high-${Date.now()}`,
      nodeId: sensorData.node_id,
      parameter: 'pH',
      severity: 'critical',
      message: `pH too high: ${sensorData.pH.toFixed(2)} (max: ${thresholds.pH.max})`,
      timestamp: sensorData.timestamp,
    });
  }
  
  // Check turbidity
  if (sensorData.turbidity > thresholds.turbidity.max) {
    alerts.push({
      id: `${sensorData.node_id}-turbidity-${Date.now()}`,
      nodeId: sensorData.node_id,
      parameter: 'Turbidity',
      severity: 'warning',
      message: `High turbidity: ${sensorData.turbidity.toFixed(0)} NTU (max: ${thresholds.turbidity.max})`,
      timestamp: sensorData.timestamp,
    });
  }
  
  // Check flow
  if (sensorData.flow < thresholds.flow.min) {
    alerts.push({
      id: `${sensorData.node_id}-flow-${Date.now()}`,
      nodeId: sensorData.node_id,
      parameter: 'Flow',
      severity: 'warning',
      message: `Low flow rate: ${sensorData.flow.toFixed(0)} L/min (min: ${thresholds.flow.min})`,
      timestamp: sensorData.timestamp,
    });
  }
  
  // Check temperature
  if (sensorData.temperature > thresholds.temperature.max) {
    alerts.push({
      id: `${sensorData.node_id}-temp-${Date.now()}`,
      nodeId: sensorData.node_id,
      parameter: 'Temperature',
      severity: 'warning',
      message: `High temperature: ${sensorData.temperature.toFixed(1)}°C (max: ${thresholds.temperature.max})`,
      timestamp: sensorData.timestamp,
    });
  }
  
  return alerts;
}

/**
 * Get severity color
 */
export function getSeverityColor(severity) {
  switch (severity) {
    case 'critical':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    default:
      return 'text-safe';
  }
}

/**
 * Get danger zone color based on score
 */
export function getDangerColor(score) {
  if (score < 30) return '#3DD598'; // safe green
  if (score < 60) return '#FFC542'; // warning orange
  return '#FC5A5A'; // danger red
}
