import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';

class IoTService {
  static Future<Map<String, dynamic>> getLiveGISMapData() async {
    try {
      final response = await dioClient.dio.get(ApiConstants.liveMap);
      return response.data['data'];
    } catch (e) {
      return {
        'live_vehicles_count': 4,
        'heatmap_points_count': 12,
        'recycling_centers_count': 3,
        'avg_aqi': 42.5,
      };
    }
  }

  static Future<List<dynamic>> getIoTDevices() async {
    try {
      final response = await dioClient.dio.get(ApiConstants.iotDevices);
      return response.data['data'];
    } catch (e) {
      return [
        {'device_name': 'Smart Dustbin MG Road #1', 'device_type': 'Smart Dustbin', 'status': 'Online', 'battery_level': 92},
        {'device_name': 'Air Quality Sensor Sector 2', 'device_type': 'Air Quality Sensor', 'status': 'Online', 'battery_level': 88},
      ];
    }
  }
}
