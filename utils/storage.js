import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  THEME: '@cv/theme',
  MESSAGES: '@cv/messages',
  PORTFOLIO_FILTER: '@cv/portfolio-filter',
};

/**
 * Get string or JSON parsed value from storage with fallback
 */
export async function getStorageItem(key, defaultValue = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (error) {
    console.warn(`[storage] Error reading key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set string or JSON value to storage safely
 */
export async function setStorageItem(key, value) {
  try {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, payload);
    return true;
  } catch (error) {
    console.warn(`[storage] Error writing key "${key}":`, error);
    return false;
  }
}

/**
 * Remove an item from storage safely
 */
export async function removeStorageItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[storage] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Save a new contact message (max 20 messages)
 */
export async function saveContactMessage(message) {
  try {
    const existing = (await getStorageItem(STORAGE_KEYS.MESSAGES, [])) || [];
    const updated = [message, ...existing.filter((m) => m.id !== message.id)].slice(0, 20);
    await setStorageItem(STORAGE_KEYS.MESSAGES, updated);
    return updated;
  } catch (error) {
    console.warn('[storage] Error saving contact message:', error);
    return [];
  }
}

/**
 * Clear contact messages history
 */
export async function clearContactMessages() {
  try {
    await removeStorageItem(STORAGE_KEYS.MESSAGES);
    return true;
  } catch (error) {
    console.warn('[storage] Error clearing contact messages:', error);
    return false;
  }
}

