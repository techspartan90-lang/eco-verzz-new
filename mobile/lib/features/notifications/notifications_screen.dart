import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Real-Time Notifications')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          NotificationTile(
            title: '🚨 Emergency Warning: Urban Flood Alert',
            body: 'High rainfall predicted in District 1. High-risk zones evacuated.',
            time: '10 mins ago',
            isEmergency: true,
          ),
          NotificationTile(
            title: 'Report Verified: Plastic Waste Dump',
            body: 'Your submitted report has been verified by Admin. +50 Eco Points awarded!',
            time: '1 hour ago',
            isEmergency: false,
          ),
          NotificationTile(
            title: 'Carbon Credit NFT Minted',
            body: 'Tree Plantation offset certificate minted on Polygon blockchain.',
            time: '3 hours ago',
            isEmergency: false,
          ),
        ],
      ),
    );
  }
}

class NotificationTile extends StatelessWidget {
  final String title;
  final String body;
  final String time;
  final bool isEmergency;

  const NotificationTile({
    Key? key,
    required this.title,
    required this.body,
    required this.time,
    required this.isEmergency,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: isEmergency ? Colors.red.withOpacity(0.2) : AppColors.cardDark,
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      color: isEmergency ? Colors.redAccent : AppColors.textLight,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                Text(time, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 8),
            Text(body, style: const TextStyle(color: AppColors.textMuted)),
          ],
        ),
      ),
    );
  }
}
