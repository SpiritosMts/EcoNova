import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Droplets, Thermometer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import ChartCard from '../components/ChartCard';
import { NODES } from '../utils/fakeDataGenerator';

export default function Home() {
  const { sensorData, historicalData, alerts, aiInsights, selectedNode, setSelectedNode } = useApp();

  // Calculate averages
  const calculateAverage = (key) => {
    const values = NODES.map(nodeId => sensorData[nodeId]?.[key] || 0);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  };

  const avgPh = calculateAverage('pH');
  const avgTurbidity = calculateAverage('turbidity');
  const avgFlow = calculateAverage('flow');
  const avgTemp = calculateAverage('temperature');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Real-time environmental monitoring
        </p>
      </div>

      {/* Node Selection Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {NODES.map((nodeId) => (
            <button
              key={nodeId}
              onClick={() => setSelectedNode(nodeId)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedNode === nodeId
                  ? 'bg-safe text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {nodeId}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Nodes"
          value={NODES.length}
          icon={Activity}
          color="bg-blue-500"
          delay={0}
        />
        <SummaryCard
          title="Active Alerts"
          value={alerts.length}
          icon={AlertTriangle}
          color="bg-danger"
          delay={0.1}
        />
        <SummaryCard
          title="Avg pH"
          value={avgPh}
          icon={Droplets}
          color="bg-safe"
          delay={0.2}
        />
        <SummaryCard
          title="Avg Temp"
          value={`${avgTemp}°C`}
          icon={Thermometer}
          color="bg-warning"
          delay={0.3}
        />
      </div>

      {/* Charts Grid for Selected Node */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="pH Level"
          data={historicalData[selectedNode] || []}
          dataKey="pH"
          color="#3DD598"
        />
        <ChartCard
          title="Turbidity"
          data={historicalData[selectedNode] || []}
          dataKey="turbidity"
          color="#FFC542"
          unit=" NTU"
        />
        <ChartCard
          title="Flow Rate"
          data={historicalData[selectedNode] || []}
          dataKey="flow"
          color="#60A5FA"
          unit=" L/min"
        />
        <ChartCard
          title="Temperature"
          data={historicalData[selectedNode] || []}
          dataKey="temperature"
          color="#FC5A5A"
          unit="°C"
        />
      </div>

      {/* AI Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🧠</span> AI Insights
        </h3>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <p className="text-sm">{insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
