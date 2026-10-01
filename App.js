// Root component: picks light/dark palette and renders a simple 2-tab layout.
// (Plain state instead of a navigation library = fewer dependencies to debug.)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar as RNStatusBar, useColorScheme, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { palettes } from './src/theme';
import DashboardScreen from './src/screens/DashboardScreen';
import StatsScreen from './src/screens/StatsScreen';

export default function App() {
  const scheme = useColorScheme();                 // follows phone setting
  const colors = palettes[scheme === 'dark' ? 'dark' : 'light'];
  const [tab, setTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', icon: 'moon-outline' },
    { id: 'stats', label: 'Stats', icon: 'stats-chart-outline' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: RNStatusBar.currentHeight || 40 }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Text style={[styles.title, { color: colors.text }]}>Salah Tracker</Text>

      {/* Only the active screen is mounted, so Stats reloads fresh data every time. */}
      <View style={{ flex: 1 }}>
        {tab === 'today' ? <DashboardScreen colors={colors} /> : <StatsScreen colors={colors} />}
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {tabs.map((t) => (
          <TouchableOpacity key={t.id} style={styles.tab} onPress={() => setTab(t.id)}>
            <Ionicons name={t.icon} size={24} color={tab === t.id ? colors.accent : colors.sub} />
            <Text style={{ color: tab === t.id ? colors.accent : colors.sub, fontSize: 12, marginTop: 2 }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 12, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center' },
});
