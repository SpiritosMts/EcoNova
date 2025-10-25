# 🌿 Project Prompt: EcoNova Citizen Flutter App

## 🌍 Overview
Build a Flutter mobile app called **EcoNova Citizen**.  
It allows users (citizens) to:
1. **Take or upload a photo** of a polluted area.  
2. Simulate an **AI analysis** (fake loading animation) to detect:
   - Type of pollution (e.g., water, air, waste).  
   - Estimated danger level (0–100).  
3. Automatically **capture GPS location** using Geolocator.  
4. **Send report data** (image URL, type, danger score, coordinates, timestamp) to **Firestore** collection named `requests`.  
5. View a **Google Map screen** that displays danger zones with color-coded circles:
   - 0–40 → 🟡 *Moderate* (yellow)
   - 40–70 → 🟠 *Warning* (orange)
   - 70–100 → 🔴 *Critical* (red)
6. Receive **precaution tips** depending on the area level.  
7. Include **Login & Signup** pages (Firebase Auth).

The app uses **fake AI logic** — simulate detection and danger scoring with random values and a loading animation.

---

## 🧱 Tech Stack

- **Framework:** Flutter (latest stable)  
- **Backend:** Firebase (Auth + Firestore + Storage)  
- **Maps:** Google Maps Flutter plugin  
- **Location:** Geolocator  
- **Image picker:** image_picker  
- **State management:** Provider or Riverpod (your choice)  
- **UI:** Material 3 with gradient theme (EcoNova colors)  
  - Primary gradient: `#3DD598` → `#2F80ED`

---

## 🧩 App Pages & Structure

### 1️⃣ **Auth Screens**
**Login Screen**
- Email & Password fields.
- “Sign In” button → goes to Home.
- Link: “Don’t have an account? Register.”

**Signup Screen**
- Email, Password, Confirm Password.
- “Register” button → creates account in Firebase.

---

### 2️⃣ **Home Screen**
**Tabs or Bottom Navigation:**
- 📸 Report Pollution  
- 🗺️ Map  
- ⚙️ Profile (optional)

---

### 3️⃣ **Report Pollution Screen**
Main feature.

**Steps:**
1. User presses “Take Photo” → opens camera or gallery picker.
2. After photo selected:
   - Show a **loading screen (fake AI processing)**:
     - Animated spinner and progress text:
       > “Analyzing pollution type…”  
       > “Checking location safety…”  
       > “Predicting danger level…”  
     - Duration: 3–5 seconds.
   - Randomly generate:
     - Pollution type (`["Air", "Water", "Waste"]`)
     - Danger level (`0–100`)
3. After “AI” finishes:
   - Display result card:
     ```
     Pollution Type: Water
     Danger Level: 73 (Critical)
     ```
   - Button: “Send Report”
4. When tapped:
   - Upload image to Firebase Storage.
   - Save record to Firestore `requests`:
     ```json
     {
       "user_id": "uid",
       "image_url": "https://...",
       "pollution_type": "Water",
       "danger_level": 73,
       "latitude": 33.8812,
       "longitude": 10.0983,
       "timestamp": "2025-10-25T21:00:00Z"
     }
     ```
   - Show confirmation snackbar “Report Sent Successfully!”

---

### 4️⃣ **Map Screen (Danger Zones)**
- Uses **Google Maps Flutter** (`google_maps_flutter` package).  
- API Key: `AIzaSyAjiqioJHrrVKcC2BXqs65lbWdJSU7U5tA`
- Fetch `requests` collection from Firestore.
- Display circles or markers:
  - Color based on danger level:
    - 0–40 → Yellow
    - 40–70 → Orange
    - 70–100 → Red
  - Radius proportional to danger level (e.g., 100–500m).
- Tapping marker shows:
  - Pollution type  
  - Danger %  
  - Tips box (see below).

**Tips by danger level:**
| Level | Color | Tips |
|--------|--------|------|
| 0–40 | 🟡 Moderate | Safe to visit. Stay aware of updates. |
| 40–70 | 🟠 Warning | Wear a mask, limit outdoor exposure, avoid contact with water. |
| 70–100 | 🔴 Critical | Avoid area, wear protective gear, report to authorities immediately. |

---

### 5️⃣ **Fake AI Simulation Logic**
Since AI is not real, simulate it:

```dart
Future<Map<String, dynamic>> fakeAIAnalysis(File image) async {
  await Future.delayed(Duration(seconds: 4));
  final types = ["Air", "Water", "Waste"];
  final type = types[DateTime.now().millisecondsSinceEpoch % 3];
  final danger = (20 + (DateTime.now().millisecond % 80)).toDouble();
  return {"type": type, "danger": danger};
}
```

Display loading animation during process:
- Use **Lottie** animation or rotating circular progress bar.
- Text changes every second:
  - “Analyzing pollution…”
  - “Detecting danger…”
  - “Finalizing report…”

---

## 🎨 UI Design Guidelines
- **Primary gradient:** `#3DD598 → #2F80ED`
- Rounded cards (radius 24)
- Soft shadows and subtle animations
- Lottie or AnimatedIcons for processing steps
- Buttons gradient background
- Font: Poppins or Inter

---

## 🌍 Firestore Collections
### `users`
| Field | Type |
|-------|------|
| uid | string |
| email | string |
| created_at | timestamp |

### `requests`
| Field | Type |
|-------|------|
| user_id | string |
| image_url | string |
| pollution_type | string |
| danger_level | double |
| latitude | double |
| longitude | double |
| timestamp | timestamp |

---

## 📂 Folder Structure
```
lib/
 ├── main.dart
 ├── screens/
 │   ├── login_screen.dart
 │   ├── signup_screen.dart
 │   ├── home_screen.dart
 │   ├── report_screen.dart
 │   ├── map_screen.dart
 ├── services/
 │   ├── auth_service.dart
 │   ├── firestore_service.dart
 │   ├── fake_ai_service.dart
 │   ├── location_service.dart
 ├── widgets/
 │   ├── pollution_card.dart
 │   ├── loading_dialog.dart
 ├── utils/
 │   ├── color_theme.dart
 │   ├── tips_data.dart
```

---

## ⚙️ Required Dependencies
```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.0.0
  firebase_auth: ^5.0.0
  cloud_firestore: ^5.0.0
  firebase_storage: ^12.0.0
  google_maps_flutter: ^2.6.0
  geolocator: ^10.0.0
  image_picker: ^1.1.0
  lottie: ^3.1.0
  provider: ^6.0.5
```

---

## 🧭 App Flow Summary
1. User signs in or registers.  
2. Opens "Report Pollution" → takes photo.  
3. Sees fake AI loading animation.  
4. Gets result with pollution type + danger % + GPS location.  
5. Sends data to Firestore.  
6. Opens Map → sees colored danger zones.  
7. Reads tips based on danger level.  

---

## ✅ Acceptance Criteria
- Flutter app runs on Android & iOS.  
- Fake AI simulation works smoothly (progress & results).  
- Data correctly saved to Firestore.  
- Map shows circles with color codes.  
- UI matches EcoNova theme and animations.  
- Tips are displayed clearly by danger level.

---

## 🧠 Summary for AI
> Build a **Flutter mobile app** called **EcoNova Citizen** that allows users to capture images of pollution, simulate AI detection (pollution type + danger %), collect GPS location, save data to Firestore, and visualize danger zones on Google Maps with color-coded levels (yellow, orange, red). Include login/signup, smooth animations, and modern gradient UI.
