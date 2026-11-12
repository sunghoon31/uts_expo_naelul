import React from 'react';
import { render } from '@testing-library/react-native';
import { ScoreSummary } from '../components/ScoreSummary';
import { ThemeProvider } from '../theme/ThemeContext';
import scoreData from '../data/score.json';

describe('ScoreSummary component (T-06 & FR-34, FR-35)', () => {
  it('merender nilai 89, Grade A, dan 12.375 LP dari data score.json', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <ScoreSummary
          score={scoreData.currentScore}
          learningPoints={scoreData.learningPoints}
          akademik={scoreData.akademik}
        />
      </ThemeProvider>
    );

    // Nilai 89
    expect(getByText('89')).toBeTruthy();

    // Grade A
    expect(getByText('Grade A')).toBeTruthy();

    // 12.375 LP
    expect(getByText('12.375 LP')).toBeTruthy();
  });
});
