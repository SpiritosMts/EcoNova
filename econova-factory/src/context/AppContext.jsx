import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, push, onValue, remove, get } from 'firebase/database';
import { 
  generateSensorData, 
  calculateDangerScore, 
  NODES,
  generateNodePredictions,
  generateAIInsights 
} from '../utils/fakeDataGenerator';
import { checkThresholds, DEFAULT_THRESHOLDS } from '../utils/thresholds';
import { notificationSound } from '../utils/notificationSound';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sensorData, setSensorData] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [predictions, setPredictions] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [selectedNode, setSelectedNode] = useState(NODES[0]); // Default to first node
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Initialize sensor data
  useEffect(() => {
    if (user) {
      const initialData = {};
      const initialHistory = {};
      
      NODES.forEach(nodeId => {
        const data = generateSensorData(nodeId);
        initialData[nodeId] = data;
        initialHistory[nodeId] = [data];
      });
      
      setSensorData(initialData);
      setHistoricalData(initialHistory);
      setAiInsights(generateAIInsights());
    }
  }, [user]);

  // Save data to Firebase and update locally
  const saveDataToFirebase = async (nodeId, data) => {
    if (!user || !db) return;
    
    try {
      const userEmail = user.email.replace(/\./g, '_'); // Firebase keys can't have periods
      const dataRef = ref(db, `users/${userEmail}/nodes/${nodeId}/current`);
      await set(dataRef, data);
      
      // Also save to history
      const historyRef = ref(db, `users/${userEmail}/nodes/${nodeId}/history`);
      await push(historyRef, data);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  // Simulate real-time data updates
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        const newData = {};
        
        NODES.forEach(nodeId => {
          const data = generateSensorData(nodeId, prev[nodeId]);
          newData[nodeId] = data;
          saveDataToFirebase(nodeId, data);
        });
        
        return newData;
      });
      
      // Update historical data (keep last 50 points)
      setHistoricalData(prev => {
        const newHistory = {};
        
        NODES.forEach(nodeId => {
          const history = prev[nodeId] || [];
          newHistory[nodeId] = [...history, sensorData[nodeId]].slice(-50);
        });
        
        return newHistory;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [user, sensorData]);

  // Check thresholds and generate alerts with sound
  useEffect(() => {
    if (!user || !sensorData) return;

    const newAlerts = [];
    
    NODES.forEach(nodeId => {
      if (sensorData[nodeId]) {
        const nodeAlerts = checkThresholds(sensorData[nodeId], thresholds);
        newAlerts.push(...nodeAlerts);
      }
    });
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20)); // Keep last 20 alerts
      
      // Play notification sound
      if (soundEnabled) {
        const hasCritical = newAlerts.some(alert => alert.severity === 'critical');
        notificationSound.playAlert(hasCritical ? 'critical' : 'warning');
      }
    }
  }, [sensorData, thresholds, user, soundEnabled]);

  // Update predictions periodically
  useEffect(() => {
    if (!user) return;

    const updatePredictions = () => {
      setPredictions(generateNodePredictions(sensorData));
    };

    updatePredictions();
    const interval = setInterval(updatePredictions, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [sensorData, user]);

  // Update AI insights periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      setAiInsights(generateAIInsights());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  // Calculate danger scores for map
  const dangerScores = Object.entries(sensorData).reduce((acc, [nodeId, data]) => {
    acc[nodeId] = calculateDangerScore(data, thresholds);
    return acc;
  }, {});

  // Delete all data for current user
  const deleteAllData = async () => {
    if (!user || !db) return;
    
    try {
      const userEmail = user.email.replace(/\./g, '_');
      const userRef = ref(db, `users/${userEmail}`);
      await remove(userRef);
      
      // Reset local state
      setSensorData({});
      setHistoricalData({});
      setAlerts([]);
    } catch (error) {
      console.error('Error deleting all data:', error);
      throw error;
    }
  };

  // Delete data for specific node
  const deleteNodeData = async (nodeId) => {
    if (!user || !db) return;
    
    try {
      const userEmail = user.email.replace(/\./g, '_');
      const nodeRef = ref(db, `users/${userEmail}/nodes/${nodeId}`);
      await remove(nodeRef);
      
      // Reset local state for this node
      setSensorData(prev => {
        const updated = { ...prev };
        delete updated[nodeId];
        return updated;
      });
      setHistoricalData(prev => {
        const updated = { ...prev };
        delete updated[nodeId];
        return updated;
      });
    } catch (error) {
      console.error(`Error deleting data for ${nodeId}:`, error);
      throw error;
    }
  };

  // Load history from Firebase
  const loadHistory = async (nodeId) => {
    if (!user || !db) return [];
    
    try {
      const userEmail = user.email.replace(/\./g, '_');
      const historyRef = ref(db, `users/${userEmail}/nodes/${nodeId}/history`);
      const snapshot = await get(historyRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
      }
      return [];
    } catch (error) {
      console.error(`Error loading history for ${nodeId}:`, error);
      return [];
    }
  };

  const value = {
    user,
    loading,
    darkMode,
    setDarkMode,
    sensorData,
    historicalData,
    alerts,
    clearAlerts: () => setAlerts([]),
    thresholds,
    updateThresholds: setThresholds,
    predictions,
    aiInsights,
    dangerScores,
    selectedNode,
    setSelectedNode,
    soundEnabled,
    setSoundEnabled,
    deleteAllData,
    deleteNodeData,
    loadHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
