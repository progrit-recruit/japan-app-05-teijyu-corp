import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { t } from '../i18n';
import DashboardScreen from './DashboardScreen';
import EmployeeListScreen from './EmployeeListScreen';
import EmployeeDetailScreen from './EmployeeDetailScreen';
import ResourceLibraryScreen from './ResourceLibraryScreen';
import ResourceDetailScreen from './ResourceDetailScreen';
import SupportRequestScreen from './SupportRequestScreen';

const TABS = [
  { key: 'dashboard', icon: 'grid-outline', activeIcon: 'grid' },
  { key: 'employees', icon: 'people-outline', activeIcon: 'people' },
  { key: 'resources', icon: 'library-outline', activeIcon: 'library' },
  { key: 'requests', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
];

export default function MainApp({ lang, user }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenParams, setScreenParams] = useState({});
  const [history, setHistory] = useState([]);

  const navigate = (screen, params = {}) => {
    setHistory((prev) => [...prev, { screen: currentScreen, params: screenParams }]);
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentScreen(prev.screen);
    setScreenParams(prev.params);
  };

  const switchTab = (tabKey) => {
    setCurrentTab(tabKey);
    setCurrentScreen(tabKey);
    setScreenParams({});
    setHistory([]);
  };

  const renderScreen = () => {
    const props = { lang, user, navigate, goBack, params: screenParams };
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen {...props} />;
      case 'employees':
        return <EmployeeListScreen {...props} />;
      case 'employeeDetail':
        return <EmployeeDetailScreen {...props} />;
      case 'resources':
        return <ResourceLibraryScreen {...props} />;
      case 'resourceDetail':
        return <ResourceDetailScreen {...props} />;
      case 'requests':
        return <SupportRequestScreen {...props} />;
      default:
        return <DashboardScreen {...props} />;
    }
  };

  const isDetailScreen = ['employeeDetail', 'resourceDetail'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>{renderScreen()}</View>

        {!isDetailScreen && (
          <View style={styles.tabBar}>
            {TABS.map((tab) => {
              const isActive = currentTab === tab.key && !isDetailScreen;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.tabItem}
                  onPress={() => switchTab(tab.key)}
                >
                  <Ionicons
                    name={isActive ? tab.activeIcon : tab.icon}
                    size={22}
                    color={isActive ? theme.colors.primary : theme.colors.textLight}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {t(lang, tab.key)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.textLight,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
