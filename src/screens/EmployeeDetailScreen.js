import React from 'react';
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
import { resources } from '../data/mockData';

const CHECKLIST_CONFIG = [
  { key: 'housing', labelKey: 'housing', icon: 'home', color: '#8B5CF6' },
  { key: 'bankAccount', labelKey: 'bank_account', icon: 'card', color: '#059669' },
  { key: 'insurance', labelKey: 'insurance', icon: 'medkit', color: '#DC2626' },
  { key: 'pension', labelKey: 'pension', icon: 'wallet', color: '#D97706' },
  { key: 'school', labelKey: 'school', icon: 'school', color: '#1E40AF' },
  { key: 'residenceReg', labelKey: 'residence_registration', icon: 'location', color: '#0891B2' },
];

const RECOMMENDED = [
  { categoryKey: 'housing', labelKey: 'housing' },
  { categoryKey: 'banking', labelKey: 'banking' },
  { categoryKey: 'legal', labelKey: 'legal' },
];

export default function EmployeeDetailScreen({ lang, params, navigate, goBack }) {
  const emp = params?.employee;
  if (!emp) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>社員データが見つかりません</Text>
      </View>
    );
  }

  const checkItems = Object.entries(emp.checklist);
  const doneCount = checkItems.filter(([, v]) => v).length;
  const total = checkItems.length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.card} />
          <Text style={styles.backText}>{t(lang, 'back')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Text style={styles.flag}>{emp.flag}</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.empName}>{emp.name}</Text>
            <Text style={styles.empNationality}>{t(lang, 'nationality')}: {emp.nationality}</Text>
            <View style={[styles.stageBadge, { backgroundColor: emp.stage === '定住完了' ? theme.colors.secondaryLight : theme.colors.primaryLight }]}>
              <Text style={[styles.stageText, { color: emp.stage === '定住完了' ? theme.colors.secondary : theme.colors.primary }]}>
                {emp.stage === '定住完了' ? t(lang, 'completed') : t(lang, 'in_progress')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'checklist_progress')}</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>{doneCount}/{total} {lang === 'ja' ? '項目完了' : 'items done'}</Text>
              <Text style={[styles.pctText, { color: pct === 100 ? theme.colors.secondary : pct >= 50 ? theme.colors.primary : theme.colors.danger }]}>
                {pct}%
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFg,
                  {
                    width: `${pct}%`,
                    backgroundColor: pct === 100 ? theme.colors.secondary : pct >= 50 ? theme.colors.primary : theme.colors.danger,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'settlement_checklist')}</Text>
          <View style={styles.checklistCard}>
            {CHECKLIST_CONFIG.map((item) => {
              const isDone = emp.checklist[item.key];
              return (
                <View key={item.key} style={styles.checklistRow}>
                  <View style={[styles.checklistIcon, { backgroundColor: item.color + '18' }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={styles.checklistLabel}>{t(lang, item.labelKey)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isDone ? theme.colors.secondaryLight : theme.colors.dangerLight }]}>
                    <Ionicons
                      name={isDone ? 'checkmark-circle' : 'time-outline'}
                      size={14}
                      color={isDone ? theme.colors.secondary : theme.colors.danger}
                    />
                    <Text style={[styles.statusText, { color: isDone ? theme.colors.secondary : theme.colors.danger }]}>
                      {isDone ? t(lang, 'status_done') : t(lang, 'status_pending')}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'hr_note')}</Text>
          <View style={styles.noteCard}>
            <Ionicons name="document-text-outline" size={16} color={theme.colors.textLight} style={{ marginBottom: 6 }} />
            <Text style={styles.noteText}>{emp.hrNote}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(lang, 'recommended_resources')}</Text>
          {RECOMMENDED.map((item) => {
            const resList = resources[item.categoryKey] || [];
            const firstRes = resList[0];
            if (!firstRes) return null;
            return (
              <TouchableOpacity
                key={item.categoryKey}
                style={styles.resourceLink}
                onPress={() => navigate('resourceDetail', { resource: firstRes })}
              >
                <View style={styles.resourceLinkLeft}>
                  <Ionicons name="document-outline" size={16} color={theme.colors.primary} />
                  <Text style={styles.resourceLinkText} numberOfLines={1}>{firstRes.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  errorText: { textAlign: 'center', marginTop: 40, color: theme.colors.textLight },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: theme.fontSize.md, color: '#fff', fontWeight: '600' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  flag: { fontSize: 52 },
  profileInfo: { flex: 1 },
  empName: { fontSize: theme.fontSize.xl, fontWeight: '700', color: '#fff' },
  empNationality: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2, marginBottom: 8 },
  stageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  stageText: { fontSize: theme.fontSize.xs, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text, marginBottom: 10 },
  progressCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    ...theme.shadow,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  pctText: { fontSize: theme.fontSize.lg, fontWeight: '800' },
  progressBarBg: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFg: { height: 10, borderRadius: 5 },
  checklistCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    ...theme.shadow,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  checklistIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistLabel: { flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.text, fontWeight: '500' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  statusText: { fontSize: theme.fontSize.xs, fontWeight: '600' },
  noteCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    ...theme.shadow,
  },
  noteText: { fontSize: theme.fontSize.sm, color: theme.colors.text, lineHeight: 22 },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    ...theme.shadow,
  },
  resourceLinkLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  resourceLinkText: { fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: '600', flex: 1 },
});
