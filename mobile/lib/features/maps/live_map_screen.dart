import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../services/iot_service.dart';

class LiveMapScreen extends StatefulWidget {
  const LiveMapScreen({Key? key}) : super(key: key);

  @override
  State<LiveMapScreen> createState() => _LiveMapScreenState();
}

class _LiveMapScreenState extends State<LiveMapScreen> {
  Map<String, dynamic>? _gisData;

  @override
  void initState() {
    super.initState();
    _loadMap();
  }

  void _loadMap() async {
    final data = await IoTService.getLiveGISMapData();
    setState(() => _gisData = data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Smart City GIS Live Map')),
      body: Column(
        children: [
          Expanded(
            child: Container(
              color: AppColors.cardDark,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.map_outlined, size: 80, color: AppColors.accentBlue),
                    SizedBox(height: 12),
                    Text('OpenStreetMap & Leaflet Interactive GIS Layer', style: TextStyle(color: AppColors.textLight, fontSize: 16, fontWeight: FontWeight.bold)),
                    Text('Central Urban District • Lat: 12.9716, Lon: 77.5946', style: TextStyle(color: AppColors.textMuted)),
                  ],
                ),
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            color: AppColors.cardDark,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildMapStat('Vehicles', '${_gisData?['live_vehicles_count'] ?? 4}', Icons.local_shipping),
                _buildMapStat('Heatmap Pts', '${_gisData?['heatmap_points_count'] ?? 12}', Icons.fireplace),
                _buildMapStat('Recycling Hubs', '${_gisData?['recycling_centers_count'] ?? 3}', Icons.store),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapStat(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primaryGreen),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 18)),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
      ],
    );
  }
}
