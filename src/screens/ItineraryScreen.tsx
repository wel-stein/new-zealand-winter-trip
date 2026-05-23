import React, { useState, useRef, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';
import { TopBar } from '../components/TopBar';
import { HeroSection } from '../components/HeroSection';
import { TripOverview } from '../components/TripOverview';
import { ContentTabBar, ContentTab } from '../components/ContentTabBar';
import { ItinerarySection } from '../components/ItinerarySection';
import { MapView } from '../components/MapView';
import { AccommodationView } from '../components/AccommodationView';
import { TipsSection } from '../components/TipsSection';
import { getItineraryForDay, DATE_PICKER_DAYS } from '../data/itinerary';
import { useWeather } from '../hooks/useWeather';

function getTodayTripDay(): number {
  const today = new Date();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  if (m === 5 && d >= 25 && d <= 31) return d;
  if (m === 6 && d >= 1 && d <= 4)   return d;
  const isBeforeTrip = m < 5 || (m === 5 && d < 25);
  return DATE_PICKER_DAYS[isBeforeTrip ? 0 : DATE_PICKER_DAYS.length - 1].day;
}

export function ItineraryScreen() {
  const [selectedDay, setSelectedDay] = useState(() => getTodayTripDay());
  const [activeTab, setActiveTab] = useState<ContentTab>('text');

  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Lifted weather — shared by TripOverview header and ItinerarySection header
  const dayData = getItineraryForDay(selectedDay);
  const { weather, loading: weatherLoading, stale: weatherStale } = useWeather(dayData.lat, dayData.lng);

  const handleTabChange = useCallback((tab: ContentTab) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0,  duration: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 12, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setActiveTab(tab);
      slideAnim.setValue(-12);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  // Map marker tap → switch to itinerary tab + select that day
  const handleMapDaySelect = useCallback((day: number) => {
    setSelectedDay(day);
    handleTabChange('text');
  }, [handleTabChange]);

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <TripOverview
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
          weather={weather}
          weatherLoading={weatherLoading}
          weatherStale={weatherStale}
        />
        <ContentTabBar activeTab={activeTab} onTabChange={handleTabChange} />

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {activeTab === 'text' && (
            <>
              <ItinerarySection
                selectedDay={selectedDay}
                weather={weather}
                weatherLoading={weatherLoading}
                weatherStale={weatherStale}
              />
              <TipsSection />
            </>
          )}
          {activeTab === 'map' && (
            <MapView selectedDay={selectedDay} onDaySelect={handleMapDaySelect} />
          )}
          {activeTab === 'accommodation' && (
            <AccommodationView selectedDay={selectedDay} />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
