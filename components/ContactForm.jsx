import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Card } from './ui/Card';

export function ContactForm({
  formData,
  errors = {},
  isSubmitting = false,
  submitStatus = 'idle',
  feedbackMessage = '',
  onChangeField,
  onSubmit,
  onReset,
}) {
  const { colors, typography, spacing, radius } = useTheme();

  const emailRef = useRef(null);
  const pesanRef = useRef(null);

  return (
    <Card style={styles.card}>
      {/* Feedback Banner */}
      {feedbackMessage ? (
        <View
          testID={submitStatus === 'success' ? 'success-banner' : 'error-banner'}
          style={[
            styles.banner,
            {
              backgroundColor:
                submitStatus === 'success' ? colors.successBg : colors.dangerBg,
              borderColor:
                submitStatus === 'success' ? colors.success : colors.danger,
              borderRadius: radius.md,
              marginBottom: spacing.md,
            },
          ]}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <Ionicons
            name={
              submitStatus === 'success'
                ? 'checkmark-circle-outline'
                : 'alert-circle-outline'
            }
            size={20}
            color={submitStatus === 'success' ? colors.success : colors.danger}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.bannerText,
              {
                color:
                  submitStatus === 'success' ? colors.success : colors.danger,
                fontSize: typography.captionBold.fontSize,
              },
            ]}
          >
            {feedbackMessage}
          </Text>
        </View>
      ) : null}

      {/* Field: Nama */}
      <View style={[styles.fieldGroup, { marginBottom: spacing.md }]}>
        <Text
          style={[
            styles.label,
            { color: colors.text, fontSize: typography.captionBold.fontSize },
          ]}
        >
          Nama Lengkap <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TextInput
          testID="input-nama"
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: errors.nama ? colors.danger : colors.border,
              color: colors.text,
              borderRadius: radius.md,
              fontSize: typography.body.fontSize,
            },
          ]}
          value={formData?.nama || ''}
          onChangeText={(val) => onChangeField('nama', val)}
          placeholder="Masukkan nama lengkap Anda"
          placeholderTextColor={colors.textMuted}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          blurOnSubmit={false}
          accessible={true}
          accessibilityLabel="Nama lengkap"
          accessibilityHint="Wajib diisi, minimal 3 karakter"
        />
        {errors.nama ? (
          <Text
            testID="error-nama"
            style={[
              styles.errorText,
              { color: colors.danger, fontSize: typography.small.fontSize },
            ]}
            accessibilityLiveRegion="polite"
          >
            {errors.nama}
          </Text>
        ) : null}
      </View>

      {/* Field: Email */}
      <View style={[styles.fieldGroup, { marginBottom: spacing.md }]}>
        <Text
          style={[
            styles.label,
            { color: colors.text, fontSize: typography.captionBold.fontSize },
          ]}
        >
          Alamat Email <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TextInput
          ref={emailRef}
          testID="input-email"
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: errors.email ? colors.danger : colors.border,
              color: colors.text,
              borderRadius: radius.md,
              fontSize: typography.body.fontSize,
            },
          ]}
          value={formData?.email || ''}
          onChangeText={(val) => onChangeField('email', val)}
          placeholder="nama@email.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => pesanRef.current?.focus()}
          blurOnSubmit={false}
          accessible={true}
          accessibilityLabel="Alamat email"
          accessibilityHint="Wajib diisi dengan format email valid"
        />
        {errors.email ? (
          <Text
            testID="error-email"
            style={[
              styles.errorText,
              { color: colors.danger, fontSize: typography.small.fontSize },
            ]}
            accessibilityLiveRegion="polite"
          >
            {errors.email}
          </Text>
        ) : null}
      </View>

      {/* Field: Pesan */}
      <View style={[styles.fieldGroup, { marginBottom: spacing.lg }]}>
        <Text
          style={[
            styles.label,
            { color: colors.text, fontSize: typography.captionBold.fontSize },
          ]}
        >
          Pesan <Text style={{ color: colors.danger }}>*</Text>
        </Text>
        <TextInput
          ref={pesanRef}
          testID="input-pesan"
          style={[
            styles.textArea,
            {
              backgroundColor: colors.background,
              borderColor: errors.pesan ? colors.danger : colors.border,
              color: colors.text,
              borderRadius: radius.md,
              fontSize: typography.body.fontSize,
            },
          ]}
          value={formData?.pesan || ''}
          onChangeText={(val) => onChangeField('pesan', val)}
          placeholder="Tuliskan pesan, pertanyaan, atau tawaran kolaborasi Anda (minimal 10 karakter)..."
          placeholderTextColor={colors.textMuted}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          accessible={true}
          accessibilityLabel="Pesan"
          accessibilityHint="Wajib diisi, minimal 10 karakter"
        />
        {errors.pesan ? (
          <Text
            testID="error-pesan"
            style={[
              styles.errorText,
              { color: colors.danger, fontSize: typography.small.fontSize },
            ]}
            accessibilityLiveRegion="polite"
          >
            {errors.pesan}
          </Text>
        ) : null}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          testID="submit-button"
          style={[
            styles.submitButton,
            {
              backgroundColor: isSubmitting ? colors.textMuted : colors.primary,
              borderRadius: radius.md,
            },
          ]}
          onPress={onSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isSubmitting ? 'Sedang mengirim pesan' : 'Kirim Pesan'}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitText}>Kirim Pesan</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          testID="reset-button"
          style={[
            styles.resetButton,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
          onPress={onReset}
          disabled={isSubmitting}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Reset formulir"
        >
          <Ionicons name="refresh-outline" size={16} color={colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={[styles.resetText, { color: colors.textMuted }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
  },
  bannerText: {
    flex: 1,
  },
  fieldGroup: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    minHeight: 44,
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 100,
  },
  errorText: {
    marginTop: 4,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    minHeight: 44,
    marginRight: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 48,
    minHeight: 44,
  },
  resetText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

