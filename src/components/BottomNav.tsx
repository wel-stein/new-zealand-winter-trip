import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NavTab = 'home' | 'itinerary' | 'explore' | 'currency';

interface NavItem {
  id: NavTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',     label: '首页', icon: 'home-outline',            iconActive: 'home' },
  { id: 'itinerary',label: '行程', icon: 'map-outline',             iconActive: 'map' },
  { id: 'explore',  label: '探索', icon: 'compass-outline',         iconActive: 'compass' },
  { id: 'currency', label: '换汇', icon: 'swap-horizontal-outline', iconActive: 'swap-horizontal' },
];

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onTabChange(item.id)}
            style={styles.navItem}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <Ionicons
              name={isActive ? item.iconActive : item.icon}
              size={24}
              color={isActive ? Colors.primary : Colors.onSurfaceVariant}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderTopWidth: 1,
    borderTopColor: Colors.cardStroke,
    paddingTop: Spacing.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    paddingTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -Spacing.sm,
    width: 32,
    height: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  navLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  navLabelActive: {
    color: Colors.primary,
  },
});
