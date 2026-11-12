import { useState, useCallback } from 'react';
import { validateContactForm } from '../utils/validators';
import { contactService } from '../services/contactService';

export function useContactForm(onSuccessCallback) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for that specific field when user starts typing
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
    // Reset feedback banner if active
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setFeedbackMessage('');
    }
  }, [submitStatus]);

  const handleSubmit = useCallback(async () => {
    setSubmitStatus('idle');
    setFeedbackMessage('');

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await contactService.submitMessage(formData);
      setSubmitStatus('success');
      setFeedbackMessage(response.message || 'Pesan Anda berhasil dikirim dan tersimpan di riwayat lokal!');
      // Reset form on success per FR-19
      setFormData({ nama: '', email: '', pesan: '' });
      setErrors({});
      if (typeof onSuccessCallback === 'function') {
        onSuccessCallback(response.data);
      }
      return true;
    } catch (err) {
      setSubmitStatus('error');
      setFeedbackMessage(err.message || 'Gagal mengirim pesan. Silakan coba kembali.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSuccessCallback]);

  const handleReset = useCallback(() => {
    setFormData({ nama: '', email: '', pesan: '' });
    setErrors({});
    setSubmitStatus('idle');
    setFeedbackMessage('');
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    feedbackMessage,
    handleChange,
    handleSubmit,
    handleReset,
  };
}

