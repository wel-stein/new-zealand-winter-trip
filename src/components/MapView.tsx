import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { getItineraryForDay, ITINERARY_BY_DAY } from '../data/itinerary';

interface MapViewProps {
  selectedDay: number;
}

export function MapView({ selectedDay }: MapViewProps) {
  const dayData = getItineraryForDay(selectedDay);
  const currentIndex = ITINERARY_BY_DAY.findIndex((d) => d.day === selectedDay);

  return (
    <View style={styles.container}>
      {/* Map placeholder showing current location */}
      <View style={styles.mapPlaceholder}>
        <LinearGradient
          colors={['#0a1f2e', '#0d3324', '#162d45']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.locationPin}>
          <Ionicons name="location" size={28} color={Colors.primary} />
        </View>
        <Text style={styles.mapLabel}>{dayData.location}</Text>
        <Text style={styles.mapSubLabel}>{dayData.dayTitle}</Text>
      </View>

      {/* 11-day trip progress bar */}
      <View style={styles.progressRow}>
        {ITINERARY_BY_DAY.map((d, index) => {
          const isActive = d.day === selectedDay;
          const isPast = index < currentIndex;
          return (
            <React.Fragment key={d.day}>
              <View style={[
                styles.progressDot,
                isPast && styles.progressDotPast,
                isActive && styles.progressDotActive,
              ]}>
                {isActive && <View style={styles.progressDotInner} />}
              </View>
              {index < ITINERARY_BY_DAY.length - 1 && (
                <View style={[styles.progressLine, isPast && styles.progressLinePast]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.progressLabels}>
        <Text style={styles.progressLabelText}>5月25日</Text>
        <Text style={styles.progressLabelText}>6月4日</Text>
      </View>

      {/* Today's stops as a timeline */}
      <View style={styles.stopsCard}>
        <Text style={styles.sectionTitle}>今日行程路线</Text>
        {dayData.items.map((item, index) => {
          const isLast = index === dayData.items.length - 1;
          return (
            <View key={item.id} style={styles.stopRow}>
              <View style={styles.stopLeft}>
                <View style={[styles.stopDot, { backgroundColor: item.tagColor }]} />
                {!isLast && <View style={styles.stopLine} />}
              </View>
              <View style={[styles.stopContent, !isLast && { paddingBottom: Spacing.md }]}>
                <Text style={styles.stopTime}>{item.time}</Text>
                <View style={styles.stopTextRow}>
                  <Text style={styles.stopTitle}>{item.title}</Text>
                  <View style={[styles.stopTag, { backgroundColor: item.tagColor + '33' }]}>
                    <Text style={[styles.stopTagText, { color: item.tagColor }]}>{item.tag}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },

  // Map placeholder
  mapPlaceholder: {
    height: 180,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  locationPin: {
    width: 48,
    height: 48,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  mapLabel: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 16,
    textAlign: 'center',
  },
  mapSubLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    textAlign: 'center',
  },

  // Progress bar
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: Radii.full,
    backgroundColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotPast: {
    backgroundColor: Colors.primary + '66',
  },
  progressDotActive: {
    width: 14,
    height: 14,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  progressDotInner: {
    width: 5,
    height: 5,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.outlineVariant,
  },
  progressLinePast: {
    backgroundColor: Colors.primary + '66',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 2,
  },
  progressLabelText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },

  // Stops timeline
  stopsCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stopRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    minHeight: 48,
  },
  stopLeft: {
    width: 16,
    alignItems: 'center',
    paddingTop: 4,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: Radii.full,
  },
  stopLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.outlineVariant,
    marginTop: 4,
  },
  stopContent: {
    flex: 1,
  },
  stopTime: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 2,
  },
  stopTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  stopTitle: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontSize: 14,
    flex: 1,
  },
  stopTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
  },
  stopTagText: {
    ...Typography.labelSm,
    fontSize: 10,
  },
});
