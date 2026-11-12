import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

export function ProgressCard({ label, persen, color, style }) {
  const numericPersen = Number(persen) || 0;

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.content}>
        <ProgressBar
          label={label}
          value={numericPersen}
          showPercentage={true}
          barColor={color}
          height={10}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  content: {
    width: '100%',
  },
});

