import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { DATE_PICKER_DAYS, TRIP_DAYS, TRIP_DESTINATIONS, WeatherType } from '../data/itinerary';

const WEATHER_ICONS: Record<WeatherType, keyof typeof Ionicons.glyphMap> = {
  'sunny': 'sunny-outline',
  'cloudy': 'cloudy-outline',
  'snowy': 'snow-outline',
  'rainy': 'rainy-outline',
  'partly-cloudy': 'partly-sunny-outline',
};

interface DatePickerDayProps {
  day: number;
  dayName: string;
  weather: WeatherType;
  selected: boolean;
  onPress: () => void;
}

function DatePickerDay({ day, dayName, weather, selected, onPress }: DatePickerDayProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.dayButton, selected && styles.dayButtonSelected]}
    >
      <Text style={[styles.dayName, selected && styles.dayNameSelected]}>{dayName}</Text>
      <Text style={[styles.dayNumber, selected && styles.dayNumberSelected]}>{day}</Text>
      <Ionicons
        name={WEATHER_ICONS[weather]}
        size={16}
        color={selected ? Colors.onPrimary : Colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
}

interface TripOverviewProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

export function TripOverview({ selectedDay, onDaySelect }: TripOverviewProps) {
  return (
    <View style={styles.container}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.statText}>{TRIP_DAYS}天 · {TRIP_DESTINATIONS}个目的地</Text>
        </View>
        <View style={styles.weatherIcons}>
          <Ionicons name="sunny-outline" size={18} color={Colors.onSurfaceVariant} />
          <Ionicons name="cloudy-outline" size={18} color={Colors.onSurfaceVariant} />
          <Ionicons name="snow-outline" size={18} color={Colors.secondary} />
        </View>
      </View>

      {/* Date picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePicker}
      >
        {DATE_PICKER_DAYS.map((item) => (
          <DatePickerDay
            key={item.day}
            day={item.day}
            dayName={item.dayName}
            weather={item.weather}
            selected={selectedDay === item.day}
            onPress={() => onDaySelect(item.day)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  weatherIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  datePicker: {
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  dayButton: {
    width: 60,
    height: 84,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primary,
  },
  dayName: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  dayNameSelected: {
    color: Colors.onPrimaryContainer,
  },
  dayNumber: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 22,
    lineHeight: 26,
  },
  dayNumberSelected: {
    color: Colors.onPrimaryContainer,
  },
});
