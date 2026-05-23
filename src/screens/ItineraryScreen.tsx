import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { TopBar } from '../components/TopBar';
import { HeroSection } from '../components/HeroSection';
import { TripOverview } from '../components/TripOverview';
import { ContentTabBar, ContentTab } from '../components/ContentTabBar';
import { ItinerarySection } from '../components/ItinerarySection';
import { MapView } from '../components/MapView';
import { TipsSection } from '../components/TipsSection';

export function ItineraryScreen() {
  const [selectedDay, setSelectedDay] = useState(25);
  const [activeTab, setActiveTab] = useState<ContentTab>('text');

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
        <ContentTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'text' ? (
          <>
            <ItinerarySection />
            <TipsSection />
          </>
        ) : (
          <MapView />
        )}
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
