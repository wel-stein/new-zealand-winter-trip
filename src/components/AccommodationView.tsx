import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';
import {
  HotelBooking,
  getHotelForDay,
  getNextHotel,
  dayToNum,
  HOTEL_BOOKINGS,
} from '../data/itinerary';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function monthLabel(day: number) {
  return day >= 25 ? '5月' : '6月';
}

function formatDate(day: number) {
  return `${monthLabel(day)}${day}日`;
}

// ─── Hotel card ───────────────────────────────────────────────────────────────

interface HotelCardProps {
  hotel: HotelBooking;
  isCheckInDay: boolean;
  isLastNight: boolean;
}

function HotelCard({ hotel, isCheckInDay, isLastNight }: HotelCardProps) {
  const nightCount =
    dayToNum(hotel.checkOutDay) - dayToNum(hotel.checkInDay);

  return (
    <View style={styles.card}>
      {/* Decorative image header */}
      <View style={styles.cardBanner}>
        <LinearGradient
          colors={hotel.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="bed" size={36} color="rgba(149,212,179,0.18)" />

        {/* Status badge */}
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>已确认</Text>
        </View>

        {/* Today chip */}
        {isCheckInDay && (
          <View style={styles.todayChip}>
            <Text style={styles.todayChipText}>今日入住</Text>
          </View>
        )}
        {isLastNight && !isCheckInDay && (
          <View style={[styles.todayChip, styles.lastNightChip]}>
            <Text style={styles.todayChipText}>明日退房</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.cardBody}>
        <Text style={styles.hotelName}>{hotel.name}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.locationText}>{hotel.location}</Text>
        </View>

        {/* Check-in / check-out row */}
        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>入住</Text>
            <Text style={styles.timeValue}>{hotel.checkInTime}</Text>
            <Text style={styles.timeDate}>{formatDate(hotel.checkInDay)}</Text>
          </View>

          <View style={styles.timeDivider}>
            <View style={styles.timeLine} />
            <Ionicons name="moon-outline" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.nightCount}>{nightCount}晚</Text>
            <View style={styles.timeLine} />
          </View>

          <View style={[styles.timeBlock, styles.timeBlockRight]}>
            <Text style={styles.timeLabel}>退房</Text>
            <Text style={styles.timeValue}>{hotel.checkOutTime}</Text>
            <Text style={styles.timeDate}>{formatDate(hotel.checkOutDay)}</Text>
          </View>
        </View>

        {/* Room info */}
        <View style={styles.roomRow}>
          <View style={styles.chip}>
            <Ionicons name="key-outline" size={12} color={Colors.primary} />
            <Text style={styles.chipText}>{hotel.rooms}间客房</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="document-text-outline" size={12} color={Colors.primary} />
            <Text style={styles.chipText}>{hotel.bookings}份预订</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="logo-web-component" size={12} color={Colors.secondary} />
            <Text style={[styles.chipText, { color: Colors.secondary }]}>Agoda</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoAccommodation({ day, nextHotel }: { day: number; nextHotel: HotelBooking | null }) {
  const isCheckout = HOTEL_BOOKINGS.some((h) => h.checkOutDay === day);
  return (
    <View style={styles.emptyState}>
      <Ionicons name="bed-outline" size={40} color={Colors.outlineVariant} />
      <Text style={styles.emptyTitle}>
        {isCheckout ? '今日退房日' : '暂无住宿安排'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isCheckout
          ? `${monthLabel(day)}${day}日办理退房手续`
          : '此日期暂无酒店预订记录'}
      </Text>
      {nextHotel && (
        <View style={styles.nextHotelHint}>
          <Ionicons name="arrow-forward-circle-outline" size={14} color={Colors.primary} />
          <Text style={styles.nextHotelText}>
            下一站：{nextHotel.name}（{formatDate(nextHotel.checkInDay)} {nextHotel.checkInTime} 入住）
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Trip summary strip ───────────────────────────────────────────────────────

function TripSummary() {
  return (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>行程住宿总览</Text>
      {HOTEL_BOOKINGS.map((h) => {
        const nights = dayToNum(h.checkOutDay) - dayToNum(h.checkInDay);
        return (
          <View key={h.id} style={styles.summaryRow}>
            <View style={[styles.summaryDot, { backgroundColor: h.gradient[1] }]} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryName}>{h.name}</Text>
              <Text style={styles.summaryMeta}>
                {formatDate(h.checkInDay)} – {formatDate(h.checkOutDay)} · {nights}晚
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AccommodationViewProps {
  selectedDay: number;
}

export function AccommodationView({ selectedDay }: AccommodationViewProps) {
  const hotel = getHotelForDay(selectedDay);
  const next = hotel ? null : getNextHotel(selectedDay);
  const isCheckInDay = hotel?.checkInDay === selectedDay;
  const isLastNight =
    hotel != null &&
    dayToNum(hotel.checkOutDay) - dayToNum(selectedDay) === 1;

  return (
    <View style={styles.container}>
      {hotel ? (
        <HotelCard
          hotel={hotel}
          isCheckInDay={!!isCheckInDay}
          isLastNight={!!isLastNight}
        />
      ) : (
        <NoAccommodation day={selectedDay} nextHotel={next} />
      )}

      <TripSummary />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },

  // Card
  card: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    overflow: 'hidden',
  },
  cardBanner: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  statusText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
  },
  todayChip: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  lastNightChip: {
    backgroundColor: Colors.secondaryContainer,
  },
  todayChipText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
    fontSize: 11,
  },
  cardBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  hotelName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 17,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },

  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.DEFAULT,
    padding: Spacing.sm + 4,
    marginVertical: Spacing.xs,
  },
  timeBlock: {
    alignItems: 'flex-start',
    gap: 2,
  },
  timeBlockRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  timeValue: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 18,
    lineHeight: 22,
  },
  timeDate: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  timeDivider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  timeLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  nightCount: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },

  // Chips
  roomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryContainer + '44',
  },
  chipText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  emptyTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 16,
  },
  emptySubtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  nextHotelHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  nextHotelText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 12,
    flex: 1,
  },

  // Summary
  summary: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  summaryTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 15,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 3,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: Radii.full,
    flexShrink: 0,
  },
  summaryInfo: {
    flex: 1,
    gap: 1,
  },
  summaryName: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontSize: 13,
  },
  summaryMeta: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
});
