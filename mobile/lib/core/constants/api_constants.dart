class ApiConstants {
  // Auth Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String profile = '/users/me';

  // Waste Reporting
  static const String wasteReports = '/waste';
  static const String uploadWasteImage = '/waste/upload';

  // AI Classification Engine
  static const String aiClassify = '/ai/classify';

  // IoT Devices & GIS Maps
  static const String iotDevices = '/iot/device';
  static const String liveMap = '/map/live';
  static const String mapVehicles = '/map/vehicles';
  static const String mapHeatmap = '/map/heatmap';

  // Digital Wallet & Rewards Marketplace
  static const String wallet = '/wallet';
  static const String walletBalance = '/wallet/balance';
  static const String marketplace = '/marketplace';
  static const String redeemReward = '/rewards/redeem';
  static const String mintCarbonCredit = '/blockchain/mint';

  // Analytics & Forecasts
  static const String analyticsDashboard = '/analytics/dashboard';
  static const String wasteForecast = '/forecast/waste';
  static const String notifications = '/notifications';
}
