import 'package:flutter/material.dart';
import '../utils/color_theme.dart';
import '../utils/tips_data.dart';

class PollutionCard extends StatelessWidget {
  final String pollutionType;
  final double dangerLevel;
  final VoidCallback? onSendReport;

  const PollutionCard({
    super.key,
    required this.pollutionType,
    required this.dangerLevel,
    this.onSendReport,
  });

  Color _getDangerColor() {
    if (dangerLevel < 40) return AppColors.moderate;
    if (dangerLevel < 70) return AppColors.warning;
    return AppColors.critical;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  _getIcon(),
                  size: 48,
                  color: _getDangerColor(),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pollution Type',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                      Text(
                        pollutionType,
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Danger Level',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.textSecondary,
                      ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      '${dangerLevel.toInt()}',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: _getDangerColor(),
                          ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: _getDangerColor().withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        TipsData.getDangerLevelText(dangerLevel),
                        style: TextStyle(
                          color: _getDangerColor(),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: dangerLevel / 100,
                  backgroundColor: Colors.grey[200],
                  valueColor: AlwaysStoppedAnimation(_getDangerColor()),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _getDangerColor().withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: _getDangerColor(),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      TipsData.getTipsForDangerLevel(dangerLevel),
                      style: TextStyle(
                        color: _getDangerColor(),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            if (onSendReport != null) ...[
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onSendReport,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: AppColors.primaryGreen,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text(
                    'Send Report',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  IconData _getIcon() {
    switch (pollutionType.toLowerCase()) {
      case 'air':
        return Icons.air;
      case 'water':
        return Icons.water_drop;
      case 'waste':
        return Icons.delete;
      default:
        return Icons.warning;
    }
  }
}
