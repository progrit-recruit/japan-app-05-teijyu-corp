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
import { resources } from '../data/mockData';

const CATEGORIES = [
  { key: 'housing', icon: 'home', color: '#8B5CF6' },
  { key: 'banking', icon: 'card', color: '#059669' },
  { key: 'healthcare', icon: 'medkit', color: '#DC2626' },
  { key: 'education', icon: 'school', color: '#1E40AF' },
  { key: 'legal', icon: 'document-text', color: '#0891B2' },
];

const CATEGORY_LABEL_KEYS = {
  housing: 'housing',
  banking: 'banking',
  healthcare: 'healthcare',
  education: 'education',
  legal: 'legal',
};

export default function ResourceLibraryScreen({ lang, navigate }) {
  const [activeCategory, setActiveCategory] = useState('housing');

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory);
  const list = resources[activeCategory] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t(lang, 'resource_library')}</Text>
        <Text style={styles.headerSub}>
          {lang === 'ja' ? '定住支援に役立つガイド・テンプレート' : 'Guides & templates for settlement support'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScrollWrap}
        contentContainerStyle={styles.catRow}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.key === activeCategory;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catBtn, isActive && { backgroundColor: cat.color, borderColor: cat.color }]}
              onPress={() => setActiveCategory(cat.key)}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isActive ? '#fff' : cat.color}
              />
              <Text style={[styles.catText, isActive && { color: '#fff' }]}>
                {t(lang, CATEGORY_LABEL_KEYS[cat.key])}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.activeCatHeader}>
        <View style={[styles.catIconWrap, { backgroundColor: activeCat.color + '18' }]}>
          <Ionicons name={activeCat.icon} size={20} color={activeCat.color} />
        </View>
        <Text style={styles.activeCatTitle}>{t(lang, CATEGORY_LABEL_KEYS[activeCategory])}</Text>
        <Text style={styles.activeCatCount}>{list.length} {lang === 'ja' ? '件' : 'items'}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {list.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.resourceCard}
            onPress={() => navigate('resourceDetail', { resource: item })}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.cardIcon, { backgroundColor: activeCat.color + '18' }]}>
                <Ionicons name="document-text" size={20} color={activeCat.color} />
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardPreview} numberOfLines={2}>{item.content}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textLight} />
          </TouchableOpacity>
        ))}
        {list.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="folder-open-outline" size={40} color={theme.colors.border} />
            <Text style={styles.emptyText}>{lang === 'ja' ? 'リソースがありません' : 'No resources found'}</Text>
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
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text },
  headerSub: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, marginTop: 2 },
  catScrollWrap: { maxHeight: 56, backgroundColor: theme.colors.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  catText: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, fontWeight: '600' },
  activeCatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCatTitle: { flex: 1, fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text },
  activeCatCount: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  listContent: { paddingHorizontal: 16 },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 10,
    ...theme.shadow,
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardTextWrap: { flex: 1 },
  cardTitle: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
  cardPreview: { fontSize: theme.fontSize.xs, color: theme.colors.textLight, lineHeight: 16 },
  emptyWrap: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: theme.fontSize.md, color: theme.colors.textLight },
});
