import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { ItineraryItem } from '../data/itinerary';

interface ItineraryCardProps {
  item: ItineraryItem;
  isLast?: boolean;
  nextDrive?: { duration: string; distance: string };
  completed?: boolean;
  onToggleComplete?: (id: string) => void;
}

const CATEGORY_ICONS: Record<ItineraryItem['category'], keyof typeof Ionicons.glyphMap> = {
  arrival:       'airplane-outline',
  activity:      'compass-outline',
  dining:        'restaurant-outline',
  accommodation: 'bed-outline',
  departure:     'airplane-outline',
};

const CATEGORY_GRADIENTS: Record<ItineraryItem['category'], [string, string]> = {
  arrival:       ['#0d3a2c', '#1a5c47'],
  activity:      ['#0a2a40', '#1a4a6e'],
  dining:        ['#2a1a0a', '#4e3010'],
  accommodation: ['#1a1a3a', '#2a2a5a'],
  departure:     ['#1a0a2a', '#3a1a5a'],
};

function CardImage({ item }: { item: ItineraryItem }) {
  if (item.image) {
    return (
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
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
      <Ionicons name={CATEGORY_ICONS[item.category]} size={32} color="rgba(255,255,255,0.25)" />
    </View>
  );
}

function ItineraryCardComponent({
  item, isLast, nextDrive, completed, onToggleComplete,
}: ItineraryCardProps) {
  const handleMapPress = () => {
    if (!item.mapQuery) return;
    const url = Platform.OS === 'web'
      ? `https://maps.google.com/?q=${encodeURIComponent(item.mapQuery)}`
      : `https://maps.google.com/?q=${encodeURIComponent(item.mapQuery)}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.row}>
      {/* Timeline column */}
      <View style={styles.timeline}>
        <TouchableOpacity
          onPress={() => onToggleComplete?.(item.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={[styles.dot, completed && styles.dotCompleted]}>
            {completed && <Ionicons name="checkmark" size={7} color="#fff" />}
          </View>
        </TouchableOpacity>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content column */}
      <View style={styles.content}>
        <Text style={[styles.time, completed && styles.timeCompleted]}>{item.time}</Text>

        <View style={[styles.card, completed && styles.cardCompleted]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.title, completed && styles.titleCompleted]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.cardActions}>
              {item.mapQuery && (
                <TouchableOpacity onPress={handleMapPress} style={styles.mapBtn} activeOpacity={0.7}>
                  <Ionicons name="location-outline" size={14} color={Colors.primary} />
                </TouchableOpacity>
              )}
              <View style={[styles.tag, { backgroundColor: item.tagColor + '33' }]}>
                <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.description, completed && styles.descriptionCompleted]}>
            {item.description}
          </Text>

          {!completed && <CardImage item={item} />}
        </View>

        {/* Drive chip rendered after the card, before next card's dot */}
        {nextDrive && (
          <View style={styles.driveChipRow}>
            <Ionicons name="car-outline" size={11} color={Colors.onSurfaceVariant} />
            <Text style={styles.driveChipText}>{nextDrive.duration} · {nextDrive.distance}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export const ItineraryCard = memo(ItineraryCardComponent);

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: Colors.primary + 'aa',
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
  timeCompleted: {
    opacity: 0.5,
  },
  card: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    gap: Spacing.sm,
  },
  cardCompleted: {
    opacity: 0.65,
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
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.onSurfaceVariant,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexShrink: 0,
  },
  mapBtn: {
    width: 26,
    height: 26,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
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
  descriptionCompleted: {
    opacity: 0.7,
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

  // Drive chip
  driveChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: Radii.full,
    paddingVertical: 4,
    paddingRight: Spacing.sm,
  },
  driveChipText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
});
