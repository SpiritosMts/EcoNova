# 🌍 Project Prompt: EcoNova-Factory Web App (IoT & AI Dashboard)

## 🔧 Project Overview
Build a modern **web dashboard for factories** to monitor and visualize environmental sensor data (fake data simulation).  
The app name is **EcoNova Factory**. Each account represents a factory with multiple sensor nodes.

The system shows:
- Real-time & predicted sensor data in charts
- A map view with predicted danger zones (Google Maps)
- Alerts/notifications when thresholds are exceeded
- Login & factory management
- Clean, animated UI/UX (modern, minimalistic, responsive)

Use **fake/simulated data** (no real IoT devices yet).
AI models are **only visual placeholders** showing predictions, not real ML logic.

---

## 🧱 Stack & Frameworks

- **Frontend:** React (Next.js preferred) or Vite + React  
- **UI Framework:** Tailwind CSS + ShadCN/UI + Framer Motion animations  
- **Charts:** Recharts (or Chart.js if preferred)  
- **Map:** Google Maps JavaScript SDK (draw circles with dynamic colors/radius)  
- **Backend (simulation):** Firebase Realtime Database (or local mock JSON file for fake data)  
- **Auth:** Firebase Authentication (email/password)  
- **Notifications:** Firebase Cloud Messaging (browser push)  
- **Data simulation:** Random generated data updated every few seconds  

---

## 🧩 Pages & Structure

### 1️⃣ **Login Page**
- Simple factory login using Firebase Auth.  
- After login → redirect to dashboard `/home`.  
- Optional register page for new factory.

---

### 2️⃣ **Home / Dashboard Page** (`/home`)
Main analytics overview.

**Sections:**
- Top navbar with logo "EcoNova Factory" + user icon + notifications bell.
- Sidebar with menu:  
  - 🏠 Dashboard  
  - 🌍 Danger Map  
  - 📈 Predictions  
  - ⚙️ Settings / Thresholds  
  - 🚪 Logout
- Main content:
  - Summary cards:
    - Total Nodes
    - Active Alerts
    - Avg pH / Turbidity / Flow (fake averages)
  - Real-time charts (Recharts or Chart.js):
    - pH vs Time
    - Turbidity vs Time
    - Flow Rate vs Time
    - Temperature vs Time
  - Small panel for “AI Predicted Next 6h” (fake predictions using generated data)
  - Notifications component showing active alerts (threshold exceeded)

**Fake Data Example:**
```js
{
  node_id: "Node_A",
  pH: 7.2,
  turbidity: 65,
  flow: 120,
  temperature: 27,
  timestamp: "2025-10-24T21:00:00Z"
}
```

---

### 3️⃣ **Danger Zone Map Page** (`/map`)
Interactive map showing predicted pollution zones.

**Use:**
- Google Maps API (with React wrapper).  
- Display circles on map representing factory nodes.
  - Color & radius depend on danger score (simulated AI prediction).  
  - Example:  
    - Green (safe, score < 30)  
    - Orange (medium, 30–60)  
    - Red (critical, >60)
- Clicking a circle opens a popup with:
  - Node name  
  - Current sensor values  
  - Predicted alert level  
  - “View details” → link to Predictions page

**Simulated danger scores:** random values updated every 30s.

---

### 4️⃣ **Predictions Page** (`/predictions`)
Show predicted sensor values per node (fake AI simulation).

**Table:**
| Node | Parameter | Current | Predicted (1h) | Predicted (6h) | Trend |
|-------|------------|----------|----------------|----------------|-------|
| Node_A | pH | 7.1 | 7.0 | 6.8 | 🔻 |
| Node_B | Turbidity | 80 | 120 | 150 | 🔺 |

**Charts:**
- Show historical + future prediction lines (fake data).  
- Smooth transition animation (Framer Motion).

---

### 5️⃣ **Settings / Thresholds Page** (`/settings`)
Allow factory admin to set custom alert thresholds per parameter.

Example fields:
- pH min/max
- Turbidity limit
- Flow limit
- Temperature max
Save to Firebase or local state.

When fake sensor data exceeds threshold → show alert card & push notification.

---

## 🔔 Notifications System
Use Firebase Cloud Messaging (or mock service) to simulate browser notifications.

Rules (for fake alerts):
- pH < 5.5 or > 9.0 → Critical Alert  
- Turbidity > 100 → Warning  
- Flow < 50 → Warning  
- Temperature > 35°C → Warning  

