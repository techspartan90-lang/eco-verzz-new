import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class SchemesHubScreen extends StatefulWidget {
  const SchemesHubScreen({super.key});

  @override
  State<SchemesHubScreen> createState() => _SchemesHubScreenState();
}

class _SchemesHubScreenState extends State<SchemesHubScreen> {
  String _searchQuery = "";
  final List<Map<String, dynamic>> _schemes = [
    {
      "name": "life",
      "title": "Mission LiFE",
      "subtitle": "Lifestyle for Environment",
      "ministry": "MoEFCC",
      "color": Colors.emeraldAccent,
      "desc": "PM's flagship global mass movement to nudge citizens towards environment-friendly sustainable habits.",
      "objectives": "Track and reward daily eco-challenges, saving carbon aggregates.",
      "eligibility": "All citizens globally.",
      "benefits": "Earn EcoPoints, unlock Carbon Credit tokens, and download Pro-Planet certificates.",
    },
    {
      "name": "swachhbharat",
      "title": "Swachh Bharat Mission",
      "subtitle": "Garbage-Free Cities",
      "ministry": "MoHUA / Jal Shakti",
      "color": Colors.amberAccent,
      "desc": "Cleanliness campaign focusing on solid waste management, public sanitation, and local dump reports.",
      "objectives": "100% door-to-door source segregated waste collection and municipal cleanliness audits.",
      "eligibility": "All residents and municipalities in India.",
      "benefits": "File cleanliness complaints mapped directly to regional wards.",
    },
    {
      "name": "cpcb",
      "title": "CPCB Portal",
      "subtitle": "National Pollution Monitors",
      "ministry": "MoEFCC",
      "color": Colors.roseAccent,
      "desc": "Monitors Air Quality Index (AQI), stream water pH, noise levels, and regional environmental warnings.",
      "objectives": "Enforce regulatory compliance on industrial units and provide live public health advisories.",
      "eligibility": "Public access to live monitors and incident logging.",
      "benefits": "Live AQI, prediction forecasts, and health warning alerts.",
    },
    {
      "name": "cpcb_epr",
      "title": "CPCB EPR Portal",
      "subtitle": "Extended Producer Responsibility",
      "ministry": "MoEFCC",
      "color": Colors.blueAccent,
      "desc": "Regulating circular waste streams for plastic, batteries, e-waste, and tire materials via recyclers.",
      "objectives": "Mandate circular targets on brand owners, producers, and waste recyclers.",
      "eligibility": "Registered PIBOs and recycling centers.",
      "benefits": "Locate local e-waste collection points and audit recyclers.",
    },
    {
      "name": "smartcities",
      "title": "Smart Cities Mission",
      "subtitle": "IoT-Enabled Municipalities",
      "ministry": "MoHUA",
      "color": Colors.purpleAccent,
      "desc": "Renewal program leveraging IoT for smart garbage bins, automated street lighting, and parking sensors.",
      "objectives": "Centralized command grid integration for cleaner urban governance.",
      "eligibility": "100 designated smart cities across India.",
      "benefits": "Access city IoT dashboards and report infrastructure repairs.",
    },
    {
      "name": "jaljeevan",
      "title": "Jal Jeevan Mission",
      "subtitle": "Har Ghar Jal tap water",
      "ministry": "Ministry of Jal Shakti",
      "color": Colors.cyanAccent,
      "desc": "Providing safe, regular, and adequate drinking water tap connections to every rural home.",
      "objectives": "Deliver 55 liters per capita daily of safe water with local groundwater mapping.",
      "eligibility": "Rural communities and village panchayats.",
      "benefits": "Report pipeline leakages and track village Pani Samiti statuses.",
    },
    {
      "name": "greenindia",
      "title": "National Mission for Green India",
      "subtitle": "Afforestation & Carbon Sink",
      "ministry": "MoEFCC",
      "color": Colors.lightGreenAccent,
      "desc": "Increasing national forest cover, restoring degraded woodlands, and promoting carbon sequestration.",
      "objectives": "Expand carbon sinks to absorb 100+ million tons of greenhouse gas emissions.",
      "eligibility": "Afforestation committees, non-profits, and volunteer tree planters.",
      "benefits": "Adopt a tree virtually, log plantation drives, and obtain green certificates.",
    },
    {
      "name": "ncap",
      "title": "National Clean Air Programme",
      "subtitle": "Non-Attainment Cities clean air",
      "ministry": "MoEFCC",
      "color": Colors.lightBlueAccent,
      "desc": "Enforces particulate matter reduction targets in 131 highly polluted cities.",
      "objectives": "Reduce PM2.5 and PM10 concentrations by 20-30% via regional action plans.",
      "eligibility": "Designated non-attainment city municipal zones.",
      "benefits": "Real-time PM2.5 tracking and city cleaning scorecards.",
    },
    {
      "name": "plasticwaste",
      "title": "Plastic Waste Rules",
      "subtitle": "Banning single-use plastics",
      "ministry": "MoEFCC",
      "color": Colors.orangeAccent,
      "desc": "Statutory ban on 19 identified single-use plastics and thickness regulations on bags.",
      "objectives": "Phase out low-utility, high-risk plastic packaging.",
      "eligibility": "All retailers, manufacturers, and citizens.",
      "benefits": "Locate alternatives and submit retail violation alerts.",
    },
    {
      "name": "energycons",
      "title": "Energy Conservation Campaign",
      "subtitle": "Solar & Efficiency BEE",
      "ministry": "Ministry of Power / MNRE",
      "color": Colors.yellowAccent,
      "desc": "Encouraging rooftop solar, BEE star-labeled appliances, and green building efficiency standards.",
      "objectives": "Reduce national energy footprint and lower grid load constraints.",
      "eligibility": "All agricultural, residential, and commercial sectors.",
      "benefits": "Rooftop solar subsidy calculator and appliance savings audits.",
    },
    {
      "name": "disaster",
      "title": "Disaster Preparedness",
      "subtitle": "Climate Emergency NDMA",
      "ministry": "NDMA / MHA",
      "color": Colors.redAccent,
      "desc": "Providing early warnings, survival kits, and evacuation drills for heatwaves and cyclones.",
      "objectives": "Nudge communities towards early-alert readiness to prevent casualty spikes.",
      "eligibility": "Open to all, specifically coastal and mountainous zones.",
      "benefits": "SMS warning alerts, survival checksheets, and helpline directories.",
    }
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _schemes.where((s) {
      final text = searchQuery.toLowerCase();
      return s['title']!.toLowerCase().contains(text) ||
          s['subtitle']!.toLowerCase().contains(text) ||
          s['ministry']!.toLowerCase().contains(text);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Government Schemes Hub'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (val) {
                setState(() {
                  _searchQuery = val;
                });
              },
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search schemes or ministries...',
                hintStyle: const TextStyle(color: Colors.grey),
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                filled: true,
                fillColor: AppColors.cardDark,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final scheme = filtered[index];
                return Card(
                  color: AppColors.cardDark,
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(
                      color: (scheme['color'] as Color).withValues(alpha: 0.15),
                    ),
                  ),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => _showSchemeDetails(context, scheme),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      key: ValueKey(scheme['name']),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                scheme['ministry']!,
                                style: const TextStyle(
                                  color: AppColors.textMuted,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.2,
                                ),
                              ),
                              Icon(Icons.arrow_forward_ios, size: 12, color: scheme['color']),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            scheme['title']!,
                            style: const TextStyle(
                              color: AppColors.textLight,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            scheme['subtitle']!,
                            style: TextStyle(
                              color: (scheme['color'] as Color),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            scheme['desc']!,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showSchemeDetails(BuildContext context, Map<String, dynamic> scheme) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: const BoxDecoration(
            color: AppColors.bgDark,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(28),
              topRight: Radius.circular(28),
            ),
          ),
          padding: const EdgeInsets.all(24),
          child: DefaultTabController(
            length: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 48,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  scheme['ministry']!,
                  style: const TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                  ),
                ),
                Text(
                  scheme['title']!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.black,
                  ),
                ),
                const SizedBox(height: 12),
                TabBar(
                  dividerColor: Colors.transparent,
                  indicatorColor: scheme['color'],
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.grey,
                  tabs: const [
                    Tab(text: 'Overview Profile'),
                    Tab(text: 'Interactive Portal'),
                  ],
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: TabBarView(
                    children: [
                      // Overview Profile
                      SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildInfoTile('Detailed Description', scheme['desc']!),
                            _buildInfoTile('Key Objectives', scheme['objectives']!),
                            _buildInfoTile('Eligibility Criteria', scheme['eligibility']!),
                            _buildInfoTile('Citizen Rewards & Benefits', scheme['benefits']!),
                          ],
                        ),
                      ),
                      // Interactive Portal
                      SingleChildScrollView(
                        child: _buildPortalView(scheme),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoTile(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title.toUpperCase(),
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            content,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 13,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPortalView(Map<String, dynamic> scheme) {
    if (scheme['name'] == 'life') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Mission LiFE Carbon Offset Audit',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 8),
          const Text(
            'Report your environment-friendly actions today:',
            style: TextStyle(color: AppColors.textMuted, fontSize: 12),
          ),
          const SizedBox(height: 12),
          _buildCheckboxTile('Took public transport or bicycle instead of motor car'),
          _buildCheckboxTile('Switched off all standby appliances at home'),
          _buildCheckboxTile('Ate 100% plant-based organic meals today'),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              foregroundColor: Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Daily challenges logged! Earned +60 EcoPoints.')),
              );
            },
            child: const Text('Log Mission Action'),
          ),
        ],
      );
    }

    if (scheme['name'] == 'swachhbharat') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Report Local Cleanliness Issue',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 12),
          _buildTextField('Issue Name (e.g. Garbage Dump)'),
          const SizedBox(height: 12),
          _buildTextField('Location Description'),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.accentAmber,
              foregroundColor: Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Swachh Bharat garbage report logged successfully!')),
              );
            },
            child: const Text('Submit Report'),
          ),
        ],
      );
    }

    if (scheme['name'] == 'cpcb') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Regional AQI Dashboard',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildGauge('Air (AQI)', '45', Colors.emeraldAccent),
              _buildGauge('Water pH', '7.2', Colors.cyanAccent),
              _buildGauge('Noise dB', '58', Colors.amberAccent),
            ],
          ),
        ],
      );
    }

    if (scheme['name'] == 'greenindia') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Adopt a Tree & Grow Cover',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 12),
          _buildTextField('Name of Your Adopted Tree'),
          const SizedBox(height: 16),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              foregroundColor: Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Tree adopted! Virtual carbon sequestration logs started.')),
              );
            },
            child: const Text('Adopt Sapling'),
          ),
        ],
      );
    }

    // Default volunteer registration
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Join Campaign Volunteers',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
        ),
        const SizedBox(height: 6),
        const Text(
          'Register to participate in local awareness and enforcement projects.',
          style: TextStyle(color: AppColors.textMuted, fontSize: 12),
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: scheme['color'],
            foregroundColor: Colors.black,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onPressed: () {
            Navigator.pop(context);
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Registered as campaign volunteer!')),
            );
          },
          child: const Text('Volunteer Register'),
        ),
      ],
    );
  }

  Widget _buildCheckboxTile(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Checkbox(
            value: true,
            activeColor: AppColors.primaryGreen,
            onChanged: (val) {},
          ),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: Colors.white70, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label) {
    return TextField(
      style: const TextStyle(color: Colors.white, fontSize: 13),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.grey, fontSize: 12),
        filled: true,
        fillColor: AppColors.cardDark,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildGauge(String label, String value, Color color) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: color, width: 3),
          ),
          alignment: Alignment.center,
          child: Text(
            value,
            style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 10),
        ),
      ],
    );
  }
}
