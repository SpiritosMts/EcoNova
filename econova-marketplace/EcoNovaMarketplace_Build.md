# 🧱 Project Prompt: EcoNova Marketplace Flutter App

## 🌍 Overview
Build a **Flutter marketplace mobile app** called **EcoNova Marketplace** — part of the EcoNova ecosystem.  
This app connects **factories, recyclers, and citizens** to **buy and sell green products** created from **phosphogypsum leach recycling** such as:
- Eco-bricks
- Green cement
- Fertilizers
- Purified battery water
- Recycled construction materials

Users can:
- 🛒 Browse eco-products
- 💸 Buy or sell materials
- 💬 Chat with sellers (optional future feature)
- 💰 Earn/sell & view transaction history
- 🌐 Be part of the sustainable economy  
EcoNova takes a **commission** on each transaction (simulated for now).

---

## 🎨 Theme & Design
- **Primary color:** Orange (`#FFA500`)
- **Accent color:** Deep Orange (`#FF6F00`)
- **Background:** White / Light Cream
- **Font:** Poppins or Inter
- **Buttons:** Gradient from `#FFA500 → #FF6F00`
- **Icons:** Line-style (Lucide or Material Symbols)
- **Animations:** Smooth transitions (Lottie + Hero Animations)
- **UI style:** Minimal, rounded, with soft shadows (Material 3)

---

## 🧱 Tech Stack

- **Framework:** Flutter (latest stable)
- **Backend:** Firebase (Auth + Firestore + Storage)
- **Payments:** Simulated transactions (no real gateway)
- **Image uploads:** Firebase Storage
- **State Management:** Riverpod / Provider
- **UI Library:** Material 3 + Animations + Lottie
- **Push Notifications:** Firebase Messaging (optional)

---

## 🧩 App Pages & Navigation

### 1️⃣ **Auth Screens**
**Login Screen**
- Email, Password fields
- “Sign In” button → redirect to Marketplace Home
- “Don’t have an account? Register”

**Signup Screen**
- Email, Password, Username
- Role dropdown (Seller / Buyer)
- “Register” button → create user in Firebase `users` collection

**Firestore Structure:**
```json
"users": {
  "uid": {
    "email": "eco@factory.com",
    "username": "EcoFactory",
    "role": "seller",
    "created_at": "2025-10-25T18:00:00Z"
  }
}
```

---

### 2️⃣ **Home Screen (Marketplace Overview)**
Tabs (Bottom Navigation Bar):
- 🏠 Home
- 🛍️ My Products
- ➕ Sell Product
- 💰 Transactions
- 👤 Profile

**Home Tab**
- AppBar with title “EcoNova Marketplace”
- Search bar: “Search eco-products...”
- Category chips: [Bricks] [Cement] [Fertilizers] [Battery Water] [Other]
- Product grid (2 columns):
  - Image, Name, Price, Seller badge, Rating stars
- Click product → goes to **Product Detail Screen**

**Firestore Structure:**
```json
"products": {
  "product_id": {
    "name": "Eco Brick XL",
    "category": "Bricks",
    "price": 12.5,
    "description": "Durable eco-friendly brick made from phosphogypsum residue.",
    "image_url": "https://...",
    "seller_id": "uid",
    "seller_name": "EcoNova Plant Gabes",
    "timestamp": "2025-10-25T18:00:00Z",
    "stock": 200
  }
}
```

---

### 3️⃣ **Product Details Screen**
Displays:
- Product image (Hero animation)
- Product name
- Description
- Price
- Stock
- Seller info (tap to view seller profile)
- “Buy Now” button (fake checkout)
- “Add to Cart” (optional)

When user buys:
- Deduct simulated stock in Firestore
- Record transaction under both buyer and seller

---

### 4️⃣ **Sell Product Screen**
For sellers to list new eco-products.

Fields:
- Product Name  
- Category (dropdown)  
- Description  
- Price  
- Stock  
- Image Picker (Camera/Gallery)
- “Publish Product” button  

After publish:
- Upload image to Firebase Storage  
- Add document to Firestore `/products`  
- Show confirmation with animation (Lottie “success checkmark”)  

---

### 5️⃣ **Transactions Screen**
Show all purchases/sales of the current user.

