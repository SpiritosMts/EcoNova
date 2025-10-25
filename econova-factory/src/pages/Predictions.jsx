import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { NODES } from '../utils/fakeDataGenerator';

export default function Predictions() {
  const { predictions, selectedNode, setSelectedNode } = useApp();

  const getTrendIcon = (current, predicted) => {
    const diff = predicted - current;
    if (Math.abs(diff) < 0.1) return <Minus className="w-4 h-4 text-slate-400" />;
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-danger" />;
    return <TrendingDown className="w-4 h-4 text-safe" />;
  };

  const formatValue = (value, decimals = 2) => {
    return typeof value === 'number' ? value.toFixed(decimals) : '---';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          AI Predictions
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Forecasted sensor values for the next 6 hours
        </p>
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

      {/* Predictions for Selected Node */}
      {predictions.filter(p => p.nodeId === selectedNode).map((nodePrediction, index) => (
        <motion.div
          key={nodePrediction.nodeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
        >

          {/* Prediction Charts */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Prediction Charts</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* pH Chart */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">pH Prediction</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { time: 'Now', value: nodePrediction.predictions.pH.current },
                    { time: '1h', value: nodePrediction.predictions.pH.pred1h },
                    { time: '6h', value: nodePrediction.predictions.pH.pred6h },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#3DD598" strokeWidth={2} dot={{ fill: '#3DD598', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Turbidity Chart */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Turbidity Prediction</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { time: 'Now', value: nodePrediction.predictions.turbidity.current },
                    { time: '1h', value: nodePrediction.predictions.turbidity.pred1h },
                    { time: '6h', value: nodePrediction.predictions.turbidity.pred6h },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#FFC542" strokeWidth={2} dot={{ fill: '#FFC542', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Flow Chart */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Flow Rate Prediction</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { time: 'Now', value: nodePrediction.predictions.flow.current },
                    { time: '1h', value: nodePrediction.predictions.flow.pred1h },
                    { time: '6h', value: nodePrediction.predictions.flow.pred6h },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Temperature Chart */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Temperature Prediction</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { time: 'Now', value: nodePrediction.predictions.temperature.current },
                    { time: '1h', value: nodePrediction.predictions.temperature.pred1h },
                    { time: '6h', value: nodePrediction.predictions.temperature.pred6h },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#FC5A5A" strokeWidth={2} dot={{ fill: '#FC5A5A', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Prediction Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Parameter
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Current
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Predicted (1h)
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Predicted (6h)
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* pH */}
                  <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-white">
                      pH
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.pH.current)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.pH.pred1h)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.pH.pred6h)}
                    </td>
                    <td className="py-3 px-4 flex justify-center">
                      {getTrendIcon(
                        nodePrediction.predictions.pH.current,
                        nodePrediction.predictions.pH.pred6h
                      )}
                    </td>
                  </tr>

                  {/* Turbidity */}
                  <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-white">
                      Turbidity (NTU)
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.turbidity.current, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.turbidity.pred1h, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.turbidity.pred6h, 0)}
                    </td>
                    <td className="py-3 px-4 flex justify-center">
                      {getTrendIcon(
                        nodePrediction.predictions.turbidity.current,
                        nodePrediction.predictions.turbidity.pred6h
                      )}
                    </td>
                  </tr>

                  {/* Flow */}
                  <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-white">
                      Flow (L/min)
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.flow.current, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.flow.pred1h, 0)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.flow.pred6h, 0)}
                    </td>
                    <td className="py-3 px-4 flex justify-center">
                      {getTrendIcon(
                        nodePrediction.predictions.flow.current,
                        nodePrediction.predictions.flow.pred6h
                      )}
                    </td>
                  </tr>

                  {/* Temperature */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-white">
                      Temperature (°C)
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.temperature.current, 1)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.temperature.pred1h, 1)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-300">
                      {formatValue(nodePrediction.predictions.temperature.pred6h, 1)}
                    </td>
                    <td className="py-3 px-4 flex justify-center">
                      {getTrendIcon(
                        nodePrediction.predictions.temperature.current,
                        nodePrediction.predictions.temperature.pred6h
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
