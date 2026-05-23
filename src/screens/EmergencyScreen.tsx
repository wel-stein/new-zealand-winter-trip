import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface EmergencyEntry {
  label: string;
  number: string;
  note?: string;
  urgent?: boolean;
}

interface Section {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  entries: EmergencyEntry[];
}

const SECTIONS: Section[] = [
  {
    title: '紧急救援',
    icon: 'alert-circle',
    color: '#c0392b',
    entries: [
      { label: '警察 / 救护车 / 消防', number: '111', urgent: true, note: '新西兰统一紧急电话，24小时' },
      { label: '警察（非紧急）',       number: '105',              note: '报告非紧急犯罪或事故' },
    ],
  },
  {
    title: '道路救援',
    icon: 'car',
    color: '#e67e22',
    entries: [
      { label: 'AA 道路救援',       number: '0800 500 222', note: '全天候道路救援服务' },
      { label: '道路状况查询',       number: '0800 444 449', note: 'NZTA 公路热线' },
    ],
  },
  {
    title: '医疗帮助',
    icon: 'medkit',
    color: '#27ae60',
    entries: [
      { label: 'Healthline 医疗热线', number: '0800 611 116', note: '24小时免费医疗建议，中文服务请说中文' },
      { label: '毒物控制中心',        number: '0800 764 766', note: '误食有毒物质时拨打' },
    ],
  },
  {
    title: '大使馆',
    icon: 'business',
    color: '#2980b9',
    entries: [
      { label: '马来西亚驻新西兰大使馆', number: '+64 4 385 2439', note: '惠灵顿，紧急领事协助' },
      { label: '大使馆紧急热线',         number: '+64 4 385 2439', note: '正常办公时间：周一至周五 9:00–17:00' },
    ],
  },
  {
    title: '旅游安全',
    icon: 'shield-checkmark',
    color: '#8e44ad',
    entries: [
      { label: '山区搜救',               number: '111 → 警察',     note: '要求警察联系搜救队' },
      { label: '海关申报（NZCS）',       number: '0800 428 786',  note: '了解进出口申报要求' },
      { label: 'SafeTravel 旅行安全建议', number: 'safetravel.govt.nz', note: '查阅新西兰官方旅行安全指引' },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function EntryRow({ entry }: { entry: EmergencyEntry }) {
  const isUrl = entry.number.startsWith('http') || entry.number.includes('.');
  const handlePress = () => {
    if (isUrl) {
      Linking.openURL(`https://${entry.number.replace('https://', '')}`).catch(() => {});
    } else if (!entry.number.includes('→')) {
      Linking.openURL(`tel:${entry.number.replace(/\s/g, '')}`).catch(() => {});
    }
  };

  const tappable = isUrl || (!entry.number.includes('→'));

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={tappable ? 0.7 : 1}
      style={styles.entryRow}
    >
      <View style={styles.entryLeft}>
        <Text style={styles.entryLabel}>{entry.label}</Text>
        {entry.note ? <Text style={styles.entryNote}>{entry.note}</Text> : null}
      </View>
      <View style={styles.entryRight}>
        <Text style={[styles.entryNumber, entry.urgent && styles.entryNumberUrgent]}>
          {entry.number}
        </Text>
        {tappable && !entry.urgent && (
          <Ionicons name="chevron-forward" size={14} color={Colors.onSurfaceVariant} />
        )}
      </View>
    </TouchableOpacity>
  );
}

function SectionCard({ section }: { section: Section }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: section.color + '22' }]}>
          <Ionicons name={section.icon} size={18} color={section.color} />
        </View>
        <Text style={styles.cardTitle}>{section.title}</Text>
      </View>
      {section.entries.map((entry, i) => (
        <React.Fragment key={i}>
          {i > 0 && <View style={styles.divider} />}
          <EntryRow entry={entry} />
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function EmergencyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>紧急联系</Text>
        <Text style={styles.subtitle}>新西兰重要电话号码 — 点击可直接拨打</Text>
      </View>

      {/* Emergency banner */}
      <TouchableOpacity
        style={styles.emergencyBanner}
        onPress={() => Linking.openURL('tel:111').catch(() => {})}
        activeOpacity={0.8}
      >
        <View style={styles.emergencyBannerLeft}>
          <Ionicons name="call" size={28} color="#fff" />
          <View>
            <Text style={styles.emergencyNumber}>111</Text>
            <Text style={styles.emergencyDesc}>警察 · 救护车 · 消防</Text>
          </View>
        </View>
        <View style={styles.emergencyTap}>
          <Text style={styles.emergencyTapText}>立即拨打</Text>
        </View>
      </TouchableOpacity>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <SectionCard key={section.title} section={section} />
      ))}

      {/* Note */}
      <View style={styles.noteRow}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.onSurfaceVariant} />
        <Text style={styles.noteText}>
          新西兰免费电话（0800）只能在新西兰境内拨打。从海外拨打请使用收费号码。
        </Text>
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
  header: { gap: 4, paddingBottom: Spacing.xs },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },

  // Emergency banner
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#c0392b',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  emergencyBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emergencyNumber: {
    ...Typography.headlineMd,
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
  },
  emergencyDesc: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  emergencyTap: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.DEFAULT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emergencyTapText: {
    ...Typography.labelSm,
    color: '#fff',
    fontSize: 12,
  },

  // Section card
  card: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardStroke,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    fontSize: 15,
  },

  // Entry row
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm,
  },
  entryLeft: { flex: 1, gap: 2 },
  entryLabel: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontSize: 14,
  },
  entryNote: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    lineHeight: 16,
  },
  entryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  entryNumber: {
    ...Typography.labelMd,
    color: Colors.primary,
    fontSize: 14,
  },
  entryNumberUrgent: {
    ...Typography.headlineSm,
    color: '#c0392b',
    fontSize: 22,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.cardStroke,
    marginHorizontal: Spacing.md,
  },

  // Note
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  noteText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
});
