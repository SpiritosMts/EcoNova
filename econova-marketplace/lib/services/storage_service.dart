import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import '../utils/constants.dart';

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // Upload product image
  Future<String> uploadProductImage(File imageFile, String fileName) async {
    try {
      final ref = _storage
          .ref()
          .child(AppConstants.productImagesPath)
          .child('${DateTime.now().millisecondsSinceEpoch}_$fileName');

      final uploadTask = await ref.putFile(imageFile);
      final downloadUrl = await uploadTask.ref.getDownloadURL();

      return downloadUrl;
    } catch (e) {
      rethrow;
    }
  }

  // Delete image
  Future<void> deleteImage(String imageUrl) async {
    try {
      final ref = _storage.refFromURL(imageUrl);
      await ref.delete();
    } catch (e) {
      rethrow;
    }
  }

  // Upload multiple images
  Future<List<String>> uploadMultipleImages(List<File> imageFiles) async {
    try {
      final List<String> downloadUrls = [];

      for (int i = 0; i < imageFiles.length; i++) {
        final url = await uploadProductImage(
          imageFiles[i],
          'image_$i.jpg',
        );
        downloadUrls.add(url);
      }

      return downloadUrls;
    } catch (e) {
      rethrow;
    }
  }
}
