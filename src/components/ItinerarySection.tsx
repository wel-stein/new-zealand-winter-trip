import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography, Spacing } from '../constants/typography';
import { ItineraryCard } from './ItineraryCard';
import { getItineraryForDay } from '../data/itinerary';

interface ItinerarySectionProps {
  selectedDay: number;
}

export function ItinerarySection({ selectedDay }: ItinerarySectionProps) {
  const dayData = getItineraryForDay(selectedDay);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>{dayData.dayTitle}</Text>
          <Text style={styles.location}>{dayData.location}</Text>
        </View>
      </View>

      <View style={styles.timeline}>
        {dayData.items.map((item, index) => (
          <ItineraryCard
            key={item.id}
            item={item}
            isLast={index === dayData.items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  location: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
    marginTop: 2,
  },
  timeline: {
    gap: 0,
  },
});
