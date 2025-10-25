import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../services/firestore_service.dart';
import '../utils/color_theme.dart';
import '../utils/tips_data.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final _firestoreService = FirestoreService();
  GoogleMapController? _mapController;
  Set<Circle> _circles = {};
  bool _isLoading = true;

  // Default location (Tunisia)
  static const LatLng _defaultLocation = LatLng(33.8812, 10.0983);

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _loadReports() async {
    try {
      final reports = await _firestoreService.getMapReports();

      setState(() {
        _circles = reports.map((report) {
          final dangerLevel = (report['danger_level'] as num).toDouble();
          final lat = (report['latitude'] as num).toDouble();
          final lng = (report['longitude'] as num).toDouble();

          return Circle(
            circleId: CircleId(report['id']),
            center: LatLng(lat, lng),
            radius: _getRadiusForDangerLevel(dangerLevel),
            fillColor: _getColorForDangerLevel(dangerLevel).withOpacity(0.3),
            strokeColor: _getColorForDangerLevel(dangerLevel),
            strokeWidth: 2,
            consumeTapEvents: true,
            onTap: () => _showReportDetails(report),
          );
        }).toSet();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      _showError('Failed to load reports: $e');
    }
  }

  double _getRadiusForDangerLevel(double dangerLevel) {
    // Map danger level (0-100) to radius (100-500 meters)
    return 100 + (dangerLevel / 100 * 400);
  }

  Color _getColorForDangerLevel(double dangerLevel) {
    if (dangerLevel < 40) return AppColors.moderate;
    if (dangerLevel < 70) return AppColors.warning;
    return AppColors.critical;
  }

  void _showReportDetails(Map<String, dynamic> report) {
    final dangerLevel = (report['danger_level'] as num).toDouble();
    final pollutionType = report['pollution_type'] as String;

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: _getColorForDangerLevel(dangerLevel),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  'Pollution Report',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildDetailRow('Type', pollutionType),
            const SizedBox(height: 12),
            _buildDetailRow(
              'Danger Level',
              '${dangerLevel.toInt()}% - ${TipsData.getDangerLevelText(dangerLevel)}',
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _getColorForDangerLevel(dangerLevel).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: _getColorForDangerLevel(dangerLevel),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      TipsData.getTipsForDangerLevel(dangerLevel),
                      style: TextStyle(
                        color: _getColorForDangerLevel(dangerLevel),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 16,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ],
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                GoogleMap(
                  initialCameraPosition: const CameraPosition(
                    target: _defaultLocation,
                    zoom: 12,
                  ),
                  circles: _circles,
                  onMapCreated: (controller) {
                    _mapController = controller;
                  },
                  myLocationButtonEnabled: true,
                  myLocationEnabled: true,
                  mapType: MapType.normal,
                ),
                Positioned(
                  top: 16,
                  left: 16,
                  right: 16,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Danger Zones',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 12),
                          _buildLegendItem('Moderate (0-40)', AppColors.moderate),
                          const SizedBox(height: 8),
                          _buildLegendItem('Warning (40-70)', AppColors.warning),
                          const SizedBox(height: 8),
                          _buildLegendItem('Critical (70-100)', AppColors.critical),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _loadReports,
        backgroundColor: AppColors.primaryGreen,
        child: const Icon(Icons.refresh, color: Colors.white),
      ),
    );
  }

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      children: [
        Container(
          width: 16,
          height: 16,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Text(label),
      ],
    );
  }
}
