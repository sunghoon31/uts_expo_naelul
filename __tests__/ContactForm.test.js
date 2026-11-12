import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ContactForm } from '../components/ContactForm';
import { ThemeProvider } from '../theme/ThemeContext';

describe('ContactForm component (T-02, T-03, T-04 & FR-16 s.d. FR-19)', () => {
  it('menampilkan 3 pesan error jika diberikan props errors validasi (T-02)', async () => {
    const mockErrors = {
      nama: 'Nama wajib diisi',
      email: 'Email wajib diisi',
      pesan: 'Pesan wajib diisi',
    };

    const { getByTestId } = await render(
      <ThemeProvider>
        <ContactForm
          formData={{ nama: '', email: '', pesan: '' }}
          errors={mockErrors}
          onChangeField={jest.fn()}
          onSubmit={jest.fn()}
          onReset={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(getByTestId('error-nama')).toBeTruthy();
    expect(getByTestId('error-email')).toBeTruthy();
    expect(getByTestId('error-pesan')).toBeTruthy();
  });

  it('memanggil onSubmit ketika tombol kirim ditekan (T-03)', async () => {
    const handleSubmit = jest.fn();

    const { getByTestId } = await render(
      <ThemeProvider>
        <ContactForm
          formData={{
            nama: 'Naelul Kirom',
            email: 'naelul@example.com',
            pesan: 'Pesan pengujian kontak UTS',
          }}
          errors={{}}
          onChangeField={jest.fn()}
          onSubmit={handleSubmit}
          onReset={jest.fn()}
        />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('submit-button'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('memanggil onReset ketika tombol reset ditekan (T-04)', async () => {
    const handleReset = jest.fn();

    const { getByTestId } = await render(
      <ThemeProvider>
        <ContactForm
          formData={{ nama: 'Budi', email: '', pesan: '' }}
          errors={{}}
          onChangeField={jest.fn()}
          onSubmit={jest.fn()}
          onReset={handleReset}
        />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('reset-button'));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('menampilkan banner feedback sukses saat submit berhasil', async () => {
    const { getByTestId, getByText } = await render(
      <ThemeProvider>
        <ContactForm
          formData={{ nama: '', email: '', pesan: '' }}
          errors={{}}
          submitStatus="success"
          feedbackMessage="Pesan berhasil terkirim!"
          onChangeField={jest.fn()}
          onSubmit={jest.fn()}
          onReset={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(getByTestId('success-banner')).toBeTruthy();
    expect(getByText('Pesan berhasil terkirim!')).toBeTruthy();
  });
});
