import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { HERO_CHAPTER } from '../data/itinerary';
import IMAGES from '../data/images';

const HERO_HEIGHT = 220;

export function HeroSection() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.heroContainer}>
        <Image
          source={IMAGES.hero_cover}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Dark overlay for text readability */}
        <LinearGradient
          colors={['rgba(13,20,23,0.15)', 'rgba(13,20,23,0.75)']}
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
