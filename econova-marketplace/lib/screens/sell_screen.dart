import 'dart:io';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:image_picker/image_picker.dart';
import '../models/product_model.dart';
import '../services/firestore_service.dart';
import '../services/storage_service.dart';
import '../services/auth_service.dart';
import '../utils/color_theme.dart';
import '../utils/constants.dart';
import '../widgets/animated_button.dart';

class SellScreen extends StatefulWidget {
  const SellScreen({super.key});

  @override
  State<SellScreen> createState() => _SellScreenState();
}

class _SellScreenState extends State<SellScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _stockController = TextEditingController();
  final _firestoreService = FirestoreService();
  final _storageService = StorageService();
  final _authService = AuthService();
  
  String _selectedCategory = AppConstants.categories[0];
  File? _selectedImage;
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );

    if (pickedFile != null) {
      setState(() {
        _selectedImage = File(pickedFile.path);
      });
    }
  }

  Future<void> _handlePublish() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedImage == null) {
      Fluttertoast.showToast(
        msg: AppStrings.imageRequired,
        backgroundColor: AppColors.error,
        textColor: Colors.white,
      );
      return;
    }

    final currentUser = FirebaseAuth.instance.currentUser;
    if (currentUser == null) return;

    setState(() => _isLoading = true);

    try {
      // Get user data
      final userData = await _authService.getUserData(currentUser.uid);
      
      // Upload image
      final imageUrl = await _storageService.uploadProductImage(
        _selectedImage!,
        '${currentUser.uid}_${DateTime.now().millisecondsSinceEpoch}.jpg',
      );

      // Create product
      final product = ProductModel(
        id: '',
        name: _nameController.text.trim(),
        category: _selectedCategory,
        price: double.parse(_priceController.text),
        description: _descriptionController.text.trim(),
        imageUrl: imageUrl,
        sellerId: currentUser.uid,
        sellerName: userData?.username ?? 'Unknown',
        timestamp: DateTime.now(),
        stock: int.parse(_stockController.text),
      );

      await _firestoreService.addProduct(product);

      if (mounted) {
        Fluttertoast.showToast(
          msg: AppStrings.productPublished,
          backgroundColor: AppColors.success,
          textColor: Colors.white,
        );

        // Clear form
        _nameController.clear();
        _descriptionController.clear();
        _priceController.clear();
        _stockController.clear();
        setState(() {
          _selectedImage = null;
          _selectedCategory = AppConstants.categories[0];
        });
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Error: ${e.toString()}',
        backgroundColor: AppColors.error,
        textColor: Colors.white,
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sell Product'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Image Picker
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AppColors.primaryOrange.withOpacity(0.3),
                      width: 2,
                    ),
                    image: _selectedImage != null
                        ? DecorationImage(
                            image: FileImage(_selectedImage!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: _selectedImage == null
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.add_photo_alternate,
                              size: 60,
                              color: AppColors.primaryOrange.withOpacity(0.6),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              AppStrings.selectImage,
                              style: TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        )
                      : null,
                ),
              ),
              const SizedBox(height: 24),
              // Product Name
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: AppStrings.productName,
                  prefixIcon: Icon(Icons.inventory_2),
                ),
                maxLength: AppConstants.maxProductNameLength,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return AppStrings.productNameRequired;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              // Category Dropdown
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: AppStrings.category,
                  prefixIcon: Icon(Icons.category),
                ),
                items: AppConstants.categories.map((category) {
                  return DropdownMenuItem(
                    value: category,
                    child: Text(category),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedCategory = value);
                  }
                },
              ),
              const SizedBox(height: 16),
              // Price
              TextFormField(
                controller: _priceController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  labelText: AppStrings.price,
                  prefixIcon: Icon(Icons.attach_money),
                  hintText: '0.00',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return AppStrings.priceRequired;
                  }
                  if (double.tryParse(value) == null) {
                    return AppStrings.priceInvalid;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              // Stock
              TextFormField(
                controller: _stockController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: AppStrings.stock,
                  prefixIcon: Icon(Icons.inventory),
                  hintText: '0',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return AppStrings.stockRequired;
                  }
                  if (int.tryParse(value) == null) {
                    return AppStrings.stockInvalid;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              // Description
              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                maxLength: AppConstants.maxDescriptionLength,
                decoration: const InputDecoration(
                  labelText: AppStrings.description,
                  prefixIcon: Icon(Icons.description),
                  alignLabelWithHint: true,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Description is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),
              // Publish Button
              AnimatedButton(
                text: AppStrings.publishProduct,
                onPressed: _handlePublish,
                isLoading: _isLoading,
                icon: Icons.publish,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
