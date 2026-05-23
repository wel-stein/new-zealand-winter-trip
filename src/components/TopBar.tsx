import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing } from '../constants/typography';

interface TopBarProps {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
}

export function TopBar({ onMenuPress, onSearchPress }: TopBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButton} hitSlop={8}>
        <Ionicons name="menu" size={24} color={Colors.onSurface} />
      </TouchableOpacity>

      <Text style={styles.title}>新西兰冬梦幻之旅</Text>

      <TouchableOpacity onPress={onSearchPress} style={styles.iconButton} hitSlop={8}>
        <Ionicons name="search" size={22} color={Colors.onSurface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.glassBackground,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 17,
  },
});
