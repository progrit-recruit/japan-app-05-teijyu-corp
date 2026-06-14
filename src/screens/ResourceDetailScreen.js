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

export default function ResourceDetailScreen({ lang, params, goBack }) {
  const resource = params?.resource;

  if (!resource) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={22} color={theme.colors.card} />
            <Text style={styles.backText}>{t(lang, 'back')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>{lang === 'ja' ? 'リソースが見つかりません' : 'Resource not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.card} />
          <Text style={styles.backText}>{t(lang, 'back')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <View style={styles.docIconWrap}>
            <Ionicons name="document-text" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>{resource.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="library-outline" size={14} color={theme.colors.textLight} />
            <Text style={styles.metaText}>{t(lang, 'resource_library')}</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.content}>{resource.content}</Text>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.actionBtnText}>{lang === 'ja' ? 'シェアする' : 'Share'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
            <Ionicons name="download-outline" size={18} color={theme.colors.textLight} />
            <Text style={styles.actionBtnTextSecondary}>{lang === 'ja' ? 'PDFで保存' : 'Save as PDF'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: theme.fontSize.md, color: '#fff', fontWeight: '600' },
  errorText: { textAlign: 'center', marginTop: 40, color: theme.colors.textLight },
  titleCard: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'flex-start',
  },
  docIconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text, lineHeight: 28, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: theme.fontSize.sm, color: theme.colors.textLight },
  contentCard: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: theme.radius.md,
    padding: 18,
    ...theme.shadow,
  },
  content: { fontSize: theme.fontSize.md, color: theme.colors.text, lineHeight: 26 },
  actionsCard: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
  },
  actionBtnText: { fontSize: theme.fontSize.sm, color: '#fff', fontWeight: '600' },
  actionBtnSecondary: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionBtnTextSecondary: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, fontWeight: '600' },
});
