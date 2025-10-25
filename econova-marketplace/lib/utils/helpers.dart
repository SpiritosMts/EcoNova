import 'package:intl/intl.dart';

class Helpers {
  // Format currency
  static String formatCurrency(double amount) {
    return '\$${amount.toStringAsFixed(2)}';
  }
  
  // Format date
  static String formatDate(DateTime date) {
    return DateFormat('dd MMM yyyy').format(date);
  }
  
  // Format date with time
  static String formatDateTime(DateTime date) {
    return DateFormat('dd MMM yyyy, HH:mm').format(date);
  }
  
  // Calculate commission
  static double calculateCommission(double amount, double rate) {
    return amount * rate;
  }
  
  // Validate email
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }
  
  // Generate transaction ID
  static String generateTransactionId() {
    return 'TXN${DateTime.now().millisecondsSinceEpoch}';
  }
  
  // Format timestamp to relative time
  static String getRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()} year${(difference.inDays / 365).floor() == 1 ? '' : 's'} ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()} month${(difference.inDays / 30).floor() == 1 ? '' : 's'} ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays == 1 ? '' : 's'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours == 1 ? '' : 's'} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes == 1 ? '' : 's'} ago';
    } else {
      return 'Just now';
    }
  }
}
