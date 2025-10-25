import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User,
  Droplets,
  Wind,
  Trash2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  useEffect(() => {
    // Real-time listener for requests collection
    const q = query(
      collection(firestore, 'requests'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = [];
      snapshot.forEach((doc) => {
        requestsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching requests:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get danger level color
  const getDangerColor = (level) => {
    if (level >= 70) return 'text-danger';
    if (level >= 40) return 'text-warning';
    return 'text-safe';
  };

  const getDangerBg = (level) => {
    if (level >= 70) return 'bg-danger/10';
    if (level >= 40) return 'bg-warning/10';
    return 'bg-safe/10';
  };

  // Get pollution type icon
  const getPollutionIcon = (type) => {
    const iconProps = { className: 'w-5 h-5' };
    switch (type?.toLowerCase()) {
      case 'water':
        return <Droplets {...iconProps} />;
      case 'air':
        return <Wind {...iconProps} />;
      case 'waste':
        return <Trash2 {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Filter and sort requests
  const filteredRequests = requests
    .filter(req => filterType === 'all' || req.pollution_type?.toLowerCase() === filterType)
    .sort((a, b) => {
      if (sortBy === 'danger') {
        return (b.danger_level || 0) - (a.danger_level || 0);
      }
      return 0; // Default: already sorted by timestamp
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-safe mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Pollution Requests
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Citizen-reported pollution incidents requiring factory attention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-safe/10 text-safe rounded-lg font-semibold">
            {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter:</span>
          </div>
          <div className="flex gap-2">
            {['all', 'water', 'air', 'waste'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterType === type
                    ? 'bg-safe text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer"
            >
              <option value="timestamp">Recent</option>
              <option value="danger">Danger Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No requests found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {filterType !== 'all' 
              ? `No ${filterType} pollution requests at the moment.`
              : 'No pollution requests at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              {request.image_url && (
                <div className="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={request.image_url}
                    alt="Pollution report"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Header with danger level */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getDangerBg(request.danger_level)}`}>
                      {getPollutionIcon(request.pollution_type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                        {request.pollution_type || 'Unknown'} Pollution
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ID: {request.id.substring(0, 8)}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-bold ${getDangerBg(request.danger_level)} ${getDangerColor(request.danger_level)}`}>
                    {request.danger_level || 0}%
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {request.latitude && request.longitude 
                        ? `${request.latitude.toFixed(4)}, ${request.longitude.toFixed(4)}`
                        : 'Location not available'}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {request.timestamp?.toDate 
                        ? format(request.timestamp.toDate(), 'MMM dd, yyyy · HH:mm')
                        : 'Date not available'}
                    </span>
                  </div>

                  {/* User ID */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      Reporter: {request.user_id?.substring(0, 12)}...
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full px-4 py-3 bg-safe hover:bg-safe/90 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  View on Map
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
