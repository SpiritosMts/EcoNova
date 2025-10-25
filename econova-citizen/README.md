# 🌿 EcoNova Citizen

A Flutter mobile application that allows citizens to report pollution and visualize danger zones on an interactive map.

## 📱 Features

- **📸 Photo Reporting**: Capture or upload images of polluted areas
- **🤖 AI Analysis**: Simulated AI detection of pollution type and danger level
- **📍 GPS Location**: Automatic location capture using device GPS
- **🗺️ Interactive Map**: Visualize danger zones with color-coded circles
- **💡 Safety Tips**: Receive precaution recommendations based on danger levels
- **🔐 Authentication**: Secure login and signup with Firebase Auth

## 🎨 Design

- **EcoNova Gradient**: `#3DD598` → `#2F80ED`
- **Danger Levels**:
  - 🟡 **Moderate (0-40)**: Safe to visit
  - 🟠 **Warning (40-70)**: Wear mask, limit exposure
  - 🔴 **Critical (70-100)**: Avoid area, use protective gear

## 🛠️ Tech Stack

- **Framework**: Flutter 3.0+
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: Google Maps Flutter
- **Location**: Geolocator
- **State Management**: Provider

## 📋 Prerequisites

- Flutter SDK (3.0 or higher)
- Dart SDK
- Android Studio / Xcode
- Firebase account
- Google Maps API Key

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd econova-citizen
flutter pub get
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create **Firestore Database** in production mode
4. Enable **Storage**

#### Android Configuration

1. Download `google-services.json` from Firebase Console
2. Place it in `android/app/`
3. Update `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

4. Update `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'

android {
    defaultConfig {
        minSdkVersion 21
    }
}
```

#### iOS Configuration

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to `ios/Runner/` in Xcode
3. Update `ios/Podfile`:

```ruby
platform :ios, '12.0'
```

### 3. Google Maps Setup

#### Android

1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps SDK for Android**
3. Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <application>
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="AIzaSyAjiqioJHrrVKcC2BXqs65lbWdJSU7U5tA"/>
    </application>
</manifest>
```

#### iOS

1. Enable **Maps SDK for iOS**
2. Add to `ios/Runner/AppDelegate.swift`:

```swift
import GoogleMaps

GMSServices.provideAPIKey("AIzaSyAjiqioJHrrVKcC2BXqs65lbWdJSU7U5tA")
```

### 4. Permissions

#### Android (`android/app/src/main/AndroidManifest.xml`)

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.CAMERA"/>
```

#### iOS (`ios/Runner/Info.plist`)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to report pollution areas</string>
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture pollution images</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
```

### 5. Run the App

```bash
# Check connected devices
flutter devices

# Run on connected device
flutter run

# Run with hot reload
flutter run --debug
```

## 📂 Project Structure

```
lib/
├── main.dart                   # App entry point
├── screens/                    # UI screens
│   ├── login_screen.dart
│   ├── signup_screen.dart
│   ├── home_screen.dart
│   ├── report_screen.dart
│   └── map_screen.dart
├── services/                   # Business logic
│   ├── auth_service.dart
│   ├── firestore_service.dart
│   ├── fake_ai_service.dart
│   └── location_service.dart
├── widgets/                    # Reusable components
│   ├── pollution_card.dart
│   └── loading_dialog.dart
└── utils/                      # Utilities
    ├── color_theme.dart
    └── tips_data.dart
```

## 🔥 Firestore Collections

### `users`
- `uid`: string
- `email`: string
- `created_at`: timestamp

### `requests`
- `user_id`: string
- `image_url`: string
- `pollution_type`: string (Air, Water, Waste)
- `danger_level`: double (0-100)
- `latitude`: double
- `longitude`: double
- `timestamp`: timestamp

## 🧪 Fake AI Simulation

The app simulates AI analysis with a 4-second delay and generates:
- Random pollution type (Air, Water, Waste)
- Random danger level (20-100)

This can be replaced with a real AI model/API in production.

## 🎯 Usage Flow

1. **Sign Up/Login** → Create account or sign in
2. **Take Photo** → Capture pollution image
3. **AI Analysis** → Wait for simulated analysis (4s)
4. **View Results** → See pollution type, danger level, and tips
5. **Send Report** → Upload to Firestore with GPS location
6. **View Map** → See all danger zones with color-coded circles
7. **Get Tips** → Tap circles for detailed safety recommendations

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean build
flutter clean
flutter pub get

# Rebuild
flutter run
```

### Firebase Issues

- Ensure `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is correctly placed
- Check Firebase Console for enabled services
- Verify package name matches Firebase configuration

### Location Not Working

- Check permissions in device settings
- Enable location services
- Test on physical device (emulator may have issues)

## 📝 Development Notes

- All lint errors are expected until `flutter pub get` is run
- API key in code is for demo purposes only
- Replace with environment variables in production
- Implement proper error handling for production use

## 🚧 Future Enhancements

- Real AI/ML model integration
- Push notifications for nearby danger zones
- Community voting on reports
- Historical data visualization
- Multi-language support
- Offline mode with sync

## 📄 License

This project is part of the EcoNova ecosystem for environmental monitoring.

## 👥 Contributing

Contributions are welcome! Please follow the existing code structure and naming conventions.

---

Built with 💚 for a cleaner planet
