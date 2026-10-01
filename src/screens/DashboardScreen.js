// Daily dashboard: date navigation, Period Mode toggle, and the 5 prayers.
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrayerRow, { NEXT } from '../components/PrayerRow';
import { PRAYERS, emptyDay, loadDay, saveDay, toKey } from '../storage';
import { STATUS } from '../theme';

export default function DashboardScreen({ colors }) {
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState(emptyDay());

  const dateKey = toKey(date);
  const isToday = dateKey === toKey(new Date());

  // Reload saved data whenever the selected date changes.
  useEffect(() => {
    let cancelled = false;
    loadDay(dateKey).then((d) => { if (!cancelled) setDay(d); });
    return () => { cancelled = true; };
  }, [dateKey]);

  // Update state + persist in one place.
  const update = (next) => { setDay(next); saveDay(dateKey, next); };

  const cycle = (key) => {
    const current = day.prayers[key] || 'none';
    const next = NEXT[current];
    const prayers = { ...day.prayers };
    if (next === 'none') delete prayers[key]; else prayers[key] = next;
    update({ ...day, prayers });
  };

  // Period Mode keeps the old prayer statuses stored but ignores them while ON.
  const toggleExempt = (value) => update({ ...day, exempt: value });

  const shiftDay = (n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    if (d <= new Date()) setDate(d); // never go into the future
  };

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Date navigation */}
      <View style={styles.dateBar}>
        <TouchableOpacity onPress={() => shiftDay(-1)} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.accent} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.date, { color: colors.text }]}>{dateLabel}</Text>
          {!isToday && (
            <TouchableOpacity onPress={() => setDate(new Date())}>
              <Text style={{ color: colors.accent, marginTop: 4 }}>Back to today</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => shiftDay(1)} disabled={isToday} hitSlop={12}>
          <Ionicons name="chevron-forward" size={28} color={isToday ? colors.border : colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Period Mode toggle */}
      <View style={[styles.period, { backgroundColor: colors.card, borderColor: STATUS.exempt.color }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.periodTitle, { color: colors.text }]}>Period Mode</Text>
          <Text style={{ color: colors.sub, marginTop: 2 }}>
            Exemption period - prayers are excused and not counted as missed.
          </Text>
        </View>
        <Switch
          value={day.exempt}
          onValueChange={toggleExempt}
          trackColor={{ true: STATUS.exempt.color, false: colors.border }}
          thumbColor="#fff"
        />
      </View>

      {/* The 5 prayers */}
      {PRAYERS.map((p) => (
        <PrayerRow
          key={p.key}
          name={p.name}
          colors={colors}
          status={day.exempt ? 'exempt' : day.prayers[p.key] || 'none'}
          disabled={day.exempt}
          onPress={() => cycle(p.key)}
        />
      ))}

      <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 8 }}>
        Tap a prayer to cycle: Prayed, Delayed, Missed, Not logged
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  dateBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  date: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  period: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16,
            borderWidth: 1.5, marginBottom: 16, gap: 12 },
  periodTitle: { fontSize: 17, fontWeight: '700' },
});
