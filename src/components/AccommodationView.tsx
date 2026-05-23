import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

interface Hotel {
  name: string;
  nameEn: string;
  location: string;
  nights: string;
  grade: string;
  gradeColor: string;
  amenities: string[];
}

const HOTELS: Hotel[] = [
  {
    name: '大使奥克兰酒店',
    nameEn: 'Grand Mercure Auckland',
    location: '奥克兰市中心',
    nights: '第1-2晚',
    grade: '五星',
    gradeColor: '#c9a84c',
    amenities: ['早餐', '健身房', '城市景观'],
  },
  {
    name: '罗托鲁瓦温泉度假村',
    nameEn: 'Polynesian Spa Resort',
    location: '罗托鲁瓦',
    nights: '第3-4晚',
    grade: '四星',
    gradeColor: Colors.secondary,
    amenities: ['温泉', '早餐', '湖景'],
  },
  {
    name: '皇后镇山景精品酒店',
    nameEn: 'The Rees Hotel Queenstown',
    location: '皇后镇湖畔',
    nights: '第5-8晚',
    grade: '五星',
    gradeColor: '#c9a84c',
    amenities: ['早餐', '湖景', '水疗'],
  },
  {
    name: '米尔福德峡湾生态小屋',
    nameEn: 'Milford Sound Lodge',
    location: '米尔福德峡湾',
    nights: '第9-11晚',
    grade: '精品',
    gradeColor: Colors.primary,
    amenities: ['全餐', '峡湾景观', '生态导览'],
  },
];

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <View style={styles.card}>
      {/* Image placeholder */}
      <View style={styles.cardImage}>
        <LinearGradient
          colors={['#0a2a40', '#0d3324']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="bed-outline" size={28} color="rgba(149,212,179,0.25)" />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelNameEn}>{hotel.nameEn}</Text>
          </View>
          <View style={[styles.gradeBadge, { borderColor: hotel.gradeColor }]}>
            <Text style={[styles.gradeText, { color: hotel.gradeColor }]}>{hotel.grade}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.metaText}>{hotel.location}</Text>
          <View style={styles.dot} />
          <Ionicons name="moon-outline" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.metaText}>{hotel.nights}</Text>
        </View>

        <View style={styles.amenities}>
          {hotel.amenities.map((a) => (
            <View key={a} style={styles.chip}>
              <Text style={styles.chipText}>{a}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function AccommodationView() {
  return (
    <View style={styles.container}>
      {HOTELS.map((hotel) => (
        <HotelCard key={hotel.nameEn} hotel={hotel} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    overflow: 'hidden',
  },
  cardImage: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  hotelName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 16,
  },
  hotelNameEn: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  gradeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
    flexShrink: 0,
  },
  gradeText: {
    ...Typography.labelSm,
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.outlineVariant,
    marginHorizontal: 2,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryContainer + '55',
  },
  chipText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
  },
});
