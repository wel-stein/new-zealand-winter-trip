import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { ItineraryItem } from '../data/itinerary';

interface ItineraryCardProps {
  item: ItineraryItem;
  isLast?: boolean;
}

const CATEGORY_ICONS: Record<ItineraryItem['category'], keyof typeof Ionicons.glyphMap> = {
  arrival: 'airplane-outline',
  activity: 'compass-outline',
  dining: 'restaurant-outline',
  accommodation: 'bed-outline',
  departure: 'airplane-outline',
};

const CATEGORY_GRADIENTS: Record<ItineraryItem['category'], [string, string]> = {
  arrival: ['#0d3a2c', '#1a5c47'],
  activity: ['#0a2a40', '#1a4a6e'],
  dining: ['#2a1a0a', '#4e3010'],
  accommodation: ['#1a1a3a', '#2a2a5a'],
  departure: ['#1a0a2a', '#3a1a5a'],
};

function CardImage({ item }: { item: ItineraryItem }) {
  if (item.image) {
    return (
      <View style={styles.imageWrapper}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(13,20,23,0.4)']}
          style={styles.imageOverlay}
        />
      </View>
    );
  }

  const [c1, c2] = CATEGORY_GRADIENTS[item.category];
  return (
    <View style={styles.imagePlaceholder}>
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Ionicons
        name={CATEGORY_ICONS[item.category]}
        size={32}
        color="rgba(255,255,255,0.25)"
      />
    </View>
  );
}

export function ItineraryCard({ item, isLast }: ItineraryCardProps) {
  return (
    <View style={styles.row}>
      {/* Timeline */}
      <View style={styles.timeline}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.time}>{item.time}</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.tag, { backgroundColor: item.tagColor + '33' }]}>
              <Text style={[styles.tagText, { color: item.tagColor === '#2d6a4f' ? Colors.primary : Colors.secondary }]}>
                {item.tag}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          <CardImage item={item} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timeline: {
    alignItems: 'center',
    width: 16,
    paddingTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryContainer,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.outlineVariant,
    marginTop: 4,
    marginBottom: -Spacing.lg,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  time: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 16,
    flex: 1,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
    flexShrink: 0,
  },
  tagText: {
    ...Typography.labelSm,
    fontSize: 11,
  },
  description: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  imageWrapper: {
    height: 140,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: '60%',
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
