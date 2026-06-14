import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';

export default function LoginScreen({ onLogin }) {
  const [lang, setLang] = useState('ja');
  const [email, setEmail] = useState('hr@company.co.jp');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください。');
      return;
    }
    onLogin({ lang, user: { email, name: '田中 花子', company: '株式会社サンプル' } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'ja' && styles.langBtnActive]}
              onPress={() => setLang('ja')}
            >
              <Text style={[styles.langText, lang === 'ja' && styles.langTextActive]}>🇯🇵 日本語</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
              onPress={() => setLang('en')}
            >
              <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>🇺🇸 English</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="business" size={40} color={theme.colors.card} />
            </View>
            <Text style={styles.appName}>定住サポート</Text>
            <Text style={styles.appSub}>for Business</Text>
            <Text style={styles.subtitle}>{t(lang, 'login_subtitle')}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.formTitle}>{t(lang, 'login')}</Text>

            <Text style={styles.label}>{t(lang, 'email')}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={theme.colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="hr@company.co.jp"
                placeholderTextColor={theme.colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>{t(lang, 'password')}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textLight}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.colors.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>{t(lang, 'login')}</Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.card} />
            </TouchableOpacity>

            <Text style={styles.demoNote}>
              {lang === 'ja'
                ? 'デモ用：任意のメール・パスワードでログイン可能'
                : 'Demo: any email/password accepted'}
            </Text>
          </View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={14} color={theme.colors.textLight} />
            <Text style={styles.footerText}>
              {lang === 'ja' ? '企業情報は安全に保護されています' : 'Company data is securely protected'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.primary },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  langBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: '#fff',
  },
  langText: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.7)' },
  langTextActive: { color: '#fff', fontWeight: '600' },
  header: { alignItems: 'center', paddingVertical: 36 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  appSub: { fontSize: theme.fontSize.md, color: 'rgba(255,255,255,0.85)', marginTop: 2, letterSpacing: 2 },
  subtitle: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center' },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 24,
    ...theme.shadow,
  },
  formTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text, marginBottom: 20 },
  label: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.textLight, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: theme.fontSize.md, color: theme.colors.text },
  eyeBtn: { padding: 4 },
  loginBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  loginBtnText: { fontSize: theme.fontSize.md, fontWeight: '700', color: '#fff' },
  demoNote: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 24,
  },
  footerText: { fontSize: theme.fontSize.xs, color: 'rgba(255,255,255,0.6)' },
});
