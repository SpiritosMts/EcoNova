import React, { useState } from 'react';
import { Bell, User, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { getSeverityColor } from '../utils/thresholds';

export default function NavBar() {
  const { darkMode, setDarkMode, alerts, user } = useApp();
  const [showAlerts, setShowAlerts] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadAlerts = alerts.slice(0, 5);

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md z-50 sticky top-0">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-safe to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">🌍</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              EcoNova Factory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">IoT Dashboard</p>
          </div>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-white text-xs flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showAlerts && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Recent Alerts
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {unreadAlerts.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                        No alerts
                      </div>
                    ) : (
                      unreadAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {alert.nodeId}
                            </span>
                            <span className={`text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                            {alert.message}
                          </p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(alert.timestamp), 'HH:mm:ss')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.displayName || user?.email || 'Factory Admin'}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
