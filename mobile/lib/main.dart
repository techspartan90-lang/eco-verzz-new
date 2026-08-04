import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'core/theme/app_theme.dart';
import 'features/authentication/login_screen.dart';
import 'features/authentication/register_screen.dart';
import 'features/dashboard/dashboard_screen.dart';
import 'features/waste_reporting/report_waste_screen.dart';
import 'features/ai_prediction/ai_classifier_screen.dart';
import 'features/iot/iot_dashboard_screen.dart';
import 'features/maps/live_map_screen.dart';
import 'features/wallet/wallet_screen.dart';
import 'features/wallet/marketplace_screen.dart';
import 'features/notifications/notifications_screen.dart';
import 'features/settings/settings_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/dashboard',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/dashboard', builder: (context, state) => const DashboardScreen()),
      GoRoute(path: '/report-waste', builder: (context, state) => const ReportWasteScreen()),
      GoRoute(path: '/ai-classifier', builder: (context, state) => const AIClassifierScreen()),
      GoRoute(path: '/iot', builder: (context, state) => const IoTDashboardScreen()),
      GoRoute(path: '/live-map', builder: (context, state) => const LiveMapScreen()),
      GoRoute(path: '/wallet', builder: (context, state) => const WalletScreen()),
      GoRoute(path: '/marketplace', builder: (context, state) => const MarketplaceScreen()),
      GoRoute(path: '/notifications', builder: (context, state) => const NotificationsScreen()),
      GoRoute(path: '/settings', builder: (context, state) => const SettingsScreen()),
    ],
  );
});

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: EcoVerzzApp(),
    ),
  );
}

class EcoVerzzApp extends ConsumerWidget {
  const EcoVerzzApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'EcoVerzz AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark,
      routerConfig: router,
    );
  }
}
