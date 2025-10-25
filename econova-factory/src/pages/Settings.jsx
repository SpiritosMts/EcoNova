import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_THRESHOLDS } from '../utils/thresholds';
import { NODES } from '../utils/fakeDataGenerator';

export default function Settings() {
  const { thresholds, updateThresholds, deleteAllData, deleteNodeData, soundEnabled, setSoundEnabled } = useApp();
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChange = (category, field, value) => {
    setLocalThresholds(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: parseFloat(value) || 0,
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    updateThresholds(localThresholds);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setLocalThresholds(DEFAULT_THRESHOLDS);
    updateThresholds(DEFAULT_THRESHOLDS);
    setSaved(false);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteAllData();
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      alert('All data deleted successfully!');
    } catch (error) {
      alert('Error deleting data: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    setDeleting(true);
    try {
      await deleteNodeData(nodeId);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      alert(`Data for ${nodeId} deleted successfully!`);
    } catch (error) {
      alert('Error deleting node data: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (target) => {
    setDeleteTarget(target);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Configure alert thresholds for environmental parameters
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-safe text-white rounded-lg hover:bg-safe/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-safe/10 border border-safe text-safe px-4 py-3 rounded-lg"
        >
          ✓ Settings saved successfully!
        </motion.div>
      )}

      {/* Notification Sound Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Notifications
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Alert Sound</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Play sound when alerts are triggered
            </p>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              soundEnabled
                ? 'bg-safe text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Data Management
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Delete sensor data from Firebase Realtime Database
        </p>

        {/* Delete All Data */}
        <div className="mb-6 p-4 border border-danger/30 rounded-lg bg-danger/5">
          <h4 className="font-semibold text-danger mb-2">Delete All Data</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            This will permanently delete all sensor data for all nodes from your account
          </p>
          <button
            onClick={() => confirmDelete('all')}
            className="flex items-center space-x-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All Data</span>
          </button>
        </div>

        {/* Delete by Node */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
            Delete Data by Node
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {NODES.map((nodeId) => (
              <button
                key={nodeId}
                onClick={() => confirmDelete(nodeId)}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-danger/10 hover:border-danger transition-colors text-slate-700 dark:text-slate-300"
              >
                <Trash2 className="w-4 h-4" />
                <span>{nodeId}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !deleting && setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {deleteTarget === 'all'
                ? 'Are you sure you want to delete ALL data? This action cannot be undone.'
                : `Are you sure you want to delete all data for ${deleteTarget}? This action cannot be undone.`}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteTarget === 'all' ? handleDeleteAll() : handleDeleteNode(deleteTarget)
                }
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* pH Threshold */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          pH Level
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Alert when pH falls outside the safe range
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Minimum pH
            </label>
            <input
              type="number"
              step="0.1"
              value={localThresholds.pH.min}
              onChange={(e) => handleChange('pH', 'min', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">Critical alert below this value</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Maximum pH
            </label>
            <input
              type="number"
              step="0.1"
              value={localThresholds.pH.max}
              onChange={(e) => handleChange('pH', 'max', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">Critical alert above this value</p>
          </div>
        </div>
      </motion.div>

      {/* Turbidity Threshold */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Turbidity
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Alert when turbidity exceeds safe levels
        </p>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Maximum Turbidity (NTU)
          </label>
          <input
            type="number"
            step="1"
            value={localThresholds.turbidity.max}
            onChange={(e) => handleChange('turbidity', 'max', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">Warning alert above this value</p>
        </div>
      </motion.div>

      {/* Flow Rate Threshold */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Flow Rate
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Alert when flow rate drops too low
        </p>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Minimum Flow Rate (L/min)
          </label>
          <input
            type="number"
            step="1"
            value={localThresholds.flow.min}
            onChange={(e) => handleChange('flow', 'min', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">Warning alert below this value</p>
        </div>
      </motion.div>

      {/* Temperature Threshold */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Temperature
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Alert when temperature exceeds safe levels
        </p>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Maximum Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={localThresholds.temperature.max}
            onChange={(e) => handleChange('temperature', 'max', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">Warning alert above this value</p>
        </div>
      </motion.div>

      {/* Current Values Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          💡 Recommended Ranges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
          <div>
            <strong>pH:</strong> 5.5 - 9.0
          </div>
          <div>
            <strong>Turbidity:</strong> &lt; 100 NTU
          </div>
          <div>
            <strong>Flow Rate:</strong> &gt; 50 L/min
          </div>
          <div>
            <strong>Temperature:</strong> &lt; 35°C
          </div>
        </div>
      </motion.div>
    </div>
  );
}
