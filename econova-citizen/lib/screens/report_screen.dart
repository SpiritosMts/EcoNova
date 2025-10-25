import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/fake_ai_service.dart';
import '../services/firestore_service.dart';
import '../services/location_service.dart';
import '../services/auth_service.dart';
import '../widgets/pollution_card.dart';
import '../widgets/loading_dialog.dart';
import '../utils/color_theme.dart';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  final _imagePicker = ImagePicker();
  final _aiService = FakeAIService();
  final _firestoreService = FirestoreService();
  final _locationService = LocationService();
  final _authService = AuthService();

  File? _selectedImage;
  String? _pollutionType;
  double? _dangerLevel;
  bool _isAnalyzed = false;

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _imagePicker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
          _isAnalyzed = false;
          _pollutionType = null;
          _dangerLevel = null;
        });
        _analyzeImage();
      }
    } catch (e) {
      _showError('Failed to pick image: $e');
    }
  }

  Future<void> _analyzeImage() async {
    if (_selectedImage == null) return;

    showLoadingDialog(context, _aiService.getLoadingMessages());

    try {
      final result = await _aiService.analyzeImage(_selectedImage!);

      if (mounted) {
        Navigator.pop(context); // Close loading dialog

        setState(() {
          _pollutionType = result['type'];
          _dangerLevel = result['danger'];
          _isAnalyzed = true;
        });
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context);
        _showError('Analysis failed: $e');
      }
    }
  }

  Future<void> _sendReport() async {
    if (_selectedImage == null || _pollutionType == null || _dangerLevel == null) {
      return;
    }

    try {
      // Show loading
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      // Get location
      final position = await _locationService.getCurrentPosition();

      // Upload image
      final imageUrl = await _firestoreService.uploadImage(
        _selectedImage!,
        _authService.currentUser!.uid,
      );

      // Save report
      await _firestoreService.saveReport(
        userId: _authService.currentUser!.uid,
        imageUrl: imageUrl,
        pollutionType: _pollutionType!,
        dangerLevel: _dangerLevel!,
        latitude: position.latitude,
        longitude: position.longitude,
      );

      if (mounted) {
        Navigator.pop(context); // Close loading

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Report sent successfully!'),
            backgroundColor: Colors.green,
          ),
        );

        // Reset state
        setState(() {
          _selectedImage = null;
          _pollutionType = null;
          _dangerLevel = null;
          _isAnalyzed = false;
        });
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context);
        _showError('Failed to send report: $e');
      }
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _showImageSourceDialog() {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Take Photo'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Choose from Gallery'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Icon(
                      Icons.eco,
                      size: 64,
                      color: AppColors.primaryGreen,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Report Pollution',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Help protect our environment by reporting pollution',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            if (_selectedImage != null) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(
                  _selectedImage!,
                  height: 300,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 24),
            ],
            if (_isAnalyzed && _pollutionType != null && _dangerLevel != null) ...[
              PollutionCard(
                pollutionType: _pollutionType!,
                dangerLevel: _dangerLevel!,
                onSendReport: _sendReport,
              ),
              const SizedBox(height: 16),
            ],
            ElevatedButton.icon(
              onPressed: _showImageSourceDialog,
              icon: const Icon(Icons.camera_alt),
              label: Text(_selectedImage == null ? 'Take Photo' : 'Take Another Photo'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryGreen,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
