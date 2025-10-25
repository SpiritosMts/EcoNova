# EcoNova Marketplace

A Flutter marketplace mobile app for buying and selling eco-friendly products made from phosphogypsum recycling.

## Features

- 🛒 Browse eco-products (eco-bricks, green cement, fertilizers, etc.)
- 💸 Buy and sell sustainable materials
- 💰 Transaction history with commission tracking
- 🔐 Firebase authentication
- 🎨 Modern orange-themed UI with animations

## Getting Started

### Prerequisites

- Flutter SDK (latest stable)
- Firebase account
- Android Studio / Xcode for mobile development

### Installation

1. Clone the repository
2. Run `flutter pub get`
3. Set up Firebase:
   - Create a Firebase project
   - Add Android/iOS apps
   - Download and add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Run `flutterfire configure` to generate `firebase_options.dart`
4. Run `flutter run`

## Project Structure

```
lib/
├── main.dart
├── screens/          # UI screens
├── widgets/          # Reusable widgets
├── services/         # Firebase services
└── utils/            # Utilities and constants
```

## Tech Stack

- Flutter
- Firebase (Auth, Firestore, Storage)
- Provider for state management
- Lottie for animations
- Material 3 design

## License

Part of the EcoNova ecosystem
