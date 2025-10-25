class TipsData {
  static String getTipsForDangerLevel(double dangerLevel) {
    if (dangerLevel < 40) {
      return "🟡 Safe to visit. Stay aware of updates.";
    } else if (dangerLevel < 70) {
      return "🟠 Wear a mask, limit outdoor exposure, avoid contact with water.";
    } else {
      return "🔴 Avoid area, wear protective gear, report to authorities immediately.";
    }
  }
  
  static String getDangerLevelText(double dangerLevel) {
    if (dangerLevel < 40) {
      return "Moderate";
    } else if (dangerLevel < 70) {
      return "Warning";
    } else {
      return "Critical";
    }
  }
}
