import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { ItineraryScreen } from '@/src/screens/ItineraryScreen';
import { CurrencyScreen } from '@/src/screens/CurrencyScreen';
import { EmergencyScreen } from '@/src/screens/EmergencyScreen';
import { BottomNav, NavTab } from '@/src/components/BottomNav';

export default function Index() {
  const [activeTab, setActiveTab] = useState<NavTab>('itinerary');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.body}>
          {activeTab === 'currency'  && <CurrencyScreen />}
          {activeTab === 'emergency' && <EmergencyScreen />}
          {activeTab === 'itinerary' && <ItineraryScreen />}
        </View>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
  },
});
