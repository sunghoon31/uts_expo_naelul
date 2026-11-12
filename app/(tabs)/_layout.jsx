import React, { useMemo, useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

// ─── Animated Tab Icon Button ─────────────────────────────────────────────────
function AnimatedTabButton({ children, onPress, style }) {
  // useState lazy init: Animated.Value dibuat sekali, tidak dianggap "ref access during render"
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.78,
      useNativeDriver: true,
      friction: 6,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 180,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Glossy Active Pill Wrapper ───────────────────────────────────────────────
function TabIconWithPill({ focused, children, primaryColor }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {focused && (
        <View
          style={{
            position: 'absolute',
            width: 44,
            height: 30,
            borderRadius: 15,
            backgroundColor: `${primaryColor}22`,
            borderWidth: 1,
            borderColor: `${primaryColor}44`,
          }}
        />
      )}
      {children}
    </View>
  );
}

export default function TabLayout() {
  const { colors, isDark, toggleTheme, typography } = useTheme();

  // ── Animated Theme Toggle ────────────────────────────────────────────────
  const [themeRotate] = useState(() => new Animated.Value(0));

  const rotateInterpolate = useMemo(
    () =>
      themeRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    [themeRotate]
  );

  const handleThemeToggle = () => {
    const current = themeRotate;
    Animated.spring(current, {
      toValue: current._value >= 1 ? 0 : 1,
      useNativeDriver: true,
      friction: 4,
      tension: 180,
    }).start();
    toggleTheme();
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={handleThemeToggle}
      style={[
        styles.themeToggle,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Ganti tema, saat ini tema ${isDark ? 'gelap' : 'terang'}`}
      accessibilityHint="Ketuk untuk beralih mode gelap dan terang"
    >
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={18}
          color={isDark ? '#FBBF24' : colors.primary}
        />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontSize: typography.h3.fontSize,
          fontWeight: '700',
        },
        headerRight: renderHeaderRight,
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerTitle: 'Personal CV',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithPill focused={focused} primaryColor={colors.primary}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            </TabIconWithPill>
          ),
        }}
      />

      {/* 2. About */}
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarLabel: 'About',
          headerTitle: 'Tentang Saya',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithPill focused={focused} primaryColor={colors.primary}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
            </TabIconWithPill>
          ),
        }}
      />

      {/* 3. Skills */}
      <Tabs.Screen
        name="skills"
        options={{
          title: 'Skills',
          tabBarLabel: 'Skills',
          headerTitle: 'Keahlian & Kompetensi',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithPill focused={focused} primaryColor={colors.primary}>
              <Ionicons name={focused ? 'flash' : 'flash-outline'} size={22} color={color} />
            </TabIconWithPill>
          ),
        }}
      />

      {/* 4. Portfolio */}
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarLabel: 'Portfolio',
          headerTitle: 'Galeri Portofolio',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithPill focused={focused} primaryColor={colors.primary}>
              <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={22} color={color} />
            </TabIconWithPill>
          ),
        }}
      />

      {/* 5. My Score */}
      <Tabs.Screen
        name="score"
        options={{
          title: 'My Score',
          tabBarLabel: 'My Score',
          headerTitle: 'Capaian Akademik',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithPill focused={focused} primaryColor={colors.primary}>
              <Ionicons name={focused ? 'ribbon' : 'ribbon-outline'} size={22} color={color} />
            </TabIconWithPill>
          ),
        }}
      />

      {/* 6. Contact */}
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarLabel: 'Contact',
          headerTitle: 'Hubungi Saya',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithPill focused={focused} primaryColor={colors.primary}>
              <Ionicons name={focused ? 'mail' : 'mail-outline'} size={22} color={color} />
            </TabIconWithPill>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
