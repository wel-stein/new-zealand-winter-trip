import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { ItineraryCard } from './ItineraryCard';
import { getItineraryForDay, ItineraryItem } from '../data/itinerary';
import { WeatherData } from '../hooks/useWeather';

// ─── Category filter ──────────────────────────────────────────────────────────

type FilterKey = 'all' | 'dining' | 'activity' | 'accommodation' | 'transport';

const FILTER_LABELS: Record<FilterKey, string> = {
  all:           '全部',
  dining:        '餐饮',
  activity:      '景点',
  accommodation: '住宿',
  transport:     '交通',
};

function matchesFilter(item: ItineraryItem, filter: FilterKey): boolean {
  if (filter === 'all')           return true;
  if (filter === 'dining')        return item.category === 'dining';
  if (filter === 'activity')      return item.category === 'activity';
  if (filter === 'accommodation') return item.category === 'accommodation';
  if (filter === 'transport')     return item.category === 'arrival' || item.category === 'departure';
  return true;
}

// ─── AsyncStorage completion tracking ────────────────────────────────────────

const STORAGE_KEY = 'completed_items_v1';

async function loadCompleted(): Promise<Set<string>> {
  try {
    const val = await AsyncStorage.getItem(STORAGE_KEY);
    return val ? new Set<string>(JSON.parse(val)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

async function saveCompleted(ids: Set<string>): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

// ─── Auto-complete past days ─────────────────────────────────────────────────

function isDayInPast(day: number): boolean {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const todayOrd = currentMonth * 100 + currentDay;
  const dayMonth = day >= 25 ? 5 : 6;
  const dayOrd = dayMonth * 100 + day;
  return dayOrd < todayOrd;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ItinerarySectionProps {
  selectedDay: number;
  weather?: WeatherData | null;
  weatherLoading?: boolean;
  weatherStale?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ItinerarySection({
  selectedDay,
  weather,
  weatherLoading,
  weatherStale,
}: ItinerarySectionProps) {
  const dayData = getItineraryForDay(selectedDay);

  const [filter, setFilter] = useState<FilterKey>('all');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [storageReady, setStorageReady] = useState(false);

  // Load persisted completions on mount
  useEffect(() => {
    loadCompleted().then((ids) => {
      setCompletedIds(ids);
      setStorageReady(true);
    });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveCompleted(next);
      return next;
    });
  }, []);

  // Reset filter when day changes
  useEffect(() => { setFilter('all'); }, [selectedDay]);

  // Which filter chips have items for this day?
  const availableFilters: FilterKey[] = (['all', 'dining', 'activity', 'accommodation', 'transport'] as FilterKey[]).filter(
    (key) => key === 'all' || dayData.items.some((item) => matchesFilter(item, key)),
  );

  const filteredItems = dayData.items.filter((item) => matchesFilter(item, filter));

  // Auto-complete all items for past days
  const dayPast = isDayInPast(selectedDay);

  // Day completion progress
  const totalCount = dayData.items.length;
  const completedCount = dayPast
    ? totalCount
    : dayData.items.filter((item) => completedIds.has(item.id)).length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>{dayData.dayTitle}</Text>
          <Text style={styles.location}>{dayData.location}</Text>
        </View>

        {/* Weather badge */}
        <View style={styles.headerRight}>
          {weatherLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : weather ? (
            <View style={[styles.weatherBadge, weatherStale && styles.weatherBadgeStale]}>
              {weatherStale && (
                <Ionicons name="warning-outline" size={10} color={Colors.secondary} />
              )}
              <Ionicons name={weather.icon} size={15} color={Colors.primary} />
              <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
              <Text style={styles.weatherLabel}>{weather.label}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Progress bar */}
      {storageReady && (
        <View style={styles.progressRow}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` as any }]} />
          </View>
          <Text style={styles.progressText}>{completedCount}/{totalCount} 已完成</Text>
        </View>
      )}

      {/* Category filter chips */}
      {availableFilters.length > 2 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {availableFilters.map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setFilter(key)}
              style={[styles.filterChip, filter === key && styles.filterChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, filter === key && styles.filterChipTextActive]}>
                {FILTER_LABELS[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Timeline */}
      <View style={styles.timeline}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={32} color={Colors.outlineVariant} />
            <Text style={styles.emptyText}>该类别今日无行程</Text>
          </View>
        ) : (
          filteredItems.map((item, index) => {
            const isLast = index === filteredItems.length - 1;
            const nextItem = filteredItems[index + 1];
            return (
              <ItineraryCard
                key={item.id}
                item={item}
                isLast={isLast}
                nextDrive={nextItem?.drive}
                completed={dayPast || completedIds.has(item.id)}
                onToggleComplete={dayPast ? undefined : (storageReady ? toggleComplete : undefined)}
              />
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    paddingTop: 2,
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

  // Weather badge
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  weatherBadgeStale: {
    borderColor: Colors.secondary + '66',
  },
  weatherTemp: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    fontSize: 12,
  },
  weatherLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.outlineVariant,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  progressText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    minWidth: 56,
    textAlign: 'right',
  },

  // Filter chips
  filterRow: {
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
    paddingRight: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: Colors.onPrimaryContainer,
  },

  // Timeline
  timeline: {
    gap: 0,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
});
