import { validateContactForm } from '../utils/validators';
import { getStorageItem, saveContactMessage, clearContactMessages, STORAGE_KEYS } from '../utils/storage';
import { mockApiCall } from './api';

export const contactService = {
  async submitMessage(payload) {
    return mockApiCall(async () => {
      const validation = validateContactForm(payload);
      if (!validation.isValid) {
        const firstErrorKey = Object.keys(validation.errors)[0];
        throw new Error(validation.errors[firstErrorKey]);
      }

      const messageObj = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        nama: payload.nama.trim(),
        email: payload.email.trim(),
        pesan: payload.pesan.trim(),
        waktu: new Date().toISOString(),
      };

      await saveContactMessage(messageObj);

      return {
        success: true,
        data: messageObj,
        message: 'Pesan Anda berhasil dikirim dan disimpan ke penyimpanan lokal.',
      };
    }, 600);
  },

  async getMessageHistory() {
    return mockApiCall(async () => {
      const history = await getStorageItem(STORAGE_KEYS.MESSAGES, []);
      return history || [];
    }, 400);
  },

  async clearHistory() {
    return mockApiCall(async () => {
      await clearContactMessages();
      return { success: true };
    }, 300);
  },
};

