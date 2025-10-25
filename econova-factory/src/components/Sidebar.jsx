import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, TrendingUp, Settings, LogOut, History } from 'lucide-react';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

const menuItems = [
  { path: '/home', icon: Home, label: 'Dashboard' },
  { path: '/map', icon: Map, label: 'Pollution Map' },
  { path: '/predictions', icon: TrendingUp, label: 'Predictions' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 shadow-lg h-screen sticky top-0 flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-safe/10 text-safe font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-safe' : ''}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
