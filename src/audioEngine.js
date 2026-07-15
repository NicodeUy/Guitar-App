// ==========================================
// MOTOR DE AUDIO (KARPLUS-STRONG & OSCILADORES)
// Desacoplado para facilitar testing y modularidad
// ==========================================

export const midiToFreq = (midi) => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

export const triggerSynth = (audioCtx, frequency, duration = 1.5, timbre = "synth_guitar", volume = 0.6) => {
  if (!audioCtx) return null;
  const now = audioCtx.currentTime;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.001, now);
  // Ataque rápido para simular pulsación física de púa
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + 0.015);

  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(timbre === "flat_triangle" ? 1000 : 1200, now);

  let osc1, osc2;

  if (timbre === "flat_triangle") {
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(frequency, now);

    osc1.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    gainNode.gain.setValueAtTime(volume * 0.7, now + 0.02);
    // Decaimiento exponencial natural de cuerda de guitarra
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc1.stop(now + duration + 0.1);

    return {
      oscs: [osc1],
      gainNode,
      disconnect: () => {
        osc1.disconnect();
        lowpass.disconnect();
        gainNode.disconnect();
      }
    };
  } else {
    // Timbre que emula distorsión armónica de cuerdas de acero
    osc1 = audioCtx.createOscillator();
    osc2 = audioCtx.createOscillator();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(frequency, now);

    osc2.type = "triangle";
    // Sutil desafinación armónica para efecto de resonancia
    osc2.frequency.setValueAtTime(frequency * 1.003, now);

    // Filtro dinámico: barre frecuencias altas simulando el decaimiento de vibración
    lowpass.frequency.exponentialRampToValueAtTime(80, now + duration);

    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);

    gainNode.gain.setValueAtTime(volume * 0.7, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);

    return {
      oscs: [osc1, osc2],
      gainNode,
      disconnect: () => {
        osc1.disconnect();
        osc2.disconnect();
        lowpass.disconnect();
        gainNode.disconnect();
      }
    };
  }
};

export const playSystemSound = (audioCtx, isSuccess, volume = 0.15) => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  osc.connect(gain);

  if (isSuccess) {
    // Acorde mayor feliz ascendente en intervalo de tercera mayor
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.start(now);
    osc.stop(now + 0.3);
  } else {
    // Tono grave disonante para feedback de fallo
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
};