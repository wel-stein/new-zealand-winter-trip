import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Platform, Animated, NativeSyntheticEvent, NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { DATE_PICKER_DAYS, TRIP_DAYS, TRIP_DESTINATIONS, WeatherType, getItineraryForDay } from '../data/itinerary';

const DAY_WIDTH = 56;
const DAY_GAP = Spacing.sm; // 8 — gap between day chips
const SNAP_INTERVAL = DAY_WIDTH + DAY_GAP;

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

// ─── WMO weather code → icon + label ─────────────────────────────────────────

const WMO_MAP: Record<number, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  0: { icon: 'sunny', label: '晴' },
  1: { icon: 'sunny', label: '大致晴' },
  2: { icon: 'partly-sunny', label: '多云' },
  3: { icon: 'cloudy', label: '阴天' },
  45: { icon: 'cloudy', label: '有雾' },
  48: { icon: 'cloudy', label: '雾凇' },
  51: { icon: 'rainy', label: '细雨' },
  53: { icon: 'rainy', label: '小雨' },
  55: { icon: 'rainy', label: '中雨' },
  61: { icon: 'rainy', label: '小雨' },
  63: { icon: 'rainy', label: '中雨' },
  65: { icon: 'rainy', label: '大雨' },
  71: { icon: 'snow', label: '小雪' },
  73: { icon: 'snow', label: '中雪' },
  75: { icon: 'snow', label: '大雪' },
  77: { icon: 'snow', label: '雪粒' },
  80: { icon: 'rainy', label: '阵雨' },
  81: { icon: 'rainy', label: '中阵雨' },
  82: { icon: 'thunderstorm', label: '暴雨' },
  85: { icon: 'snow', label: '阵雪' },
  86: { icon: 'snow', label: '大阵雪' },
  95: { icon: 'thunderstorm', label: '雷暴' },
  96: { icon: 'thunderstorm', label: '雷暴冰雹' },
  99: { icon: 'thunderstorm', label: '雷暴大冰雹' },
};

function getWmo(code: number) {
  return WMO_MAP[code] ?? WMO_MAP[Math.floor(code / 10) * 10] ?? { icon: 'cloudy' as const, label: '未知' };
}

interface WeatherData {
  temp: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

function useWeather(selectedDay: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const dayData = getItineraryForDay(selectedDay);

    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${dayData.lat}&longitude=${dayData.lng}&current=temperature_2m,weather_code&timezone=auto`
    )
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const code: number = json?.current?.weather_code ?? 3;
        const temp: number = json?.current?.temperature_2m ?? 0;
        const wmo = getWmo(code);
        setWeather({ temp: Math.round(temp), icon: wmo.icon, label: wmo.label });
      })
      .catch(() => {
        if (!cancelled) setWeather(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [selectedDay]);

  return { weather, loading };
}

interface TripOverviewProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

export function TripOverview({ selectedDay, onDaySelect }: TripOverviewProps) {
  const { weather, loading: weatherLoading } = useWeather(selectedDay);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);
  const drag = useRef({ active: false, startX: 0, startScrollX: 0 });

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
        <View style={styles.weatherStrip}>
          {weatherLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : weather ? (
            <>
              <Ionicons name={weather.icon} size={18} color={Colors.primary} />
              <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
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
