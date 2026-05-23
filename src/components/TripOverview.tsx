import React, { useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Platform, Animated, NativeSyntheticEvent, NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { DATE_PICKER_DAYS, TRIP_DAYS, TRIP_DESTINATIONS, WeatherType } from '../data/itinerary';
import { WeatherData } from '../hooks/useWeather';

const DAY_WIDTH = 56;
const DAY_GAP = Spacing.sm; // 8 — gap between day chips
const SNAP_INTERVAL = DAY_WIDTH + DAY_GAP;
const MONTH_LABEL_APPROX = 36; // approximate rendered width of a month label

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevSelected = useRef(selected);

  useEffect(() => {
    if (selected && !prevSelected.current) {
      // Spring bounce on selection
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
          speed: 60,
          bounciness: 10,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 4,
        }),
      ]).start();
    }
    prevSelected.current = selected;
  }, [selected, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.dayButton, selected && styles.dayButtonSelected]}
      >
        <Text style={[styles.dayName, selected && styles.dayNameSelected]}>{dayName}</Text>
        <Text style={[styles.dayNumber, selected && styles.dayNumberSelected]}>{day}</Text>
        <Ionicons
          name={WEATHER_ICONS[weather]}
          size={15}
          color={selected ? Colors.onPrimaryContainer : Colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

function MonthLabel({ label }: { label: string }) {
  return (
    <View style={styles.monthLabelWrapper}>
      <Text style={styles.monthLabel}>{label}</Text>
      <View style={styles.monthDivider} />
    </View>
  );
}

interface TripOverviewProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  weather?: WeatherData | null;
  weatherLoading?: boolean;
  weatherStale?: boolean;
}

export function TripOverview({
  selectedDay,
  onDaySelect,
  weather,
  weatherLoading,
  weatherStale,
}: TripOverviewProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);
  const drag = useRef({ active: false, startX: 0, startScrollX: 0 });

  // Scroll to the selected day chip on first render (jump-to-today)
  useEffect(() => {
    const todayIndex = DATE_PICKER_DAYS.findIndex((d) => d.day === selectedDay);
    if (todayIndex <= 0) return;
    const labelsBeforeCount = DATE_PICKER_DAYS.slice(0, todayIndex).filter((d) => d.monthStart).length;
    const offset =
      MONTH_LABEL_APPROX +
      todayIndex * (DAY_WIDTH + DAY_GAP) +
      labelsBeforeCount * (MONTH_LABEL_APPROX + DAY_GAP) -
      DAY_GAP;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: Math.max(0, offset), animated: true });
    }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = e.nativeEvent.contentOffset.x;
  }, []);

  // --- Web-only mouse drag handlers ---
  const onMouseDown = useCallback((e: any) => {
    drag.current = { active: true, startX: e.pageX, startScrollX: scrollX.current };
    // Show grabbing cursor while dragging
    if (e.currentTarget?.style) e.currentTarget.style.cursor = 'grabbing';
    e.preventDefault(); // prevent text selection
  }, []);

  const onMouseMove = useCallback((e: any) => {
    if (!drag.current.active) return;
    const dx = drag.current.startX - e.pageX;
    scrollRef.current?.scrollTo({
      x: Math.max(0, drag.current.startScrollX + dx),
      animated: false,
    });
  }, []);

  const onMouseUp = useCallback((e: any) => {
    drag.current.active = false;
    if (e.currentTarget?.style) e.currentTarget.style.cursor = 'grab';
  }, []);

  const webProps = Platform.OS === 'web'
    ? { onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp }
    : {};

  return (
    <View style={styles.container}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
          <Text style={styles.statText}>{TRIP_DAYS}天 · {TRIP_DESTINATIONS}个目的地</Text>
        </View>
        <View style={[styles.weatherStrip, weatherStale && styles.weatherStripStale]}>
          {weatherLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : weather ? (
            <>
              {weatherStale && (
                <Ionicons name="warning-outline" size={12} color={Colors.secondary} />
              )}
              <Ionicons name={weather.icon} size={18} color={Colors.primary} />
              <Text style={styles.weatherTemp}>{weatherStale ? '~' : ''}{weather.temp}°C</Text>
              <Text style={styles.weatherLabel}>{weather.label}</Text>
            </>
          ) : (
            <Ionicons name="cloudy-outline" size={18} color={Colors.onSurfaceVariant} />
          )}
        </View>
      </View>

      {/* Date picker – May 25 → Jun 4, draggable */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.datePicker}
        // Web: override cursor to indicate draggability
        style={Platform.OS === 'web' ? (styles.scrollWeb as any) : undefined}
        {...webProps}
      >
        {DATE_PICKER_DAYS.map((item, index) => {
          const showMonthLabel = index === 0 || item.monthStart;
          return (
            <React.Fragment key={`${item.month}-${item.day}`}>
              {showMonthLabel && <MonthLabel label={item.month} />}
              <DatePickerDay
                day={item.day}
                dayName={item.dayName}
                weather={item.weather}
                selected={selectedDay === item.day}
                onPress={() => onDaySelect(item.day)}
              />
            </React.Fragment>
          );
        })}
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
  weatherStrip: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  weatherStripStale: {
    borderColor: Colors.secondary + '66',
  },
  weatherTemp: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    fontSize: 13,
  },
  weatherLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  datePicker: {
    gap: DAY_GAP,
    alignItems: 'flex-end',
    paddingRight: Spacing.sm,
  },
  scrollWeb: {
    cursor: 'grab' as any,
    userSelect: 'none' as any,
  },
  dayButton: {
    width: DAY_WIDTH,
    height: 80,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
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
    fontSize: 10,
  },
  dayNameSelected: {
    color: Colors.onPrimaryContainer,
  },
  dayNumber: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 20,
    lineHeight: 24,
  },
  dayNumberSelected: {
    color: Colors.onPrimaryContainer,
  },
  monthLabelWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xs,
    gap: 4,
  },
  monthLabel: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
    letterSpacing: 1,
  },
  monthDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.6,
  },
});
