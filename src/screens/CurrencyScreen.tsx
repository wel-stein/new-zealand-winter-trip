import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Animated, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = 'NZD_TO_MYR' | 'MYR_TO_NZD';

const FALLBACK_RATE = 2.78; // 1 NZD = 2.78 MYR (fallback if API unreachable)
const QUICK_AMOUNTS = [50, 100, 200, 500, 1000];

// ─── Currency card ────────────────────────────────────────────────────────────

interface CurrencyCardProps {
  flag: string;
  code: string;
  name: string;
  value: string;
  editable: boolean;
  onChangeText?: (v: string) => void;
  highlight?: boolean;
}

function CurrencyCard({
  flag, code, name, value, editable, onChangeText, highlight,
}: CurrencyCardProps) {
  return (
    <View style={[styles.currencyCard, highlight && styles.currencyCardActive]}>
      <View style={styles.currencyLabel}>
        <Text style={styles.flag}>{flag}</Text>
        <View>
          <Text style={styles.currencyCode}>{code}</Text>
          <Text style={styles.currencyName}>{name}</Text>
        </View>
      </View>
      {editable ? (
        <TextInput
          style={styles.amountInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={Colors.outlineVariant}
          selectionColor={Colors.primary}
          maxLength={12}
        />
      ) : (
        <Text style={styles.amountResult}>{value || '0.00'}</Text>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function CurrencyScreen() {
  const insets = useSafeAreaInsets();
  const [rate, setRate] = useState<number>(FALLBACK_RATE);
  const [rateLabel, setRateLabel] = useState('正在获取汇率…');
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<Direction>('NZD_TO_MYR');
  const [fromValue, setFromValue] = useState('100');

  // Rotation animation for the swap button
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // ── Fetch live rate ────────────────────────────────────────────────────────
  const fetchRate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/NZD');
      const json = await res.json();
      if (json?.rates?.MYR) {
        const r: number = json.rates.MYR;
        setRate(r);
        const now = new Date();
        setRateLabel(
          `实时汇率 · ${now.getHours().toString().padStart(2, '0')}:${now
            .getMinutes()
            .toString()
            .padStart(2, '0')} 更新`,
        );
      } else {
        throw new Error('no MYR rate');
      }
    } catch {
      setRate(FALLBACK_RATE);
      setRateLabel(`参考汇率 · 1 NZD ≈ ${FALLBACK_RATE.toFixed(2)} RM`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  // ── Conversion ─────────────────────────────────────────────────────────────
  const numFrom = parseFloat(fromValue) || 0;
  const converted =
    direction === 'NZD_TO_MYR'
      ? (numFrom * rate).toFixed(2)
      : (numFrom / rate).toFixed(2);

  const fromCurrency =
    direction === 'NZD_TO_MYR'
      ? { flag: '🇳🇿', code: 'NZD', name: '新西兰元' }
      : { flag: '🇲🇾', code: 'MYR', name: '马来西亚令吉' };

  const toCurrency =
    direction === 'NZD_TO_MYR'
      ? { flag: '🇲🇾', code: 'MYR', name: '马来西亚令吉' }
      : { flag: '🇳🇿', code: 'NZD', name: '新西兰元' };

  // ── Swap direction ─────────────────────────────────────────────────────────
  const handleSwap = useCallback(() => {
    Animated.sequence([
      Animated.timing(rotateAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
    setDirection((d) => (d === 'NZD_TO_MYR' ? 'MYR_TO_NZD' : 'NZD_TO_MYR'));
    setFromValue('100');
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // ── Rate card numbers ──────────────────────────────────────────────────────
  const nzdToMyrDisplay = direction === 'NZD_TO_MYR'
    ? `1 NZD = ${rate.toFixed(4)} RM`
    : `1 RM = ${(1 / rate).toFixed(4)} NZD`;

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>货币兑换</Text>
        <Text style={styles.subtitle}>NZD · 新西兰元  ↔  RM · 马来西亚令吉</Text>
      </View>

      {/* Live rate strip */}
      <View style={styles.rateStrip}>
        <View style={styles.rateInfo}>
          <Text style={styles.rateMain}>{nzdToMyrDisplay}</Text>
          <Text style={styles.rateLabel}>{rateLabel}</Text>
        </View>
        <TouchableOpacity onPress={fetchRate} style={styles.refreshBtn} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={Colors.primary} />
            : <Ionicons name="refresh-outline" size={18} color={Colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* From card */}
      <CurrencyCard
        {...fromCurrency}
        value={fromValue}
        editable
        onChangeText={(v) => setFromValue(v.replace(/[^0-9.]/g, ''))}
        highlight
      />

      {/* Swap button */}
      <View style={styles.swapRow}>
        <View style={styles.swapLine} />
        <TouchableOpacity onPress={handleSwap} style={styles.swapBtn}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons name="swap-vertical" size={20} color={Colors.onPrimary} />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.swapLine} />
      </View>

      {/* To card */}
      <CurrencyCard
        {...toCurrency}
        value={converted}
        editable={false}
      />

      {/* Quick amounts */}
      <View style={styles.quickSection}>
        <Text style={styles.quickLabel}>
          快速金额 ({fromCurrency.code})
        </Text>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.quickBtn, fromValue === String(amt) && styles.quickBtnActive]}
              onPress={() => setFromValue(String(amt))}
            >
              <Text style={[
                styles.quickBtnText,
                fromValue === String(amt) && styles.quickBtnTextActive,
              ]}>
                {amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reference note */}
      <View style={styles.noteRow}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.onSurfaceVariant} />
        <Text style={styles.noteText}>汇率仅供参考，实际兑换以银行或货币兑换商报价为准</Text>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },

  // Header
  header: {
    gap: 4,
    paddingBottom: Spacing.xs,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },

  // Rate strip
  rateStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryContainer + '33',
    borderRadius: Radii.DEFAULT,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  rateInfo: {
    gap: 2,
  },
  rateMain: {
    ...Typography.headlineSm,
    color: Colors.primary,
    fontSize: 18,
  },
  rateLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Currency cards
  currencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  currencyCardActive: {
    borderColor: Colors.primary + '88',
  },
  currencyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flag: {
    fontSize: 32,
    lineHeight: 38,
  },
  currencyCode: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 18,
  },
  currencyName: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  amountInput: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    fontSize: 28,
    textAlign: 'right',
    minWidth: 120,
    padding: 0,
  },
  amountResult: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 28,
    textAlign: 'right',
  },

  // Swap
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: -Spacing.xs,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },

  // Quick amounts
  quickSection: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  quickLabel: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  quickBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.DEFAULT,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  quickBtnActive: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primary,
  },
  quickBtnText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },
  quickBtnTextActive: {
    color: Colors.onPrimaryContainer,
  },

  // Note
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingTop: Spacing.xs,
  },
  noteText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
});
