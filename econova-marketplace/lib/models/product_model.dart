import 'package:cloud_firestore/cloud_firestore.dart';

class ProductModel {
  final String id;
  final String name;
  final String category;
  final double price;
  final String description;
  final String imageUrl;
  final String sellerId;
  final String sellerName;
  final DateTime timestamp;
  final int stock;

  ProductModel({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.description,
    required this.imageUrl,
    required this.sellerId,
    required this.sellerName,
    required this.timestamp,
    required this.stock,
  });

  factory ProductModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ProductModel(
      id: doc.id,
      name: data['name'] ?? '',
      category: data['category'] ?? '',
      price: (data['price'] ?? 0).toDouble(),
      description: data['description'] ?? '',
      imageUrl: data['image_url'] ?? '',
      sellerId: data['seller_id'] ?? '',
      sellerName: data['seller_name'] ?? '',
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      stock: data['stock'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'category': category,
      'price': price,
      'description': description,
      'image_url': imageUrl,
      'seller_id': sellerId,
      'seller_name': sellerName,
      'timestamp': Timestamp.fromDate(timestamp),
      'stock': stock,
    };
  }

  ProductModel copyWith({
    String? id,
    String? name,
    String? category,
    double? price,
    String? description,
    String? imageUrl,
    String? sellerId,
    String? sellerName,
    DateTime? timestamp,
    int? stock,
  }) {
    return ProductModel(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      price: price ?? this.price,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      sellerId: sellerId ?? this.sellerId,
      sellerName: sellerName ?? this.sellerName,
      timestamp: timestamp ?? this.timestamp,
      stock: stock ?? this.stock,
    );
  }
}
