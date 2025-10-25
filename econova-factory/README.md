# 🌍 EcoNova Factory - IoT Dashboard

A modern web dashboard for monitoring and visualizing environmental sensor data from factory IoT nodes. Built with React, Tailwind CSS, and Firebase.

## ✨ Features

- **Real-time Monitoring**: Live sensor data visualization with automatic updates
- **Interactive Dashboard**: Charts displaying pH, turbidity, flow rate, and temperature
- **Danger Zone Map**: Google Maps integration showing risk levels with color-coded circles
- **AI Predictions**: Forecasted sensor values for the next 1-6 hours
- **Smart Alerts**: Customizable thresholds with real-time notifications
- **Dark Mode**: Beautiful light/dark theme toggle
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **UI Framework**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: Google Maps JavaScript API
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Auth**: Firebase Authentication (or mock auth for demo)

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm/yarn
- Google Maps API key (optional, for map feature)
- Firebase project (optional, can use mock auth)

### Steps

1. **Clone or navigate to the project:**
   ```bash
   cd econova-factory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys (optional):
   - Firebase credentials (or keep `VITE_USE_MOCK_AUTH=true` for demo)
   - Google Maps API key

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎮 Usage

### Demo Login

The app uses **mock authentication** by default. You can login with any email/password combination:

- Email: `admin@econova.com`
- Password: `any password`

### Features Overview

1. **Dashboard** (`/home`)
   - View summary cards with key metrics
   - Monitor real-time charts for all sensor nodes
   - Check AI-generated insights

2. **Danger Map** (`/map`)
   - Interactive map showing factory nodes
   - Color-coded risk zones (Green=Safe, Orange=Warning, Red=Critical)
   - Click circles for detailed node information

3. **Predictions** (`/predictions`)
   - View AI-predicted values for 1h and 6h ahead
   - Trend indicators showing if parameters are increasing/decreasing
   - Per-node prediction tables

4. **Settings** (`/settings`)
   - Configure alert thresholds for each parameter
   - Customize pH, turbidity, flow, and temperature limits
   - Reset to recommended defaults

## 📊 Data Simulation

The app generates **fake IoT sensor data** automatically:

- Updates every 10 seconds
- Simulates 4 sensor nodes (Node_A, Node_B, Node_C, Node_D)
- Parameters: pH, turbidity, flow rate, temperature
- Danger scores calculated based on threshold violations
- AI predictions use random drift simulation

## 🔔 Notifications

Alerts are triggered when sensor values exceed thresholds:

- **Critical**: pH < 5.5 or > 9.0
- **Warning**: Turbidity > 100 NTU
- **Warning**: Flow < 50 L/min
- **Warning**: Temperature > 35°C

View alerts by clicking the bell icon in the navbar.

## 🎨 Customization

### Colors

Modify theme colors in `tailwind.config.js`:

```js
colors: {
  safe: '#3DD598',    // Green - safe status
  warning: '#FFC542', // Orange - warning status
  danger: '#FC5A5A',  // Red - danger status
  primary: '#1E293B', // Primary dark color
}
```

### Thresholds

Update default thresholds in `src/utils/thresholds.js`.

## 📁 Project Structure

```
/econova-factory
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── NavBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ChartCard.jsx
│   │   ├── SummaryCard.jsx
│   │   └── Layout.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   ├── Map.jsx
│   │   ├── Predictions.jsx
│   │   └── Settings.jsx
│   ├── context/         # React context for state
│   │   └── AppContext.jsx
│   ├── utils/           # Utility functions
│   │   ├── fakeDataGenerator.js
│   │   ├── thresholds.js
│   │   └── firebase.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

Preview the production build:
```bash
npm run preview
```

## 🔧 Configuration

### Firebase Setup (Optional)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. (Optional) Set up Realtime Database
4. Copy your Firebase config to `.env`
5. Set `VITE_USE_MOCK_AUTH=false` in `.env`

### Google Maps Setup (Optional)

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Maps JavaScript API"
3. Add the key to `.env` as `VITE_GOOGLE_MAPS_API_KEY`

## 📝 Notes

- This is a **demonstration app** with simulated data
- AI predictions are randomly generated, not from real ML models
- No actual IoT devices are connected
- Perfect for prototyping and showcasing IoT dashboard concepts

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ for EcoNova Factory**
