# 🚀 Quick Start Guide

## ✅ Your EcoNova Factory Dashboard is Ready!

The application is now running at **http://localhost:3000**

## 🔑 Demo Login

Use any credentials to login (mock authentication is enabled):
- **Email**: `admin@econova.com` (or any email)
- **Password**: `password123` (or any password)

## 📱 Application Features

### 1. Dashboard (`/home`)
- **4 Summary Cards**: Total nodes, active alerts, average pH, and temperature
- **Real-time Charts**: Live updating charts for all sensor parameters
  - pH levels for each node
  - Turbidity (NTU)
  - Flow rate (L/min)
  - Temperature (°C)
- **AI Insights Panel**: Simulated AI predictions and recommendations
- Data updates automatically every 10 seconds

### 2. Danger Zone Map (`/map`)
- Interactive Google Maps showing factory location (Gabès, Tunisia)
- Color-coded circles for each sensor node:
  - 🟢 **Green**: Safe (risk score < 30)
  - 🟠 **Orange**: Warning (risk score 30-60)
  - 🔴 **Red**: Critical (risk score > 60)
- Click circles to view detailed sensor readings
- Node status cards below the map

### 3. Predictions (`/predictions`)
- AI-predicted values for 1 hour and 6 hours ahead
- Trend indicators (↑ increasing, ↓ decreasing, − stable)
- Organized by node with detailed tables
- All four parameters tracked per node

### 4. Settings (`/settings`)
- Customize alert thresholds:
  - **pH**: Min/Max safe range
  - **Turbidity**: Maximum NTU allowed
  - **Flow Rate**: Minimum L/min required
  - **Temperature**: Maximum °C allowed
- Save/Reset functionality
- Recommended default values included

### 5. Navigation & Alerts
- **Dark Mode Toggle**: Switch between light/dark themes
- **Notification Bell**: View recent alerts in real-time
- **User Menu**: Access user information
- **Sidebar Navigation**: Quick access to all pages

## 🎨 Theme

- Beautiful gradient design with glassmorphism effects
- Smooth Framer Motion animations throughout
- Fully responsive for desktop, tablet, and mobile
- Dark mode support

## 📊 Simulated Data

The app generates realistic sensor data:
- **4 sensor nodes**: Node_A, Node_B, Node_C, Node_D
- **Parameters tracked**:
  - pH (4.0 - 10.0 range)
  - Turbidity (0 - 200 NTU)
  - Flow Rate (0 - 200 L/min)
  - Temperature (15 - 40°C)
- **Updates**: Every 10 seconds
- **Alerts**: Triggered automatically when thresholds are exceeded

## 🔔 Alert System

Alerts appear when:
- pH < 5.5 or > 9.0 → **Critical Alert** (Red)
- Turbidity > 100 NTU → **Warning** (Orange)
- Flow Rate < 50 L/min → **Warning** (Orange)
- Temperature > 35°C → **Warning** (Orange)

View alerts by clicking the bell icon (🔔) in the top-right corner.

## 🗺️ Google Maps Integration

The map feature requires a Google Maps API key:
1. Get a free API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Maps JavaScript API"
3. Create a `.env` file based on `.env.example`
4. Add your key as `VITE_GOOGLE_MAPS_API_KEY=your_key_here`

Without an API key, the map will show an error but all other features work perfectly.

## 🔧 Optional: Firebase Setup

To use real Firebase authentication:
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication > Email/Password
3. Copy your config to `.env`
4. Set `VITE_USE_MOCK_AUTH=false`

Mock authentication works great for demos and development!

## 📦 Project Structure

```
/econova
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Main application pages
│   ├── context/        # React Context API for state
│   ├── utils/          # Helper functions & data generators
│   └── styles/         # Tailwind CSS styles
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind customization
└── README.md           # Full documentation
```

## 🛠️ Useful Commands

```bash
# Start development server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new packages
npm install <package-name>
```

## 🎯 Next Steps

1. **Test the login** - Use any email/password
2. **Explore the dashboard** - Watch the charts update in real-time
3. **Check the map** - View danger zones (add Google Maps key for full functionality)
4. **View predictions** - See AI-generated forecasts
5. **Customize settings** - Adjust alert thresholds
6. **Toggle dark mode** - Try the beautiful dark theme

## 💡 Tips

- The data updates every 10 seconds - watch the charts animate!
- Hover over chart points to see exact values
- Click map circles for detailed node information
- Alerts accumulate over time - check the bell icon
- Settings save to browser state (lost on refresh)
- Use dark mode for a more immersive experience

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Restart the server
npm run dev
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
Check that all files are properly saved and try restarting the dev server.

---

**Enjoy your IoT dashboard!** 🌍✨
