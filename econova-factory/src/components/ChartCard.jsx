import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function ChartCard({ title, data, dataKey, color, unit }) {
  // Format data for chart
  const chartData = data.map((item) => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    value: item[dataKey],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b" 
            style={{ fontSize: '12px' }}
            unit={unit}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => [`${value.toFixed(2)}${unit || ''}`, title]}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
