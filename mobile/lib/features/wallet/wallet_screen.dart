import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../services/wallet_service.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  Map<String, dynamic>? _walletData;

  @override
  void initState() {
    super.initState();
    _loadWallet();
  }

  void _loadWallet() async {
    final data = await WalletService.getWalletBalance();
    setState(() => _walletData = data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Wallet & Carbon Credits'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined),
            onPressed: () => context.push('/marketplace'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                color: AppColors.primaryDarkGreen,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Web3 Wallet Address', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      Text(
                        _walletData?['wallet_address'] ?? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Eco Points', style: TextStyle(color: Colors.white70)),
                              Text(
                                '${_walletData?['eco_points_balance'] ?? 640}',
                                style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Carbon Credits', style: TextStyle(color: Colors.white70)),
                              Text(
                                '${_walletData?['carbon_credits_balance'] ?? 15.5} tCO2e',
                                style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text('Recent Blockchain Transactions', style: TextStyle(color: AppColors.textLight, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              _buildTxItem('Plastic Recycling Verified', '+50 Eco Points', '2026-08-04', Icons.add_circle, AppColors.primaryGreen),
              _buildTxItem('Bamboo Cutlery Redemption', '-150 Eco Points', '2026-08-04', Icons.remove_circle, Colors.redAccent),
              _buildTxItem('Carbon Offset NFT Minted', '+2.5 tCO2e', '2026-08-03', Icons.eco, AppColors.accentAmber),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTxItem(String title, String amount, String date, IconData icon, Color color) {
    return Card(
      color: AppColors.cardDark,
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: Icon(icon, color: color),
        title: Text(title, style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
        subtitle: Text(date, style: const TextStyle(color: AppColors.textMuted)),
        trailing: Text(amount, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 15)),
      ),
    );
  }
}
