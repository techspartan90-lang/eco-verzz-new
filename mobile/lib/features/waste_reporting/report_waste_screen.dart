import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../services/waste_service.dart';
import '../../shared/widgets/custom_button.dart';
import '../../shared/widgets/custom_text_field.dart';

class ReportWasteScreen extends StatefulWidget {
  const ReportWasteScreen({Key? key}) : super(key: key);

  @override
  State<ReportWasteScreen> createState() => _ReportWasteScreenState();
}

class _ReportWasteScreenState extends State<ReportWasteScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCategory = 'Plastic Waste';
  bool _isLoading = false;

  void _submitReport() async {
    setState(() => _isLoading = true);
    await WasteService.submitWasteReport(
      title: _titleController.text.isEmpty ? 'Waste Dumping Report' : _titleController.text,
      category: _selectedCategory,
      description: _descController.text,
      latitude: 12.9716,
      longitude: 77.5946,
    );
    setState(() => _isLoading = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Waste report submitted! +50 Eco Points awarded.')),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Smart Waste Reporting')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                height: 180,
                decoration: BoxDecoration(
                  color: AppColors.cardDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryGreen, width: 1.5),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.camera_alt_outlined, size: 48, color: AppColors.primaryGreen),
                    SizedBox(height: 8),
                    Text('Tap to Capture or Upload Image', style: TextStyle(color: AppColors.textMuted)),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              CustomTextField(
                labelText: 'Report Title',
                controller: _titleController,
                prefixIcon: Icons.title,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                dropdownColor: AppColors.cardDark,
                style: const TextStyle(color: AppColors.textLight),
                decoration: InputDecoration(
                  labelText: 'Waste Category',
                  filled: true,
                  fillColor: AppColors.cardDark,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: ['Plastic Waste', 'E-Waste', 'Organic Waste', 'Paper & Glass', 'Hazardous']
                    .map((cat) => DropdownMenuItem(value: cat, child: Text(cat)))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                labelText: 'Description / Notes',
                controller: _descController,
                prefixIcon: Icons.description,
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: 'Submit Waste Report',
                onPressed: _submitReport,
                isLoading: _isLoading,
                icon: Icons.send,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
