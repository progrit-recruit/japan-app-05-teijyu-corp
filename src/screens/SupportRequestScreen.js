import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';
import { supportRequests } from '../data/mockData';

const PRIORITY_CONFIG = {
  high: { color: theme.colors.danger, bg: '#FEE2E2', icon: 'alert-circle' },
  medium: { color: theme.colors.warning, bg: '#FEF3C7', icon: 'warning' },
  low: { color: theme.colors.secondary, bg: '#D1FAE5', icon: 'information-circle' },
};

export default function SupportRequestScreen({ lang }) {
  const [filter, setFilter] = useState('all');

  const filtered = supportRequests.filter((r) => {
    if (filter === 'open') return r.status === 'open';
    if (filter === 'closed') return r.status === 'closed';
    return true;
  });

  const openCount = supportRequests.filter((r) => r.status === 'open').length;
  const closedCount = supportRequests.filter((r) => r.status === 'closed').length;

  const filters = [
    { key: 'all', label: t(lang, 'all_requests'), count: supportRequests.length },
    { key: 'open', label: t(lang, 'open'), count: openCount },
    { key: 'closed', label: t(lang, 'closed'), count: closedCount },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(lang, 'support_request')}</Text>
        <View style={styles.headerStats}>
          <View style={[styles.headerBadge, { backgroundColor: theme.colors.dangerLight }]}>
            <Text style={[styles.headerBadgeText, { color: theme.colors.danger }]}>{openCount} {lang === 'ja' ? '対応中' : 'open'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
            <View style={[styles.countBadge, filter === f.key && styles.countBadgeActive]}>
              <Text style={[styles.countText, filter === f.key && styles.countTextActive]}>{f.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.map((req) => {
          const priority = PRIORITY_CONFIG[req.priority] || PRIORITY_CONFIG.low;
          const isOpen = req.status === 'open';
          return (
            <View key={req.id} style={styles.reqCard}>
              <View style={styles.reqHeader}>
                <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
                  <Ionicons name={priority.icon} size={12} color={priority.color} />
                  <Text style={[styles.priorityText, { color: priority.color }]}>
                    {t(lang, 'priority_' + req.priority)}
                  </Text>
                </View>
                <Text style={styles.categoryText}>{req.category}</Text>
                <View style={[styles.statusBadge, { backgroundColor: isOpen ? theme.colors.primaryLight : theme.colors.secondaryLight }]}>
                  <Text style={[styles.statusText, { color: isOpen ? theme.colors.primary : theme.colors.secondary }]}>
                    {t(lang, req.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{req.description}</Text>

              <View style={styles.reqMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={13} color={theme.colors.textLight} />
                  <Text style={styles.metaLabel}>{t(lang, 'employee')}:</Text>
                  <Text style={styles.metaValue}>{req.employeeName}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="person-circle-outline" size={13} color={theme.colors.textLight} />
                  <Text style={styles.metaLabel}>{t(lang, 'assigned_to')}:</Text>
                  <Text style={styles.metaValue}>{req.assignedTo}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={13} color={theme.colors.textLight} />
                  <Text style={styles.metaLabel}>{t(lang, 'created_at')}:</Text>
                  <Text style={styles.metaValue}>{req.createdAt}</Text>
                </View>
              </View>

              {isOpen && (
                <View style={styles.reqActions}>
                  <TouchableOpacity style={styles.resolveBtn}>
                    <Ionicons name="checkmark-circle-outline" size={15} color={theme.colors.secondary} />
                    <Text style={styles.resolveBtnText}>{lang === 'ja' ? '完了にする' : 'Mark as Done'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailBtn}>
                    <Text style={styles.detailBtnText}>{t(lang, 'detail')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.border} />
            <Text style={styles.emptyText}>{lang === 'ja' ? 'リクエストがありません' : 'No requests found'}</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text },
  headerStats: { flexDirection: 'row', gap: 6 },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  headerBadgeText: { fontSize: theme.fontSize.xs, fontWeight: '700' },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countBadgeActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  countText: { fontSize: 10, color: theme.colors.textLight, fontWeight: '700' },
  countTextActive: { color: '#fff' },
  listContent: { padding: 16 },
  reqCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 12,
    ...theme.shadow,
  },
  reqHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  priorityText: { fontSize: theme.fontSize.xs, fontWeight: '700' },
  categoryText: { flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  statusText: { fontSize: theme.fontSize.xs, fontWeight: '600' },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  reqMeta: { gap: 5, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 10, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaLabel: { fontSize: theme.fontSize.xs, color: theme.colors.textLight },
  metaValue: { fontSize: theme.fontSize.xs, color: theme.colors.text, fontWeight: '500' },
  reqActions: { flexDirection: 'row', gap: 8 },
  resolveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.secondaryLight,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  resolveBtnText: { fontSize: theme.fontSize.sm, color: theme.colors.secondary, fontWeight: '600' },
  detailBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  detailBtnText: { fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: '600' },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: theme.fontSize.md, color: theme.colors.textLight },
});
