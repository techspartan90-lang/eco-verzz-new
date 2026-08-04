import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../services/iot_service.dart';

class IoTDashboardScreen extends StatefulWidget {
  const IoTDashboardScreen({Key? key}) : super(key: key);

  @override
  State<IoTDashboardScreen> createState() => _IoTDashboardScreenState();
}

class _IoTDashboardScreenState extends State<IoTDashboardScreen> {
  List<dynamic> _devices = [];

  @override
  void initState() {
    super.initState();
    _loadDevices();
  }

  void _loadDevices() async {
    final devList = await IoTService.getIoTDevices();
    setState(() => _devices = devList);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('IoT Devices & Telemetry')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _devices.length,
        itemBuilder: (context, index) {
          final d = _devices[index];
          return Card(
            color: AppColors.cardDark,
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: AppColors.primaryGreen,
                child: Icon(Icons.sensors, color: Colors.white),
              ),
              title: Text(d['device_name'] ?? 'Smart Sensor', style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
              subtitle: Text('${d['device_type']} • Battery: ${d['battery_level']}%', style: const TextStyle(color: AppColors.textMuted)),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primaryGreen.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(d['status'] ?? 'Online', style: const TextStyle(color: AppColors.primaryGreen, fontWeight: FontWeight.bold)),
              ),
            ),
          );
        },
      ),
    );
  }
}
