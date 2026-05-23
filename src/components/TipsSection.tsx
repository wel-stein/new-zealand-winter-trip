import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import { WINTER_TIPS, TipCard } from '../data/itinerary';

function TipCardComponent({ tip }: { tip: TipCard }) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={tip.icon as any}
          size={22}
          color={Colors.primary}
        />
      </View>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      <Text style={styles.tipDescription}>{tip.description}</Text>
    </View>
  );
}

export function TipsSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>冬季出行贴士</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {WINTER_TIPS.map((tip) => (
          <TipCardComponent key={tip.id} tip={tip} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    paddingHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  tipCard: {
    width: 180,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    gap: Spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radii.DEFAULT,
    backgroundColor: Colors.primaryContainer + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tipTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 15,
  },
  tipDescription: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    fontSize: 13,
  },
});
