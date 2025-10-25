class AppConstants {
  // App Info
  static const String appName = 'EcoNova Marketplace';
  static const String appVersion = '1.0.0';
  
  // Commission
  static const double commissionRate = 0.05; // 5%
  
  // Product Categories
  static const List<String> categories = [
    'Bricks',
    'Cement',
    'Fertilizers',
    'Battery Water',
    'Other',
  ];
  
  // User Roles
  static const String roleSeller = 'seller';
  static const String roleBuyer = 'buyer';
  
  // Collection Names
  static const String usersCollection = 'users';
  static const String productsCollection = 'products';
  static const String transactionsCollection = 'transactions';
  
  // Storage Paths
  static const String productImagesPath = 'product_images';
  
  // Validation
  static const int minPasswordLength = 6;
  static const int maxProductNameLength = 100;
  static const int maxDescriptionLength = 500;
  
  // UI
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 12.0;
  static const int productsPerPage = 20;
}

class AppStrings {
  // Auth
  static const String login = 'Login';
  static const String signup = 'Sign Up';
  static const String logout = 'Logout';
  static const String email = 'Email';
  static const String password = 'Password';
  static const String username = 'Username';
  static const String confirmPassword = 'Confirm Password';
  static const String dontHaveAccount = "Don't have an account?";
  static const String alreadyHaveAccount = "Already have an account?";
  static const String selectRole = 'Select Role';
  
  // Navigation
  static const String home = 'Home';
  static const String myProducts = 'My Products';
  static const String sellProduct = 'Sell';
  static const String transactions = 'Transactions';
  static const String profile = 'Profile';
  
  // Products
  static const String searchProducts = 'Search eco-products...';
  static const String productName = 'Product Name';
  static const String category = 'Category';
  static const String description = 'Description';
  static const String price = 'Price';
  static const String stock = 'Stock';
  static const String seller = 'Seller';
  static const String buyNow = 'Buy Now';
  static const String publishProduct = 'Publish Product';
  static const String selectImage = 'Select Image';
  
  // Messages
  static const String productPublished = 'Product published successfully!';
  static const String purchaseSuccess = 'Purchase completed successfully!';
  static const String error = 'Error';
  static const String success = 'Success';
  static const String loading = 'Loading...';
  static const String noProducts = 'No products available';
  static const String noTransactions = 'No transactions yet';
  
  // Validation Messages
  static const String emailRequired = 'Email is required';
  static const String emailInvalid = 'Enter a valid email';
  static const String passwordRequired = 'Password is required';
  static const String passwordTooShort = 'Password must be at least 6 characters';
  static const String usernameRequired = 'Username is required';
  static const String roleRequired = 'Please select a role';
  static const String productNameRequired = 'Product name is required';
  static const String categoryRequired = 'Category is required';
  static const String priceRequired = 'Price is required';
  static const String priceInvalid = 'Enter a valid price';
  static const String stockRequired = 'Stock is required';
  static const String stockInvalid = 'Enter a valid stock amount';
  static const String imageRequired = 'Please select an image';
}
