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

export function ItineraryScreen() {
  const [selectedDay, setSelectedDay] = useState(25);
  const [activeTab, setActiveTab] = useState<ContentTab>('text');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleTabChange = useCallback((tab: ContentTab) => {
    // Fade + slide down out
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 12, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setActiveTab(tab);
      // Reset position above, then fade + slide down into view
      slideAnim.setValue(-12);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <TripOverview selectedDay={selectedDay} onDaySelect={setSelectedDay} />
        <ContentTabBar activeTab={activeTab} onTabChange={handleTabChange} />

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {activeTab === 'text' && (
            <>
              <ItinerarySection />
              <TipsSection />
            </>
          )}
          {activeTab === 'map' && <MapView />}
          {activeTab === 'accommodation' && <AccommodationView />}
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
