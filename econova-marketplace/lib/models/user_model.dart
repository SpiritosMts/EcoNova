import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String email;
  final String username;
  final String role;
  final DateTime createdAt;

  UserModel({
    required this.uid,
    required this.email,
    required this.username,
    required this.role,
    required this.createdAt,
  });

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      uid: doc.id,
      email: data['email'] ?? '',
      username: data['username'] ?? '',
      role: data['role'] ?? 'buyer',
      createdAt: (data['created_at'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'email': email,
      'username': username,
      'role': role,
      'created_at': Timestamp.fromDate(createdAt),
    };
  }
}
