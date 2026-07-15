// ==========================================
// PROCESADOR DE PITCH POR AUTOCORRELACIÓN
// ==========================================

export const autoCorrelate = (buffer, sampleRate) => {
  const SIZE = buffer.length;
  let totalVolume = 0;

  // Medición RMS del volumen del buffer entrante
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    totalVolume += val * val;
  }
  const rms = Math.sqrt(totalVolume / SIZE);
  if (rms < 0.005) return -1; // Muy silencioso para análisis preciso

  // Recorte de extremos ruidosos
  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = SIZE - 1; i >= SIZE / 2; i--) {
    if (Math.abs(buffer[i]) < thres) {
      r2 = i;
      break;
    }
  }

  const length = r2 - r1;
  if (length < 64) return -1;

  // Límites físicos para guitarras estándar (~75Hz a ~900Hz)
  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.min(length, Math.floor(sampleRate / 75));

  const correlations = new Float32Array(maxLag);

  // Algoritmo matemático de Autocorrelación de Señal en el dominio del tiempo
  for (let i = minLag; i < maxLag; i++) {
    let sum = 0;
    const limit = length - i;
    for (let j = 0; j < limit; j++) {
      sum += buffer[r1 + j] * buffer[r1 + j + i];
    }
    correlations[i] = sum;
  }

  // Búsqueda del pico de correlación fundamental
  let maxval = -1;
  let maxpos = -1;
  for (let i = minLag; i < maxLag; i++) {
    if (correlations[i] > maxval) {
      maxval = correlations[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;
  // Interpolación parabólica de precisión decimal para centésimas de tono (Cents)
  if (T0 > minLag && T0 < maxLag - 1) {
    const x1 = correlations[T0 - 1];
    const x2 = correlations[T0];
    const x3 = correlations[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
};