**Example:**
| Type | Product | Amount | Commission | Date |
|------|----------|---------|-------------|------|
| Sale | Eco Brick XL | $120 | $6 | 25 Oct 2025 |
| Buy | Fertilizer Mix | $50 | $2.5 | 24 Oct 2025 |

Commission = 5% (simulated).

**Firestore Structure:**
```json
"transactions": {
  "txn_id": {
    "buyer_id": "uid_1",
    "seller_id": "uid_2",
    "product_id": "product_id",
    "amount": 100,
    "commission": 5,
    "timestamp": "2025-10-25T18:00:00Z"
  }
}
```

---

### 6️⃣ **Profile Screen**
Displays:
- Username
- Email
- Role (Seller/Buyer)
- Join Date
- Total Transactions
- Logout Button

---

### 7️⃣ **Animations and Transitions**
- Use **Lottie** for success screens (e.g., after publish or checkout)
- **Hero animations** for product images
- **AnimatedOpacity** for transitions between tabs
- **Gradient backgrounds** on cards and buttons
- Use Flutter’s **PageRouteBuilder** for smooth page transitions

---

## 🎨 UI Components

**ProductCard Widget**
- Image (Firebase URL)
- Name, Price, Seller
- Rounded corners (radius 16)
- Drop shadow, small elevation
- Fade-in animation

**CategoryChip Widget**
- Icon + Label
- Highlighted when selected

**AnimatedAppButton**
- Gradient background
- Ripple effect
- Animated text on tap

---

## ⚙️ Firebase Firestore Collections

| Collection | Description |
|-------------|--------------|
| `users` | Stores user profiles |
| `products` | Product listings (buy/sell) |
| `transactions` | Sales records |
| `reviews` | Optional future (user feedback) |

---

## 📂 Folder Structure
```
lib/
 ├── main.dart
 ├── screens/
 │   ├── login_screen.dart
 │   ├── signup_screen.dart
 │   ├── home_screen.dart
 │   ├── product_detail_screen.dart
 │   ├── sell_screen.dart
 │   ├── transactions_screen.dart
 │   ├── profile_screen.dart
 ├── widgets/
 │   ├── product_card.dart
 │   ├── category_chip.dart
 │   ├── animated_button.dart
 ├── services/
 │   ├── auth_service.dart
 │   ├── firestore_service.dart
 │   ├── storage_service.dart
 │   ├── transaction_service.dart
 ├── utils/
 │   ├── color_theme.dart
 │   ├── constants.dart
 │   ├── dummy_data.dart
 ├── assets/
 │   ├── lottie/
 │   │   ├── success.json
 │   │   ├── loading.json
```

---

## ⚙️ Dependencies (pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.0.0
  firebase_auth: ^5.0.0
  cloud_firestore: ^5.0.0
  firebase_storage: ^12.0.0
  provider: ^6.0.5
  lottie: ^3.1.0
  image_picker: ^1.1.0
  intl: ^0.19.0
  flutter_animate: ^4.5.0
  fluttertoast: ^8.2.5
  google_fonts: ^6.2.0
```

---

## 🧭 App Flow Summary
1. User logs in or registers.  
2. Lands on the Marketplace home screen with eco-products.  
3. Can **browse** or **search** by category.  
4. Sellers can add products from “Sell” screen.  
5. Buyers can simulate purchases (with commission logic).  
6. All transactions are stored in Firestore.  
7. App UI is orange-themed, with modern animations and transitions.

---

## ✅ Acceptance Criteria
- Runs on Android & iOS.  
- Firebase Auth + Firestore integrated.  
- Product creation and listing functional.  
- Fake “Buy Now” simulation with commission stored.  
- Animated transitions between screens.  
- Modern orange color palette with smooth gradients.  
- Beautiful, responsive UI with Lottie animations.  

---

## 🧠 Summary for the AI
> Build a **Flutter marketplace mobile app** called **EcoNova Marketplace** with Firebase integration. Users can log in, sell eco-products (e.g., eco-bricks, fertilizers, cement, etc.), browse and buy, and simulate transactions. Use orange theme, gradient buttons, animations, and a clean UI similar to EcoNova Citizen, but focused on sustainable commerce. Include fake payment and commission tracking in Firestore.
