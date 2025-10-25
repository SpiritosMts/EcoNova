# Firebase Setup Instructions

## Prerequisites
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Install FlutterFire CLI: `dart pub global activate flutterfire_cli`

## Steps

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project named "EcoNova Marketplace"

### 2. Configure Firebase for Flutter
Run the following command in the project root:
```bash
flutterfire configure
```

This will:
- Generate `firebase_options.dart` in the lib folder
- Create/update `google-services.json` for Android
- Create/update `GoogleService-Info.plist` for iOS

### 3. Enable Firebase Services
In Firebase Console, enable:
- **Authentication** → Email/Password sign-in method
- **Firestore Database** → Start in test mode
- **Storage** → Start in test mode

### 4. Firestore Security Rules (for testing)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Storage Security Rules (for testing)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Android Configuration
Add to `android/app/build.gradle`:
```gradle
dependencies {
    // ... other dependencies
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
}
```

### 7. iOS Configuration
Minimum deployment target should be iOS 13.0 or higher in `ios/Podfile`:
```ruby
platform :ios, '13.0'
```

## Verification
After setup, run:
```bash
flutter run
```

The app should connect to Firebase successfully.
