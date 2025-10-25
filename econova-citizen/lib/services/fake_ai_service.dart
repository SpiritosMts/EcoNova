import 'dart:io';
import 'dart:math';

class FakeAIService {
  // Simulate AI analysis with fake delay and random results
  Future<Map<String, dynamic>> analyzeImage(File image) async {
    // Simulate processing time
    await Future.delayed(const Duration(seconds: 4));
    
    final types = ["Air", "Water", "Waste"];
    final random = Random();
    
    // Generate random pollution type
    final type = types[random.nextInt(types.length)];
    
    // Generate danger level (20-100 range for variety)
    final danger = (20 + random.nextInt(81)).toDouble();
    
    return {
      "type": type,
      "danger": danger,
    };
  }
  
  // Get loading messages for UI
  List<String> getLoadingMessages() {
    return [
      "Analyzing pollution type...",
      "Checking location safety...",
      "Detecting danger level...",
      "Finalizing report...",
    ];
  }
}
