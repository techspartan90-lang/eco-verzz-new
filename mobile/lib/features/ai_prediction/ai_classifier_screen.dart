import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../services/ai_service.dart';
import '../../shared/widgets/custom_button.dart';

class AIClassifierScreen extends StatefulWidget {
  const AIClassifierScreen({Key? key}) : super(key: key);

  @override
  State<AIClassifierScreen> createState() => _AIClassifierScreenState();
}

class _AIClassifierScreenState extends State<AIClassifierScreen> {
  bool _isAnalyzing = false;
  Map<String, dynamic>? _result;

  void _runClassification() async {
    setState(() => _isAnalyzing = true);
    final res = await AIService.classifyWasteImage('demo.jpg');
    setState(() {
      _isAnalyzing = false;
      _result = res;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Waste Classifier')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: AppColors.cardDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.accentAmber, width: 2),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.psychology, size: 64, color: AppColors.accentAmber),
                  SizedBox(height: 8),
                  Text('YOLOv8 & OpenCV Classification Engine', style: TextStyle(color: AppColors.textMuted)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            CustomButton(
              text: 'Scan & Classify Waste Image',
              onPressed: _runClassification,
              isLoading: _isAnalyzing,
              icon: Icons.search_outlined,
            ),
            const SizedBox(height: 24),
            if (_result != null) ...[
              Card(
                color: AppColors.cardDark,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _result!['detected_category'] ?? 'Plastic Waste',
                        style: const TextStyle(color: AppColors.primaryGreen, fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text('Confidence Score: ${((_result!['confidence_score'] ?? 0.96) * 100).toStringAsFixed(1)}%', style: const TextStyle(color: AppColors.textLight)),
                      Text('Recyclability: ${_result!['recyclability_grade'] ?? 'Grade A'}', style: const TextStyle(color: AppColors.textLight)),
                      Text('Est. Carbon Savings: ${_result!['estimated_carbon_savings_kg']} kg CO2', style: const TextStyle(color: AppColors.accentAmber)),
                      Text('Eco Points Reward: +${_result!['recommended_eco_points']} Points', style: const TextStyle(color: AppColors.primaryGreen, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
