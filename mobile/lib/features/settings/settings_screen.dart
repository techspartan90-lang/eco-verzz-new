import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/storage/secure_storage_service.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('App Settings & Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const ListTile(
            leading: Icon(Icons.person, color: AppColors.primaryGreen),
            title: Text('Arjun Sharma', style: TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
            subtitle: Text('citizen@ecoverzz.ai', style: TextStyle(color: AppColors.textMuted)),
          ),
          const Divider(color: AppColors.cardDark),
          SwitchListTile(
            value: true,
            onChanged: (val) {},
            activeThumbColor: AppColors.primaryGreen,
            title: const Text('Dark Mode Theme', style: TextStyle(color: AppColors.textLight)),
            subtitle: const Text('Material 3 HSL Dark Mode active', style: TextStyle(color: AppColors.textMuted)),
          ),
          SwitchListTile(
            value: true,
            onChanged: (val) {},
            activeThumbColor: AppColors.primaryGreen,
            title: const Text('Push Notifications & FCM Alerts', style: TextStyle(color: AppColors.textLight)),
            subtitle: const Text('Receive real-time emergency & report updates', style: TextStyle(color: AppColors.textMuted)),
          ),
          const ListTile(
            leading: Icon(Icons.security, color: AppColors.accentBlue),
            title: Text('Biometric Authentication', style: TextStyle(color: AppColors.textLight)),
            subtitle: Text('FaceID / Fingerprint security login', style: TextStyle(color: AppColors.textMuted)),
            trailing: Icon(Icons.chevron_right, color: AppColors.textMuted),
          ),
          const ListTile(
            leading: Icon(Icons.cloud_sync, color: AppColors.accentAmber),
            title: Text('Offline Database Sync Status', style: TextStyle(color: AppColors.textLight)),
            subtitle: Text('Background synchronization active', style: TextStyle(color: AppColors.textMuted)),
            trailing: Icon(Icons.check_circle, color: AppColors.primaryGreen),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () async {
              await SecureStorageService.clearAll();
              if (context.mounted) {
                context.go('/login');
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            icon: const Icon(Icons.logout, color: Colors.white),
            label: const Text('Log Out Account', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
