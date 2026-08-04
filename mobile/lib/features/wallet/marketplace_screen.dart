import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../services/wallet_service.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({Key? key}) : super(key: key);

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  List<dynamic> _items = [];

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  void _loadItems() async {
    final list = await WalletService.getMarketplaceItems();
    setState(() => _items = list);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Eco Rewards Marketplace')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _items.length,
        itemBuilder: (context, index) {
          final item = _items[index];
          return Card(
            color: AppColors.cardDark,
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: AppColors.accentAmber,
                child: Icon(Icons.card_giftcard, color: Colors.white),
              ),
              title: Text(item['item_name'] ?? 'Eco Reward', style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
              subtitle: Text(item['category'] ?? 'Category', style: const TextStyle(color: AppColors.textMuted)),
              trailing: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Redeemed ${item['item_name']}! QR Voucher generated.')),
                  );
                },
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryGreen),
                child: Text('${item['points_price']} Pts'),
              ),
            ),
          );
        },
      ),
    );
  }
}
