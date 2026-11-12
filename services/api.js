/**
 * Mock API Base Layer
 * Provides simulated network latency (500-1000ms) and toggleable error simulation.
 */

let simulateError = false;

// Check environment variable if set
if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SIMULATE_ERROR === 'true') {
  simulateError = true;
}

export function setSimulateError(val) {
  simulateError = Boolean(val);
}

export function isSimulateError() {
  return simulateError;
}

/**
 * Wraps synchronous data or async factory with simulated network latency and error handling.
 */
export function mockApiCall(dataSupplier, delayMs = 600) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (simulateError) {
        reject(new Error('Gagal memuat data dari Mock API (Mode Simulasi Galat Aktif). Silakan coba lagi.'));
      } else {
        try {
          const result = typeof dataSupplier === 'function' ? dataSupplier() : dataSupplier;
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }
    }, delayMs);

    // Support timer cleanup in node/jest tests if needed
    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  });
}

