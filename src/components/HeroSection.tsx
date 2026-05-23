import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { HERO_CHAPTER } from '../data/itinerary';

const HERO_HEIGHT = 220;
const COVER_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Aoraki-Mount_Cook_from_Hooker_Valley.jpg/1200px-Aoraki-Mount_Cook_from_Hooker_Valley.jpg';

export function HeroSection() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.heroContainer}>
        {/* Cover photo or fallback gradient */}
        {!imgFailed ? (
          <Image
            source={{ uri: COVER_PHOTO }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <LinearGradient
            colors={['#0d2e1c', '#1a4a3a', '#0b3d5e', '#162d45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

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
