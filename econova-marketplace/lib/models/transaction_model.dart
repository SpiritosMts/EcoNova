import 'package:cloud_firestore/cloud_firestore.dart';

class TransactionModel {
  final String id;
  final String buyerId;
  final String sellerId;
  final String productId;
  final String productName;
  final double amount;
  final double commission;
  final DateTime timestamp;
  final int quantity;

  TransactionModel({
    required this.id,
    required this.buyerId,
    required this.sellerId,
    required this.productId,
    required this.productName,
    required this.amount,
    required this.commission,
    required this.timestamp,
    this.quantity = 1,
  });

  factory TransactionModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return TransactionModel(
      id: doc.id,
      buyerId: data['buyer_id'] ?? '',
      sellerId: data['seller_id'] ?? '',
      productId: data['product_id'] ?? '',
      productName: data['product_name'] ?? '',
      amount: (data['amount'] ?? 0).toDouble(),
      commission: (data['commission'] ?? 0).toDouble(),
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      quantity: data['quantity'] ?? 1,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'buyer_id': buyerId,
      'seller_id': sellerId,
      'product_id': productId,
      'product_name': productName,
      'amount': amount,
      'commission': commission,
      'timestamp': Timestamp.fromDate(timestamp),
      'quantity': quantity,
    };
  }
}
