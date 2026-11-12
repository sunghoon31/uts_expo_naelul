import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from './ui/ProgressBar';

export function SkillItem({ item }) {
  if (!item) return null;

  return (
    <View style={styles.container}>
      <ProgressBar
        label={item.nama}
        value={item.level}
        showPercentage={true}
        height={8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
});

