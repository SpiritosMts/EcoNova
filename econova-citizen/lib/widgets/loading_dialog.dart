import 'package:flutter/material.dart';
import '../utils/color_theme.dart';

class LoadingDialog extends StatefulWidget {
  final List<String> messages;

  const LoadingDialog({
    super.key,
    required this.messages,
  });

  @override
  State<LoadingDialog> createState() => _LoadingDialogState();
}

class _LoadingDialogState extends State<LoadingDialog> {
  int _currentMessageIndex = 0;

  @override
  void initState() {
    super.initState();
    _startMessageRotation();
  }

  void _startMessageRotation() {
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted && _currentMessageIndex < widget.messages.length - 1) {
        setState(() {
          _currentMessageIndex++;
        });
        _startMessageRotation();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                shape: BoxShape.circle,
              ),
              child: const Padding(
                padding: EdgeInsets.all(16),
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 3,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Analyzing Pollution',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 500),
              child: Text(
                widget.messages[_currentMessageIndex],
                key: ValueKey(_currentMessageIndex),
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),
            ),
            const SizedBox(height: 24),
            LinearProgressIndicator(
              backgroundColor: Colors.grey[200],
              valueColor: const AlwaysStoppedAnimation(AppColors.primaryGreen),
              borderRadius: BorderRadius.circular(4),
            ),
          ],
        ),
      ),
    );
  }
}

void showLoadingDialog(BuildContext context, List<String> messages) {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (context) => LoadingDialog(messages: messages),
  );
}
