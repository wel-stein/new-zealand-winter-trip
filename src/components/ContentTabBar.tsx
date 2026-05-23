import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

export type ContentTab = 'text' | 'map';

interface ContentTabBarProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export function ContentTabBar({ activeTab, onTabChange }: ContentTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabGroup}>
        <TouchableOpacity
          onPress={() => onTabChange('text')}
          style={[styles.tab, activeTab === 'text' && styles.tabActive]}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={activeTab === 'text' ? Colors.onPrimary : Colors.onSurfaceVariant}
          />
          <Text style={[styles.tabLabel, activeTab === 'text' && styles.tabLabelActive]}>
            行程
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTabChange('map')}
          style={[styles.tab, activeTab === 'map' && styles.tabActive]}
        >
          <Ionicons
            name="map-outline"
            size={16}
            color={activeTab === 'map' ? Colors.onPrimary : Colors.onSurfaceVariant}
          />
          <Text style={[styles.tabLabel, activeTab === 'map' && styles.tabLabelActive]}>
            地图
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
  },
  tabGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.DEFAULT,
    padding: 3,
    alignSelf: 'flex-start',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.sm + 2,
  },
  tabActive: {
    backgroundColor: Colors.primaryContainer,
  },
  tabLabel: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  tabLabelActive: {
    color: Colors.onPrimaryContainer,
  },
});
