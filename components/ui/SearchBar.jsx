import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Cari proyek, teknologi, atau kategori...',
  style,
}) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
        },
        style,
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textMuted}
        style={{ marginRight: 8 }}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            fontSize: typography.body.fontSize,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessible={true}
        accessibilityLabel="Kolom pencarian"
        accessibilityHint="Ketik kata kunci untuk menyaring daftar proyek"
      />
      {value && value.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            if (onClear) onClear();
            else onChangeText('');
          }}
          activeOpacity={0.7}
          style={styles.clearButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Hapus kata kunci pencarian"
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 6,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

