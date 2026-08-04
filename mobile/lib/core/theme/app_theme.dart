import 'package:flutter/material.dart';

class AppColors {
  static const Color primaryGreen = Color(0xFF10B981);
  static const Color primaryDarkGreen = Color(0xFF059669);
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color cardDark = Color(0xFF1E293B);
  static const Color textLight = Color(0xFFF8FAFC);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color accentBlue = Color(0xFF3B82F6);
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData.dark(useMaterial3: true).copyWith(
      scaffoldBackgroundColor: AppColors.darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryGreen,
        secondary: AppColors.accentAmber,
        surface: AppColors.cardDark,
        background: AppColors.darkBackground,
      ),
      cardTheme: CardTheme(
        color: AppColors.cardDark,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.cardDark,
        elevation: 0,
        centerTitle: true,
      ),
    );
  }
}
