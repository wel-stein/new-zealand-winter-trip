import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography, Spacing } from '../constants/typography';

export function TopBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>新西兰冬梦幻之旅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.glassBackground,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 17,
  },
});
