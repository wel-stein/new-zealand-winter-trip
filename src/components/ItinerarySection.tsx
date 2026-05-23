import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography, Spacing } from '../constants/typography';
import { ItineraryCard } from './ItineraryCard';
import { DAY_25_ITINERARY } from '../data/itinerary';

export function ItinerarySection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>每日行程</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>查看全部</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeline}>
        {DAY_25_ITINERARY.map((item, index) => (
          <ItineraryCard
            key={item.id}
            item={item}
            isLast={index === DAY_25_ITINERARY.length - 1}
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
  viewAll: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontSize: 13,
  },
  timeline: {
    gap: 0,
  },
});
