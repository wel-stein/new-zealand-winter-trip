import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { HERO_CHAPTER } from '../data/itinerary';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 220;

// Placeholder gradient used in place of a real landscape photo
function LandscapeGradient() {
  return (
    <LinearGradient
      colors={['#0d2e1c', '#1a4a3a', '#0b3d5e', '#162d45']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function HeroSection() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.heroContainer}>
        <LandscapeGradient />

        {/* Mountain silhouette decorative elements */}
        <View style={styles.mountainLayer}>
          <LinearGradient
            colors={['transparent', 'rgba(13,46,28,0.6)', 'rgba(11,61,94,0.4)']}
            style={styles.mountainOverlay}
          />
        </View>

        <LinearGradient
          colors={['rgba(13,20,23,0.2)', 'rgba(13,20,23,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
            <Text style={styles.dateText}>{HERO_CHAPTER.dateRange}</Text>
          </View>

          <Text style={styles.chapterTitle}>{HERO_CHAPTER.title}</Text>
          <Text style={styles.chapterSubtitle}>{HERO_CHAPTER.subtitle}</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  mountainLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  mountainOverlay: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  dateText: {
    ...Typography.labelSm,
    color: Colors.primary,
  },
  chapterTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  chapterSubtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
});
