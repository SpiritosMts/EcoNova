# EcoNova Marketplace - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Flutter SDK** (latest stable version)
- **Android Studio** or **VS Code** with Flutter extensions
- **Xcode** (for iOS development, macOS only)
- **Firebase CLI**: `npm install -g firebase-tools`
- **FlutterFire CLI**: `dart pub global activate flutterfire_cli`

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd econova-marketplace
flutter pub get
```

### 2. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "EcoNova Marketplace"
3. Enable Google Analytics (optional)

#### Configure Firebase for Flutter
Run the FlutterFire CLI configuration:

```bash
flutterfire configure
```

This will:
- Generate `lib/firebase_options.dart`
- Create `android/app/google-services.json`
- Create `ios/Runner/GoogleService-Info.plist`

#### Enable Firebase Services

In Firebase Console, enable the following:

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for development)
   - Choose a location close to your users

3. **Firebase Storage**
   - Go to Storage
   - Click "Get Started"
   - Start in **test mode** (for development)

### 3. Firestore Security Rules (for development)

Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Storage Security Rules (for development)

Update Storage rules in Firebase Console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run the App

#### For Android:
```bash
flutter run
```

#### For iOS (macOS only):
```bash
cd ios
pod install
cd ..
flutter run
```

## Project Structure

```
lib/
├── main.dart                    # App entry point
├── models/                      # Data models
│   ├── user_model.dart
│   ├── product_model.dart
│   └── transaction_model.dart
├── screens/                     # UI screens
│   ├── login_screen.dart
│   ├── signup_screen.dart
│   ├── home_screen.dart
│   ├── marketplace_tab.dart
│   ├── my_products_tab.dart
│   ├── product_detail_screen.dart
│   ├── sell_screen.dart
│   ├── transactions_screen.dart
│   └── profile_screen.dart
├── services/                    # Business logic
│   ├── auth_service.dart
│   ├── firestore_service.dart
│   ├── storage_service.dart
│   └── transaction_service.dart
├── widgets/                     # Reusable widgets
│   ├── product_card.dart
│   ├── category_chip.dart
│   ├── animated_button.dart
│   └── transaction_card.dart
└── utils/                       # Utilities
    ├── color_theme.dart
    ├── constants.dart
    └── helpers.dart
```

## Features

### Authentication
- Email/Password sign up and login
- User roles (Buyer/Seller)
- Persistent authentication

### Marketplace
- Browse eco-products
- Search functionality
- Category filtering
- Product details with images

### Selling
- Upload product images
- Set price and stock
- Categorize products
- Track your listings

### Transactions
- Simulated purchases
- 5% commission calculation
- Transaction history
- Earnings and spending tracking

### Profile
- View account details
- Transaction statistics
- Logout functionality

## Troubleshooting

### Firebase Initialization Error
If you see Firebase initialization errors:
1. Ensure `firebase_options.dart` exists in `lib/`
2. Run `flutterfire configure` again
3. Check that Firebase project is properly set up

### Android Build Issues
If Android build fails:
1. Ensure `google-services.json` is in `android/app/`
2. Check that Firebase BoM version is compatible
3. Try `flutter clean && flutter pub get`

### iOS Build Issues
If iOS build fails:
1. Ensure `GoogleService-Info.plist` is in `ios/Runner/`
2. Run `cd ios && pod install`
3. Open Xcode and check signing & capabilities

### Image Picker Permissions
If image picker doesn't work:

**Android**: Permissions are already added in `AndroidManifest.xml`

**iOS**: Add to `ios/Runner/Info.plist`:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to upload product images</string>
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take product photos</string>
```

## Testing

### Create Test Accounts
1. Sign up as a Seller
2. Sign up as a Buyer (use different email)
3. Seller: Add products
4. Buyer: Browse and purchase

### Test Features
- Upload product images
- Search products
- Make purchases
- View transaction history
- Check earnings/spending statistics

## Production Deployment

Before deploying to production:

1. **Update Firebase Security Rules** to be more restrictive
2. **Enable App Check** for additional security
3. **Configure proper signing** for Android/iOS
4. **Update privacy policy** and terms of service
5. **Test thoroughly** on physical devices
6. **Set up Firebase App Distribution** for testing
7. **Submit to App Stores** following their guidelines

## Support

For issues or questions:
- Check Firebase Console for error logs
- Review Flutter logs: `flutter logs`
- Verify Firestore data structure matches models

## License

Part of the EcoNova ecosystem for sustainable commerce.
