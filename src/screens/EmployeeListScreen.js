import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';
import { employees } from '../data/mockData';

const CHECKLIST_ICONS = {
  housing: 'home',
  bankAccount: 'card',
  insurance: 'medkit',
  pension: 'wallet',
  school: 'school',
  residenceReg: 'location',
};

export default function EmployeeListScreen({ lang, navigate }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = employees.filter((e) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'in_progress' && e.stage === '定住中') ||
      (filter === 'completed' && e.stage === '定住完了');
    const matchSearch =
      search === '' || e.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filters = [
    { key: 'all', label: t(lang, 'all') },
    { key: 'in_progress', label: t(lang, 'in_progress') },
    { key: 'completed', label: t(lang, 'completed') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(lang, 'employees')}</Text>
        <Text style={styles.headerCount}>{filtered.length} {lang === 'ja' ? '名' : 'people'}</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={theme.colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={t(lang, 'search_employee')}
          placeholderTextColor={theme.colors.textLight}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
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
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((emp) => {
          const checkItems = Object.entries(emp.checklist);
          const doneCount = checkItems.filter(([, v]) => v).length;
          const pct = Math.round((doneCount / checkItems.length) * 100);
          const isCompleted = emp.stage === '定住完了';

          return (
            <TouchableOpacity
              key={emp.id}
              style={styles.card}
              onPress={() => navigate('employeeDetail', { employee: emp })}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Text style={styles.flagText}>{emp.flag}</Text>
                  <View>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <Text style={styles.empNationality}>{emp.nationality}</Text>
                  </View>
                </View>
                <View style={[styles.stageBadge, { backgroundColor: isCompleted ? theme.colors.secondaryLight : theme.colors.primaryLight }]}>
                  <Text style={[styles.stageText, { color: isCompleted ? theme.colors.secondary : theme.colors.primary }]}>
                    {isCompleted ? t(lang, 'completed') : t(lang, 'in_progress')}
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFg,
                      {
                        width: `${pct}%`,
                        backgroundColor: isCompleted ? theme.colors.secondary : pct >= 50 ? theme.colors.primary : theme.colors.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.pctLabel}>{pct}%</Text>
              </View>

              <View style={styles.checkRow}>
                {checkItems.map(([key, done]) => (
                  <View key={key} style={styles.checkItem}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={done ? theme.colors.secondary : theme.colors.border}
                    />
                  </View>
                ))}
                <Text style={styles.checkSummary}>{doneCount}/{checkItems.length}</Text>
              </View>

              <View style={styles.checkLabels}>
                {Object.keys(CHECKLIST_ICONS).map((key) => (
                  <Text key={key} style={styles.checkLabelText} numberOfLines={1}>
                    {t(lang, key === 'bankAccount' ? 'bank_account' : key === 'residenceReg' ? 'residence_registration' : key)}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text },
  headerCount: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.text },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 16 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 10,
    ...theme.shadow,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flagText: { fontSize: 26 },
  empName: { fontSize: theme.fontSize.md, fontWeight: '600', color: theme.colors.text },
  empNationality: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  stageText: { fontSize: theme.fontSize.xs, fontWeight: '600' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFg: { height: 6, borderRadius: 3 },
  pctLabel: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.text, minWidth: 36, textAlign: 'right' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkItem: { alignItems: 'center' },
  checkSummary: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, marginLeft: 4 },
  checkLabels: { flexDirection: 'row', gap: 6, marginTop: 4 },
  checkLabelText: { flex: 1, fontSize: 8, color: theme.colors.textLight, textAlign: 'center' },
});
