import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

export type ContentTab = 'text' | 'map' | 'accommodation';

interface TabConfig {
  id: ContentTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  { id: 'text',          label: '行程', icon: 'list-outline' },
  { id: 'map',           label: '地图', icon: 'map-outline' },
  { id: 'accommodation', label: '住宿', icon: 'bed-outline' },
];

interface ContentTabBarProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

export function ContentTabBar({ activeTab, onTabChange }: ContentTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabGroup}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={isActive ? Colors.onPrimaryContainer : Colors.onSurfaceVariant}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
