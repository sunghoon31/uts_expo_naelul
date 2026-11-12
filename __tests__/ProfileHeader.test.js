import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileHeader } from '../components/ProfileHeader';
import { ThemeProvider } from '../theme/ThemeContext';
import profileData from '../data/profile.json';

describe('ProfileHeader component (T-07 & FR-01, FR-02, FR-05)', () => {
  it('merender Nama, NIM, dan Profesi dengan benar', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <ProfileHeader data={profileData} />
      </ThemeProvider>
    );

    // NIM
    expect(getByText(`NIM: ${profileData.nim}`)).toBeTruthy();

    // Nama
    expect(getByText(profileData.nama)).toBeTruthy();

    // Profesi
    expect(getByText(profileData.profesi)).toBeTruthy();
  });
});
