import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function ProgressBar({
  value = 0,
  label,
  showPercentage = true,
  barColor,
  height = 8,
  style,
}) {
  const { colors, radius, typography, spacing } = useTheme();

  // Clamp value between 0 and 100
  const numericVal = Math.min(100, Math.max(0, Number(value) || 0));
  const activeColor = barColor || colors.primary;

  // useState lazy init: safe from react-hooks/refs lint rule
  const [animatedWidth] = useState(() => new Animated.Value(0));

  useEffect(() => {
    animatedWidth.setValue(0);
    Animated.timing(animatedWidth, {
      toValue: numericVal,
      duration: 900,
      delay: 200,
      useNativeDriver: false, // width needs layout driver
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [numericVal, animatedWidth]);

  const widthInterpolated = useMemo(
    () =>
      animatedWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      }),
    [animatedWidth]
  );

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: numericVal }}
      accessibilityLabel={`${label || 'Progres'}: ${numericVal}%`}
    >
      {(label || showPercentage) && (
        <View style={[styles.labelRow, { marginBottom: spacing.xs }]}>
          {label ? (
            <Text
              style={[
                styles.labelText,
                { color: colors.text, fontSize: typography.captionBold.fontSize },
              ]}
            >
              {label}
            </Text>
          ) : (
            <View />
          )}
          {showPercentage && (
            <Text
              style={[
                styles.percentText,
                { color: colors.textMuted, fontSize: typography.caption.fontSize },
              ]}
            >
              {numericVal}%
            </Text>
          )}
        </View>
      )}

      {/* Track */}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: colors.surfaceMuted,
            borderRadius: radius.full,
          },
        ]}
      >
        {/* Animated Fill */}
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              backgroundColor: activeColor,
              borderRadius: radius.full,
            },
          ]}
        >
          {/* Gloss overlay — top half white shine */}
          <View
            style={[
              styles.glossOverlay,
              { borderRadius: radius.full },
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontWeight: '600',
  },
  percentText: {
    fontWeight: '500',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
});
