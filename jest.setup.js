/* eslint-disable no-undef */
// Setup file for Jest test environment
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Set timeout for React Native component rendering tests on Windows
jest.setTimeout(30000);

// Silence unwanted warning logs during testing
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('[storage] Error reading key') ||
      args[0].includes('VirtualizedLists should never be nested'))
  ) {
    return;
  }
  originalWarn(...args);
};

