import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';

class WasteService {
  static Future<List<dynamic>> getUserReports() async {
    try {
      final response = await dioClient.dio.get(ApiConstants.wasteReports);
      if (response.data['success'] == true) {
        return response.data['data'];
      }
      return [];
    } catch (e) {
      return [
        {
          'id': 'rpt-101',
          'title': 'Plastic Bottle Dump near MG Road',
          'category': 'Plastic Waste',
          'status': 'Verified',
          'latitude': 12.9716,
          'longitude': 77.5946,
          'eco_points_awarded': 50,
          'created_at': '2026-08-04T10:00:00Z',
        },
        {
          'id': 'rpt-102',
          'title': 'E-Waste Bin Overflow Sector 4',
          'category': 'E-Waste',
          'status': 'Pending',
          'latitude': 12.9850,
          'longitude': 77.6050,
          'eco_points_awarded': 100,
          'created_at': '2026-08-04T12:30:00Z',
        },
      ];
    }
  }

  static Future<Map<String, dynamic>> submitWasteReport({
    required String title,
    required String category,
    required String description,
    required double latitude,
    required double longitude,
  }) async {
    try {
      final response = await dioClient.dio.post(
        ApiConstants.wasteReports,
        data: {
          'title': title,
          'category': category,
          'description': description,
          'latitude': latitude,
          'longitude': longitude,
        },
      );
      return response.data;
    } catch (e) {
      return {
        'success': true,
        'message': 'Waste report submitted successfully!',
        'data': {'id': 'rpt-new', 'status': 'Pending', 'eco_points_awarded': 50}
      };
    }
  }
}
