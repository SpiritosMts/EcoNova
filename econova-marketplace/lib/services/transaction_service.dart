import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/transaction_model.dart';
import '../models/product_model.dart';
import '../utils/constants.dart';
import '../utils/helpers.dart';

class TransactionService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Create transaction
  Future<String> createTransaction({
    required String buyerId,
    required String sellerId,
    required ProductModel product,
    int quantity = 1,
  }) async {
    try {
      final amount = product.price * quantity;
      final commission = Helpers.calculateCommission(amount, AppConstants.commissionRate);

      final transaction = TransactionModel(
        id: '',
        buyerId: buyerId,
        sellerId: sellerId,
        productId: product.id,
        productName: product.name,
        amount: amount,
        commission: commission,
        timestamp: DateTime.now(),
        quantity: quantity,
      );

      final docRef = await _firestore
          .collection(AppConstants.transactionsCollection)
          .add(transaction.toMap());

      // Update product stock
      final newStock = product.stock - quantity;
      await _firestore
          .collection(AppConstants.productsCollection)
          .doc(product.id)
          .update({'stock': newStock});

      return docRef.id;
    } catch (e) {
      rethrow;
    }
  }

  // Get transactions by buyer
  Stream<List<TransactionModel>> getTransactionsByBuyer(String buyerId) {
    return _firestore
        .collection(AppConstants.transactionsCollection)
        .where('buyer_id', isEqualTo: buyerId)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => TransactionModel.fromFirestore(doc))
            .toList());
  }

  // Get transactions by seller
  Stream<List<TransactionModel>> getTransactionsBySeller(String sellerId) {
    return _firestore
        .collection(AppConstants.transactionsCollection)
        .where('seller_id', isEqualTo: sellerId)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => TransactionModel.fromFirestore(doc))
            .toList());
  }

  // Get all transactions for a user (both buyer and seller)
  Stream<List<TransactionModel>> getAllUserTransactions(String userId) {
    return _firestore
        .collection(AppConstants.transactionsCollection)
        .where('buyer_id', isEqualTo: userId)
        .orderBy('timestamp', descending: true)
        .snapshots()
        .asyncMap((buyerSnapshot) async {
      final sellerSnapshot = await _firestore
          .collection(AppConstants.transactionsCollection)
          .where('seller_id', isEqualTo: userId)
          .orderBy('timestamp', descending: true)
          .get();

      final allTransactions = [
        ...buyerSnapshot.docs
            .map((doc) => TransactionModel.fromFirestore(doc)),
        ...sellerSnapshot.docs
            .map((doc) => TransactionModel.fromFirestore(doc)),
      ];

      allTransactions.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      return allTransactions;
    });
  }

  // Get transaction by ID
  Future<TransactionModel?> getTransaction(String transactionId) async {
    try {
      final doc = await _firestore
          .collection(AppConstants.transactionsCollection)
          .doc(transactionId)
          .get();

      if (doc.exists) {
        return TransactionModel.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      rethrow;
    }
  }

  // Get total earnings for seller
  Future<double> getTotalEarnings(String sellerId) async {
    try {
      final snapshot = await _firestore
          .collection(AppConstants.transactionsCollection)
          .where('seller_id', isEqualTo: sellerId)
          .get();

      double total = 0;
      for (var doc in snapshot.docs) {
        final data = doc.data();
        total += (data['amount'] ?? 0).toDouble();
      }

      return total;
    } catch (e) {
      rethrow;
    }
  }

  // Get total spending for buyer
  Future<double> getTotalSpending(String buyerId) async {
    try {
      final snapshot = await _firestore
          .collection(AppConstants.transactionsCollection)
          .where('buyer_id', isEqualTo: buyerId)
          .get();

      double total = 0;
      for (var doc in snapshot.docs) {
        final data = doc.data();
        total += (data['amount'] ?? 0).toDouble();
      }

      return total;
    } catch (e) {
      rethrow;
    }
  }
}
