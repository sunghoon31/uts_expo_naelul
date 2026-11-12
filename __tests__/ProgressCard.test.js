import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressCard } from '../components/ProgressCard';
import { ThemeProvider } from '../theme/ThemeContext';

describe('ProgressCard component (T-05 & FR-36)', () => {
  it('menampilkan label dan teks persentase 87% dengan tepat', async () => {
    const { getByText, getByLabelText } = await render(
      <ThemeProvider>
        <ProgressCard label="Practice" persen={87} />
      </ThemeProvider>
    );

    // Verifikasi teks label dan persentase
    expect(getByText('Practice')).toBeTruthy();
    expect(getByText('87%')).toBeTruthy();

    // Verifikasi aksesibilitas
    expect(getByLabelText('Practice: 87%')).toBeTruthy();
  });
});
