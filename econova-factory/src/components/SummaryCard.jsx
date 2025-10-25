import React from 'react';
import { motion } from 'framer-motion';

export default function SummaryCard({ title, value, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
