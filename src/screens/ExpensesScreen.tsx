import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Platform, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  created_at: string;
}

type CategoryKey = 'dining' | 'accommodation' | 'transport' | 'activity' | 'shopping' | 'other';

interface CategoryInfo {
  label: string;
  icon: string;
  color: string;
}

const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  dining:        { label: '餐饮', icon: 'restaurant-outline', color: '#e6a44e' },
  accommodation: { label: '住宿', icon: 'bed-outline',        color: '#7b8cde' },
  transport:     { label: '交通', icon: 'car-outline',        color: '#5dbe8a' },
  activity:      { label: '景点', icon: 'compass-outline',    color: '#4db8c7' },
  shopping:      { label: '购物', icon: 'cart-outline',       color: '#d4699e' },
  other:         { label: '其他', icon: 'ellipsis-horizontal', color: '#8a938c' },
};

const CATEGORY_KEYS: CategoryKey[] = ['dining', 'accommodation', 'transport', 'activity', 'shopping', 'other'];

function getTripDate(): string {
  const today = new Date();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const year = today.getFullYear();
  if ((m === 5 && d >= 25) || (m === 6 && d <= 4)) {
    return `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return `${year}-05-26`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${m}月${day}日 ${weekdays[d.getDay()]}`;
}

export function ExpensesScreen() {
  const insets = useSafeAreaInsets();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryKey>('dining');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(getTripDate);

  const [showMYR, setShowMYR] = useState(false);
  const [nzdToMyr, setNzdToMyr] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  const fetchRate = useCallback(async () => {
    setRateLoading(true);
    try {
      const cached = await AsyncStorage.getItem('currency_rates_v2');
      if (cached) {
        const rates = JSON.parse(cached);
        if (rates.nzdMyr) {
          setNzdToMyr(rates.nzdMyr);
          setRateLoading(false);
          return;
        }
      }
    } catch {}
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/NZD');
      const json = await res.json();
      if (json?.rates?.MYR) {
        setNzdToMyr(json.rates.MYR);
        await AsyncStorage.setItem('currency_rates_v2', JSON.stringify({
          nzdMyr: json.rates.MYR,
          nzdSgd: json.rates.SGD || 0,
        }));
      }
    } catch {}
    setRateLoading(false);
  }, []);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  const toMYR = (nzd: number) => nzdToMyr ? nzd * nzdToMyr : nzd;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleAdd = useCallback(async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          category,
          description,
          expense_date: expenseDate,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add expense');
      }
      setAmount('');
      setDescription('');
      setShowForm(false);
      await fetchExpenses();
    } catch (e: any) {
      setError(e.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  }, [amount, category, description, expenseDate, fetchExpenses]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm('确定要删除这笔开销吗？')
      : true;
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      await fetchExpenses();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    }
  }, [fetchExpenses]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = CATEGORY_KEYS.map((key) => {
    const catTotal = expenses
      .filter((e) => e.category === key)
      .reduce((sum, e) => sum + e.amount, 0);
    return { key, total: catTotal };
  }).filter((c) => c.total > 0);

  const groupedByDate: Record<string, Expense[]> = {};
  expenses.forEach((e) => {
    const date = e.expense_date;
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(e);
  });
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scroll, { paddingTop: insets.top }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>旅行开销</Text>
          <Text style={styles.subtitle}>记录新西兰之旅的每一笔花费</Text>
        </View>

        {/* Total card */}
        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabel}>
              总开销 ({showMYR ? 'MYR' : 'NZD'})
            </Text>
            <TouchableOpacity
              style={[styles.currencyToggle, showMYR && styles.currencyToggleActive]}
              onPress={() => setShowMYR((v) => !v)}
              activeOpacity={0.7}
              disabled={rateLoading}
            >
              {rateLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <>
                  <Text style={styles.currencyToggleFlag}>{showMYR ? '🇳🇿' : '🇲🇾'}</Text>
                  <Text style={styles.currencyToggleText}>
                    {showMYR ? '切换 NZD' : '切换 RM'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.totalAmount}>
            {showMYR ? 'RM ' : '$'}{(showMYR ? toMYR(total) : total).toFixed(2)}
          </Text>
          {showMYR && nzdToMyr && (
            <Text style={styles.rateHint}>1 NZD = {nzdToMyr.toFixed(4)} MYR</Text>
          )}
          {categoryTotals.length > 0 && (
            <View style={styles.categoryBreakdown}>
              {categoryTotals.map(({ key, total: catTotal }) => {
                const cat = CATEGORIES[key];
                const displayAmount = showMYR ? toMYR(catTotal) : catTotal;
                return (
                  <View key={key} style={styles.catRow}>
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catLabel}>{cat.label}</Text>
                    <Text style={styles.catAmount}>
                      {showMYR ? 'RM ' : '$'}{displayAmount.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Add button */}
        {!showForm && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowForm(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle" size={22} color={Colors.onPrimary} />
            <Text style={styles.addBtnText}>记一笔</Text>
          </TouchableOpacity>
        )}

        {/* Add expense form */}
        {showForm && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>添加开销</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={22} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View style={styles.amountRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor={Colors.outlineVariant}
                keyboardType="decimal-pad"
                selectionColor={Colors.primary}
                maxLength={10}
                autoFocus
              />
              <Text style={styles.currencyLabel}>NZD</Text>
            </View>

            {/* Category chips */}
            <Text style={styles.fieldLabel}>类别</Text>
            <View style={styles.categoryChips}>
              {CATEGORY_KEYS.map((key) => {
                const cat = CATEGORIES[key];
                const active = category === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setCategory(key)}
                    style={[styles.categoryChip, active && { backgroundColor: cat.color + '33', borderColor: cat.color }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={14}
                      color={active ? cat.color : Colors.onSurfaceVariant}
                    />
                    <Text style={[styles.categoryChipText, active && { color: cat.color }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={styles.fieldLabel}>备注</Text>
            <TextInput
              style={styles.descInput}
              value={description}
              onChangeText={setDescription}
              placeholder="例：午餐 Fergburger"
              placeholderTextColor={Colors.outlineVariant}
              selectionColor={Colors.primary}
              maxLength={100}
            />

            {/* Date */}
            <Text style={styles.fieldLabel}>日期</Text>
            <TextInput
              style={styles.descInput}
              value={expenseDate}
              onChangeText={setExpenseDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.outlineVariant}
              selectionColor={Colors.primary}
              maxLength={10}
            />

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, (!amount || submitting) && styles.submitBtnDisabled]}
              onPress={handleAdd}
              disabled={!amount || submitting}
              activeOpacity={0.7}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.onPrimary} />
              ) : (
                <Text style={styles.submitBtnText}>添加</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="warning-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}

        {/* Expenses list */}
        {loading && expenses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : expenses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color={Colors.outlineVariant} />
            <Text style={styles.emptyTitle}>还没有记录</Text>
            <Text style={styles.emptySubtitle}>点击"记一笔"开始记录旅行开销</Text>
          </View>
        ) : (
          sortedDates.map((date) => (
            <View key={date} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateLabel}>{formatDate(date)}</Text>
                <Text style={styles.dateTotalLabel}>
                  {showMYR ? 'RM ' : '$'}{(showMYR
                    ? toMYR(groupedByDate[date].reduce((s, e) => s + e.amount, 0))
                    : groupedByDate[date].reduce((s, e) => s + e.amount, 0)
                  ).toFixed(2)}
                </Text>
              </View>
              {groupedByDate[date].map((expense) => {
                const cat = CATEGORIES[expense.category as CategoryKey] || CATEGORIES.other;
                return (
                  <View key={expense.id} style={styles.expenseRow}>
                    <View style={[styles.expenseIcon, { backgroundColor: cat.color + '22' }]}>
                      <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                    </View>
                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseCat}>{cat.label}</Text>
                      {expense.description ? (
                        <Text style={styles.expenseDesc} numberOfLines={1}>{expense.description}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.expenseAmount}>
                      {showMYR ? 'RM ' : '$'}{(showMYR ? toMYR(expense.amount) : expense.amount).toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(expense.id)}
                      style={styles.deleteBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close-circle-outline" size={18} color={Colors.outlineVariant} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },

  header: { gap: 4, paddingBottom: Spacing.xs },
  title: { ...Typography.headlineMd, color: Colors.onSurface },
  subtitle: { ...Typography.bodySm, color: Colors.onSurfaceVariant, fontSize: 13 },

  totalCard: {
    backgroundColor: Colors.primaryContainer + '33',
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
    gap: Spacing.md,
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { ...Typography.labelMd, color: Colors.onSurfaceVariant, fontSize: 12 },
  currencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  currencyToggleActive: {
    backgroundColor: Colors.secondary + '22',
    borderColor: Colors.secondary + '55',
  },
  currencyToggleFlag: { fontSize: 14 },
  currencyToggleText: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 11 },
  rateHint: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 10, marginTop: -Spacing.sm },
  totalAmount: { ...Typography.displayLg, color: Colors.primary, fontSize: 36 },
  categoryBreakdown: { gap: Spacing.sm, paddingTop: Spacing.xs },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 12, flex: 1 },
  catAmount: { ...Typography.labelMd, color: Colors.onSurface, fontSize: 13 },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryContainer,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  addBtnText: { ...Typography.labelMd, color: Colors.onPrimary, fontSize: 14 },

  formCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
    gap: Spacing.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formTitle: { ...Typography.headlineSm, color: Colors.onSurface, fontSize: 16 },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  dollarSign: { ...Typography.headlineLg, color: Colors.primary, fontSize: 28, marginRight: 4 },
  amountInput: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    fontSize: 28,
    flex: 1,
    padding: 0,
  },
  currencyLabel: { ...Typography.labelMd, color: Colors.onSurfaceVariant, fontSize: 12 },

  fieldLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 11, marginBottom: -Spacing.sm + 2 },

  categoryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  categoryChipText: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 12 },

  descInput: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.DEFAULT,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },

  submitBtn: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { ...Typography.labelMd, color: Colors.onPrimary, fontSize: 14 },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorContainer + '33',
    padding: Spacing.sm + 2,
    borderRadius: Radii.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.error + '44',
  },
  errorText: { ...Typography.bodySm, color: Colors.error, flex: 1, fontSize: 13 },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTitle: { ...Typography.headlineSm, color: Colors.onSurfaceVariant },
  emptySubtitle: {
    ...Typography.bodySm,
    color: Colors.outlineVariant,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },

  dateGroup: { gap: Spacing.sm },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  dateLabel: { ...Typography.labelMd, color: Colors.onSurface, fontSize: 13 },
  dateTotalLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, fontSize: 11 },

  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.md,
    padding: Spacing.sm + 2,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  expenseIcon: {
    width: 36,
    height: 36,
    borderRadius: Radii.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseInfo: { flex: 1, gap: 1 },
  expenseCat: { ...Typography.labelSm, color: Colors.onSurface, fontSize: 13 },
  expenseDesc: { ...Typography.bodySm, color: Colors.onSurfaceVariant, fontSize: 12 },
  expenseAmount: { ...Typography.headlineSm, color: Colors.onSurface, fontSize: 16 },
  deleteBtn: { padding: 4 },
});
