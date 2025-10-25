import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'dart:io';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  
  // Upload image to Firebase Storage
  Future<String> uploadImage(File imageFile, String userId) async {
    try {
      final fileName = '${userId}_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage.ref().child('pollution_reports/$fileName');
      
      await ref.putFile(imageFile);
      final url = await ref.getDownloadURL();
      
      return url;
    } catch (e) {
      throw 'Failed to upload image: $e';
    }
  }
  
  // Save pollution report to Firestore
  Future<void> saveReport({
    required String userId,
    required String imageUrl,
    required String pollutionType,
    required double dangerLevel,
    required double latitude,
    required double longitude,
  }) async {
    try {
      await _firestore.collection('requests').add({
        'user_id': userId,
        'image_url': imageUrl,
        'pollution_type': pollutionType,
        'danger_level': dangerLevel,
        'latitude': latitude,
        'longitude': longitude,
        'timestamp': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw 'Failed to save report: $e';
    }
  }
  
  // Get all pollution reports
  Stream<QuerySnapshot> getReports() {
    return _firestore
        .collection('requests')
        .orderBy('timestamp', descending: true)
        .snapshots();
  }
  
  // Get reports for map (all records)
  Future<List<Map<String, dynamic>>> getMapReports() async {
    try {
      final snapshot = await _firestore.collection('requests').get();
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return data;
      }).toList();
    } catch (e) {
      throw 'Failed to fetch reports: $e';
    }
  }
}
