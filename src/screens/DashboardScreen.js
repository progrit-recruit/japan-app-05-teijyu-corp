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
import { employees, supportRequests } from '../data/mockData';

const totalEmployees = employees.length;
const completedCount = employees.filter((e) => e.stage === '定住完了').length;
const supportingCount = totalEmployees - completedCount;

const alertEmployees = employees.filter((e) => {
  const cl = e.checklist;
  const done = Object.values(cl).filter(Boolean).length;
  return done < 3 && e.stage !== '定住完了';
});

const recommendedActions = [
  { id: 1, icon: 'alert-circle', color: theme.colors.danger, text: { ja: 'Tran Thi Lan の住民登録が未完了です', en: "Tran Thi Lan's residence registration is incomplete" } },
  { id: 2, icon: 'time', color: theme.colors.warning, text: { ja: '3名の年金手続きが未対応です', en: '3 employees have pending pension procedures' } },
  { id: 3, icon: 'school', color: theme.colors.primary, text: { ja: '学校入学サポートが必要な社員が2名います', en: '2 employees need school enrollment support' } },
];

const openRequests = supportRequests.filter((r) => r.status === 'open');

export default function DashboardScreen({ lang, user, navigate }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerGreeting}>
            {t(lang, 'welcome')}, {user?.name || 'HR'}
          </Text>
          <Text style={styles.headerCompany}>{user?.company || ''}</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{(user?.name || 'H')[0]}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: theme.colors.primary }]}>
          <Ionicons name="people" size={20} color={theme.colors.primary} />
          <Text style={styles.statNum}>{totalEmployees}</Text>
          <Text style={styles.statLabel}>{t(lang, 'total_employees')}</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: theme.colors.warning }]}>
          <Ionicons name="sync" size={20} color={theme.colors.warning} />
          <Text style={styles.statNum}>{supportingCount}</Text>
          <Text style={styles.statLabel}>{t(lang, 'supporting')}</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: theme.colors.secondary }]}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.secondary} />
          <Text style={styles.statNum}>{completedCount}</Text>
          <Text style={styles.statLabel}>{t(lang, 'completed_support')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t(lang, 'recommended_actions')}</Text>
        </View>
        {recommendedActions.map((action) => (
          <View key={action.id} style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: action.color + '18' }]}>
              <Ionicons name={action.icon} size={18} color={action.color} />
            </View>
            <Text style={styles.actionText}>{action.text[lang] || action.text.ja}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t(lang, 'actions_needed')}</Text>
          <TouchableOpacity onPress={() => navigate('employees')}>
            <Text style={styles.seeAll}>{lang === 'ja' ? '全員を見る' : 'See all'}</Text>
          </TouchableOpacity>
        </View>
        {alertEmployees.map((emp) => {
          const doneCount = Object.values(emp.checklist).filter(Boolean).length;
          const total = Object.keys(emp.checklist).length;
          const pct = Math.round((doneCount / total) * 100);
          return (
            <TouchableOpacity
              key={emp.id}
              style={styles.empCard}
              onPress={() => navigate('employeeDetail', { employee: emp })}
            >
              <View style={styles.empLeft}>
                <Text style={styles.empFlag}>{emp.flag}</Text>
                <View>
                  <Text style={styles.empName}>{emp.name}</Text>
                  <Text style={styles.empStage}>{emp.stage}</Text>
                </View>
              </View>
              <View style={styles.empRight}>
                <Text style={styles.pctText}>{pct}%</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFg, { width: `${pct}%`, backgroundColor: pct < 50 ? theme.colors.danger : theme.colors.warning }]} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t(lang, 'support_request')}</Text>
          <TouchableOpacity onPress={() => navigate('requests')}>
            <Text style={styles.seeAll}>{lang === 'ja' ? '全件を見る' : 'See all'}</Text>
          </TouchableOpacity>
        </View>
        {openRequests.slice(0, 3).map((req) => (
          <View key={req.id} style={styles.reqCard}>
            <View style={styles.reqTop}>
              <View style={[styles.priorityBadge, { backgroundColor: req.priority === 'high' ? theme.colors.dangerLight : req.priority === 'medium' ? theme.colors.warningLight : theme.colors.secondaryLight }]}>
                <Text style={[styles.priorityText, { color: req.priority === 'high' ? theme.colors.danger : req.priority === 'medium' ? theme.colors.warning : theme.colors.secondary }]}>
                  {t(lang, 'priority_' + req.priority)}
                </Text>
              </View>
              <Text style={styles.reqCategory}>{req.category}</Text>
            </View>
            <Text style={styles.reqDesc} numberOfLines={2}>{req.description}</Text>
            <Text style={styles.reqEmployee}>{req.employeeName}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerGreeting: { fontSize: theme.fontSize.lg, fontWeight: '700', color: '#fff' },
  headerCompany: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: theme.fontSize.lg, fontWeight: '700', color: '#fff' },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    ...theme.shadow,
  },
  statNum: { fontSize: theme.fontSize.xxl, fontWeight: '800', color: theme.colors.text, marginTop: 6 },
  statLabel: { fontSize: theme.fontSize.xs, color: theme.colors.textLight, marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text },
  seeAll: { fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: '600' },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    ...theme.shadow,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.text, lineHeight: 20 },
  empCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 8,
    ...theme.shadow,
  },
  empLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  empFlag: { fontSize: 26 },
  empName: { fontSize: theme.fontSize.md, fontWeight: '600', color: theme.colors.text },
  empStage: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  empRight: { alignItems: 'flex-end', minWidth: 80 },
  pctText: { fontSize: theme.fontSize.sm, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  progressBarBg: {
    width: 80,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFg: { height: 6, borderRadius: 3 },
  reqCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 8,
    ...theme.shadow,
  },
  reqTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  priorityText: { fontSize: theme.fontSize.xs, fontWeight: '700' },
  reqCategory: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  reqDesc: { fontSize: theme.fontSize.sm, color: theme.colors.text, lineHeight: 20, marginBottom: 6 },
  reqEmployee: { fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: '600' },
});
