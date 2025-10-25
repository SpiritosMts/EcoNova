import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/product_model.dart';
import '../models/user_model.dart';
import '../utils/constants.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Products

  // Get all products
  Stream<List<ProductModel>> getProducts() {
    return _firestore
        .collection(AppConstants.productsCollection)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => ProductModel.fromFirestore(doc)).toList());
  }

  // Get products by category
  Stream<List<ProductModel>> getProductsByCategory(String category) {
    return _firestore
        .collection(AppConstants.productsCollection)
        .where('category', isEqualTo: category)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => ProductModel.fromFirestore(doc)).toList());
  }

  // Get products by seller
  Stream<List<ProductModel>> getProductsBySeller(String sellerId) {
    return _firestore
        .collection(AppConstants.productsCollection)
        .where('seller_id', isEqualTo: sellerId)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => ProductModel.fromFirestore(doc)).toList());
  }

  // Get single product
  Future<ProductModel?> getProduct(String productId) async {
    try {
      final doc = await _firestore
          .collection(AppConstants.productsCollection)
          .doc(productId)
          .get();

      if (doc.exists) {
        return ProductModel.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      rethrow;
    }
  }

  // Add product
  Future<String> addProduct(ProductModel product) async {
    try {
      final docRef = await _firestore
          .collection(AppConstants.productsCollection)
          .add(product.toMap());
      return docRef.id;
    } catch (e) {
      rethrow;
    }
  }

  // Update product
  Future<void> updateProduct(String productId, Map<String, dynamic> updates) async {
    try {
      await _firestore
          .collection(AppConstants.productsCollection)
          .doc(productId)
          .update(updates);
    } catch (e) {
      rethrow;
    }
  }

  // Delete product
  Future<void> deleteProduct(String productId) async {
    try {
      await _firestore
          .collection(AppConstants.productsCollection)
          .doc(productId)
          .delete();
    } catch (e) {
      rethrow;
    }
  }

  // Update product stock
  Future<void> updateProductStock(String productId, int newStock) async {
    try {
      await _firestore
          .collection(AppConstants.productsCollection)
          .doc(productId)
          .update({'stock': newStock});
    } catch (e) {
      rethrow;
    }
  }

  // Search products
  Future<List<ProductModel>> searchProducts(String query) async {
    try {
      final snapshot = await _firestore
          .collection(AppConstants.productsCollection)
          .get();

      final products = snapshot.docs
          .map((doc) => ProductModel.fromFirestore(doc))
          .where((product) =>
              product.name.toLowerCase().contains(query.toLowerCase()) ||
              product.description.toLowerCase().contains(query.toLowerCase()))
          .toList();

      return products;
    } catch (e) {
      rethrow;
    }
  }

  // Users

  // Get user
  Future<UserModel?> getUser(String uid) async {
    try {
      final doc = await _firestore
          .collection(AppConstants.usersCollection)
          .doc(uid)
          .get();

      if (doc.exists) {
        return UserModel.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      rethrow;
    }
  }
}
