// Notification sound utility using Web Audio API

class NotificationSound {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playAlert(severity = 'warning') {
    if (!this.enabled) return;
    
    this.initialize();
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Different sounds for different severities
    if (severity === 'critical') {
      // Critical: Higher pitch, faster beeps
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.setValueAtTime(1046, now + 0.1);
      oscillator.frequency.setValueAtTime(880, now + 0.2);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
    } else {
      // Warning: Medium pitch, single beep
      oscillator.frequency.setValueAtTime(440, now);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const notificationSound = new NotificationSound();
