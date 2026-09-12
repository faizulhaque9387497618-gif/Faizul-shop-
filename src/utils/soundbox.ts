// Web Audio API synthesizer for PhonePe / Paytm payment success chime and speech audio simulation

export function playSuccessChime(type: 'phonepe' | 'paytm' | 'upi' = 'paytm') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'paytm') {
      // Signature Paytm double-tone alert chime (bright, upbeat high pitched)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.12); // A5
      osc1.frequency.setValueAtTime(1174.66, now + 0.24); // D6

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(659.25, now + 0.12);
      osc2.frequency.setValueAtTime(880, now + 0.24);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } else if (type === 'phonepe') {
      // PhonePe signature gentle bell chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } else {
      // Generic UPI success chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
    // AudioContext blocked or not supported, ignore silently
  }
}

export function speakSoundboxAnnouncement(text: string) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;
      // Prefer Hindi / English Indian voice if available
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('hi'));
      if (inVoice) {
        utterance.voice = inVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // fallback
  }
}
