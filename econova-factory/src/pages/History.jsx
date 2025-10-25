import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NODES } from '../utils/fakeDataGenerator';
import ChartCard from '../components/ChartCard';
import { format } from 'date-fns';

export default function History() {
  const { selectedNode, setSelectedNode, loadHistory } = useApp();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load history when node changes
  useEffect(() => {
    loadHistoryData();
  }, [selectedNode]);

  const loadHistoryData = async () => {
    setLoading(true);
    try {
      const data = await loadHistory(selectedNode);
      setHistoryData(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            History Data
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            View historical sensor readings from Firebase
          </p>
        </div>
        <button
          onClick={loadHistoryData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-safe text-white rounded-lg hover:bg-safe/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Node Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-2">
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

      {/* Data Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Data Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Records</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {historyData.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Node</p>
            <p className="text-2xl font-bold text-safe">{selectedNode}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Oldest Record</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {historyData.length > 0
                ? format(new Date(historyData[0].timestamp), 'MMM dd, HH:mm')
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Latest Record</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {historyData.length > 0
                ? format(
                    new Date(historyData[historyData.length - 1].timestamp),
                    'MMM dd, HH:mm'
                  )
                : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Historical Charts */}
      {historyData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="pH History"
            data={historyData}
            dataKey="pH"
            color="#3DD598"
          />
          <ChartCard
            title="Turbidity History"
            data={historyData}
            dataKey="turbidity"
            color="#FFC542"
            unit=" NTU"
          />
          <ChartCard
            title="Flow Rate History"
            data={historyData}
            dataKey="flow"
            color="#60A5FA"
            unit=" L/min"
          />
          <ChartCard
            title="Temperature History"
            data={historyData}
            dataKey="temperature"
            color="#FC5A5A"
            unit="°C"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center"
        >
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {loading ? 'Loading history...' : 'No historical data available for this node'}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            Data will appear here as it's saved to Firebase
          </p>
        </motion.div>
      )}

      {/* Data Table */}
      {historyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Readings
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Timestamp
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    pH
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Turbidity
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Flow
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Temperature
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyData.slice(-20).reverse().map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300">
                      {format(new Date(record.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-900 dark:text-white font-medium">
                      {record.pH.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-900 dark:text-white font-medium">
                      {record.turbidity.toFixed(0)} NTU
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-900 dark:text-white font-medium">
                      {record.flow.toFixed(0)} L/min
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-900 dark:text-white font-medium">
                      {record.temperature.toFixed(1)}°C
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
