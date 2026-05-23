import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { DESTINATIONS } from '../data/itinerary';

export function MapView() {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <LinearGradient
          colors={['#0a1f2e', '#0d3324', '#162d45']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="map" size={48} color="rgba(149,212,179,0.2)" />
        <Text style={styles.mapLabel}>新西兰路线图</Text>
        <Text style={styles.mapSubLabel}>地图视图开发中</Text>
      </View>

      <View style={styles.destinationList}>
        {DESTINATIONS.map((dest, index) => (
          <View key={dest.nameEn} style={styles.destItem}>
            <View style={styles.destNumber}>
              <Text style={styles.destNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.destInfo}>
              <Text style={styles.destName}>{dest.name}</Text>
              <Text style={styles.destNameEn}>{dest.nameEn}</Text>
            </View>
            <Text style={styles.destDays}>第{dest.days}天</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  mapLabel: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 16,
  },
  mapSubLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  destinationList: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    overflow: 'hidden',
  },
  destItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.031)',
    gap: Spacing.md,
  },
  destNumber: {
    width: 28,
    height: 28,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destNumberText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
    fontSize: 12,
  },
  destInfo: {
    flex: 1,
  },
  destName: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontWeight: '500',
  },
  destNameEn: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  destDays: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontSize: 12,
  },
});
