import 'package:flutter/material.dart';

class AppColors {
  // EcoNova gradient colors
  static const Color primaryGreen = Color(0xFF3DD598);
  static const Color primaryBlue = Color(0xFF2F80ED);
  
  // Danger level colors
  static const Color moderate = Color(0xFFFFD700); // Yellow
  static const Color warning = Color(0xFFFFA500);  // Orange
  static const Color critical = Color(0xFFFF0000); // Red
  
  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryGreen, primaryBlue],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  // Background
  static const Color background = Color(0xFFF5F7FA);
  static const Color cardBackground = Colors.white;
  
  // Text
  static const Color textPrimary = Color(0xFF2D3748);
  static const Color textSecondary = Color(0xFF718096);
}

ThemeData getAppTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.primaryGreen,
      primary: AppColors.primaryGreen,
      secondary: AppColors.primaryBlue,
    ),
    scaffoldBackgroundColor: AppColors.background,
    fontFamily: 'Inter',
    cardTheme: CardThemeData(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      color: AppColors.cardBackground,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 4,
      ),
    ),
  );
}
