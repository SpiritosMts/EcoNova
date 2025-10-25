import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter/material.dart';
import 'color_theme.dart';

class PollutionZone {
  final String id;
  final String name;
  final String level; // 'critical', 'warning', 'moderate'
  final LatLng center;
  final double pollution;
  final String trend; // 'increasing', 'decreasing', 'stable'

  const PollutionZone({
    required this.id,
    required this.name,
    required this.level,
    required this.center,
    required this.pollution,
    required this.trend,
  });
}

// Static pollution zones matching the factory website
const List<PollutionZone> pollutionZones = [
  PollutionZone(
    id: 'zone_1',
    name: 'Industrial District North',
    level: 'critical',
    center: LatLng(33.8950, 10.1100),
    pollution: 85,
    trend: 'increasing',
  ),
  PollutionZone(
    id: 'zone_2',
    name: 'Coastal Area East',
    level: 'warning',
    center: LatLng(33.8750, 10.1250),
    pollution: 55,
    trend: 'stable',
  ),
  PollutionZone(
    id: 'zone_3',
    name: 'Residential Zone West',
    level: 'moderate',
    center: LatLng(33.8900, 10.0800),
    pollution: 35,
    trend: 'decreasing',
  ),
  PollutionZone(
    id: 'zone_4',
    name: 'Factory Complex South',
    level: 'critical',
    center: LatLng(33.8680, 10.0950),
    pollution: 92,
    trend: 'increasing',
  ),
  PollutionZone(
    id: 'zone_5',
    name: 'Agricultural Area',
    level: 'moderate',
    center: LatLng(33.9050, 10.0950),
    pollution: 28,
    trend: 'stable',
  ),
  PollutionZone(
    id: 'zone_6',
    name: 'Port District',
    level: 'warning',
    center: LatLng(33.8820, 10.1350),
    pollution: 68,
    trend: 'increasing',
  ),
  PollutionZone(
    id: 'zone_7',
    name: 'Downtown Area',
    level: 'warning',
    center: LatLng(33.8815, 10.0982),
    pollution: 47,
    trend: 'stable',
  ),
  PollutionZone(
    id: 'zone_8',
    name: 'Chemical Plant Zone',
    level: 'critical',
    center: LatLng(33.8580, 10.1050),
    pollution: 78,
    trend: 'increasing',
  ),
  PollutionZone(
    id: 'zone_9',
    name: 'University District',
    level: 'moderate',
    center: LatLng(33.9000, 10.1050),
    pollution: 22,
    trend: 'decreasing',
  ),
  PollutionZone(
    id: 'zone_10',
    name: 'Market Area',
    level: 'warning',
    center: LatLng(33.8700, 10.0850),
    pollution: 51,
    trend: 'stable',
  ),
];

class PollutionColors {
  final Color fill;
  final Color stroke;
  final String label;

  const PollutionColors({
    required this.fill,
    required this.stroke,
    required this.label,
  });
}

PollutionColors getPollutionColorScheme(String level) {
  switch (level) {
    case 'critical':
      return PollutionColors(
        fill: AppColors.critical.withOpacity(0.35),
        stroke: AppColors.critical,
        label: 'Critical',
      );
    case 'warning':
      return PollutionColors(
        fill: AppColors.warning.withOpacity(0.35),
        stroke: AppColors.warning,
        label: 'Warning',
      );
    case 'moderate':
      return PollutionColors(
        fill: AppColors.moderate.withOpacity(0.35),
        stroke: AppColors.moderate,
        label: 'Moderate',
      );
    default:
      return PollutionColors(
        fill: AppColors.primaryGreen.withOpacity(0.35),
        stroke: AppColors.primaryGreen,
        label: 'Safe',
      );
  }
}

double getRadiusForZone(double pollution) {
  // Map pollution level (0-100) to radius (300-600 meters)
  return 300 + (pollution / 100 * 300);
}