Display:
- Notification bell icon with count badge.
- Dropdown with latest 5 alerts (auto-update every 10s).
- Each alert: time, node, severity, message.

---

## 🌡️ Data Simulation Logic
A simple script runs in the frontend (or mock backend) to:
- Generate random sensor data for each node every 10 seconds.
- Calculate random “AI predictions” (e.g., future pH = current ± random drift).
- Compute a random “danger score” (0–100) for map visualization.
- Store this data in Firebase or local state array.

Example function:
```js
function simulateSensorData() {
  return {
    pH: 6.5 + Math.random() * 2,
    turbidity: 50 + Math.random() * 100,
    flow: 80 + Math.random() * 50,
    temperature: 20 + Math.random() * 10,
    dangerScore: Math.random() * 100,
    timestamp: new Date().toISOString(),
  };
}
```

---

## 🎨 UI/UX Guidelines
- Use a **clean dark/light mode** toggle.  
- Color palette:  
  - Green (#3DD598) — safe  
  - Orange (#FFC542) — warning  
  - Red (#FC5A5A) — danger  
  - Blue-gray background (#1E293B)  
- Rounded cards, subtle glassmorphism, soft shadows.  
- Smooth transitions (Framer Motion).  
- Responsive (desktop/tablet/mobile).  
- Include subtle animations for map circles & charts updating.

---

## 🧠 Optional AI Visual Touch (fake)
- “AI Insights” panel (just text, no model):
  - Example: “AI predicts 72% chance of high turbidity in next 2 hours.”  
  - Show 2–3 random insights updated every minute.

---

## 🔐 Auth Flow
- Login → `factories/{factoryId}` data namespace in Firebase.  
- Each factory can have multiple sensor nodes.  
- Mock: create a few default factories with nodes (Node_A, Node_B…).

---

## 📂 Folder Structure Example
```
/src
  /components
    ChartCard.jsx
    MapView.jsx
    AlertList.jsx
    NavBar.jsx
  /pages
    login.jsx
    home.jsx
    map.jsx
    predictions.jsx
    settings.jsx
  /utils
    fakeDataGenerator.js
    thresholds.js
    firebase.js
  /styles
    globals.css
```

---

## 📊 Example Fake Data Schema (Firebase)
```json
{
  "factories": {
    "factory_01": {
      "name": "EcoNova Plant Gabes",
      "nodes": {
        "Node_A": {
          "pH": 7.3,
          "turbidity": 62,
          "flow": 130,
          "temperature": 28,
          "dangerScore": 55,
          "timestamp": "2025-10-24T21:00:00Z"
        }
      }
    }
  }
}
```

---

## 🧾 Deliverables (what to output)
The AI should:
1. Generate **complete React (or Next.js) project** with Tailwind, ShadCN, and Framer Motion integrated.  
2. Include **Google Maps page**, **charts**, **thresholds page**, **notifications system**, and **fake data simulation script**.  
3. Implement Firebase Authentication (optional toggle for mock auth if Firebase credentials not available).  
4. Show **animated dashboard**, responsive layout, and working fake data loop.  
5. Include `.env.example` for Firebase keys & Google Maps API key.  
6. Output final directory tree + installation instructions (npm/yarn).  
7. Add sample screenshots / placeholder data preview if possible.

---

## ⚙️ Example Commands
```bash
npm create vite@latest econova-factory
cd econova-factory
npm install firebase tailwindcss recharts framer-motion @react-google-maps/api
npm run dev
```

---

## 🧭 Bonus (optional if time)
- Add “Maintenance Page” listing all alerts with status (Acknowledged / Resolved).  
- Export data as CSV.  
- Include “AI Insight” text widget on dashboard.

---

## ✅ Acceptance Criteria
- The app runs locally (npm run dev) and displays simulated sensor charts updating automatically.  
- The map view shows at least 3 danger circles with varying color/intensity.  
- Notifications trigger when simulated values cross thresholds.  
- UI is smooth, modern, and responsive.  
- Codebase includes clear comments and modular components.

---

## 🧠 Summary for the AI
> Build a **React/Tailwind/Firebase web app** called **EcoNova Factory** that simulates factory IoT data (pH, turbidity, flow, temperature), displays charts and predictions, includes a danger-zone map with circles (Google Maps), shows alerts when thresholds are crossed, supports login per factory, and has an elegant animated UI using Tailwind + Framer Motion.  
> The data is fake/random; AI models are simulated, not real.
