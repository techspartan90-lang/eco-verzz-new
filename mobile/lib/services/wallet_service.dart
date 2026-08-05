import '../core/constants/api_constants.dart';
import '../core/network/dio_client.dart';

class WalletService {
  static Future<Map<String, dynamic>> getWalletBalance() async {
    try {
      final response = await dioClient.dio.get(ApiConstants.walletBalance);
      return response.data['data'];
    } catch (e) {
      return {
        'wallet_address': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        'eco_points_balance': 640,
        'carbon_credits_balance': 15.5,
      };
    }
  }

  static Future<List<dynamic>> getMarketplaceItems() async {
    try {
      final response = await dioClient.dio.get(ApiConstants.marketplace);
      return response.data['data'];
    } catch (e) {
      return [
        {'id': 'mkt-1', 'item_name': 'Bamboo Cutlery Set', 'category': 'Eco Products', 'points_price': 150},
        {'id': 'mkt-2', 'item_name': '25% Off Organic Grocery Coupon', 'category': 'Discount Coupons', 'points_price': 200},
        {'id': 'mkt-3', 'item_name': 'Plant 5 Native Trees (Carbon Offset)', 'category': 'Tree Sponsorship', 'points_price': 300},
      ];
    }
  }
}
