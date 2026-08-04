import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/stat_card.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('EcoVerzz Citizen Hub'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.push('/notifications'),
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Welcome back, Arjun! 👋',
              style: TextStyle(color: AppColors.textLight, fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const Text(
              'District 1 - Central Urban Zone',
              style: TextStyle(color: AppColors.textMuted, fontSize: 14),
            ),
            const SizedBox(height: 20),

            // Stat Cards Grid
            const StatCard(
              title: 'Eco Points Balance',
              value: '640 Points',
              icon: Icons.stars,
              iconColor: AppColors.primaryGreen,
            ),
            const StatCard(
              title: 'Carbon Offset (tCO2e)',
              value: '15.5 Tons',
              icon: Icons.eco,
              iconColor: AppColors.accentAmber,
            ),
            const StatCard(
              title: 'Verified Reports',
              value: '12 Reports',
              icon: Icons.verified_user,
              iconColor: AppColors.accentBlue,
            ),

            const SizedBox(height: 24),
            const Text(
              'Quick Smart Actions',
              style: TextStyle(color: AppColors.textLight, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: ActionTile(
                    title: 'Report Waste',
                    icon: Icons.camera_alt,
                    color: AppColors.primaryGreen,
                    onTap: () => context.push('/report-waste'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ActionTile(
                    title: 'AI Classifier',
                    icon: Icons.psychology,
                    color: AppColors.accentAmber,
                    onTap: () => context.push('/ai-classifier'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ActionTile(
                    title: 'Live GIS Map',
                    icon: Icons.map,
                    color: AppColors.accentBlue,
                    onTap: () => context.push('/live-map'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ActionTile(
                    title: 'Eco Marketplace',
                    icon: Icons.shopping_bag,
                    color: Colors.purpleAccent,
                    onTap: () => context.push('/marketplace'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        backgroundColor: AppColors.cardDark,
        selectedItemColor: AppColors.primaryGreen,
        unselectedItemColor: AppColors.textMuted,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          if (index == 1) context.push('/report-waste');
          if (index == 2) context.push('/live-map');
          if (index == 3) context.push('/wallet');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.add_a_photo), label: 'Report'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'GIS Map'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
        ],
      ),
    );
  }
}

class ActionTile extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const ActionTile({
    Key? key,
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.cardDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 36, color: color),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
