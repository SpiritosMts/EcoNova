import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Factory } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-safe flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-safe to-blue-500 flex items-center justify-center">
            <Factory className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
          EcoNova Factory
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
          {isRegister ? 'Create your factory account' : 'Sign in to your factory dashboard'}
        </p>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none transition"
              placeholder="factory@econova.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-safe focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-safe to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle between login/register */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-safe hover:underline text-sm"
          >
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account? Register"}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
