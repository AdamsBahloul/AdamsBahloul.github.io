let enabled = true;
let context: AudioContext | null = null;
let lastSoundAt = 0;

export function setUiSoundEnabled(value: boolean) {
  enabled = value;
}

/** A short, soft synthetic tick so the interface needs no downloaded audio file. */
export function playUiSound() {
  if (!enabled || typeof window === 'undefined') return;
  const nowMs = performance.now();
  if (nowMs - lastSoundAt < 75) return;
  lastSoundAt = nowMs;

  try {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    context ??= new AudioContextConstructor();
    if (context.state === 'suspended') void context.resume();

    const start = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(720, start);
    oscillator.frequency.exponentialRampToValueAtTime(470, start + 0.075);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.025, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.09);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.1);
  } catch {
    // Sound remains optional if the browser blocks audio playback.
  }
}
