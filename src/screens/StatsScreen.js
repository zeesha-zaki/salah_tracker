// Stats: week / month summary with simple percentage bars.
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { emptyDay, loadDays, toKey } from '../storage';
import { computeStats, computeStreak } from '../stats';
import { STATUS } from '../theme';

const HISTORY_DAYS = 366; // how far back we load (also used for the streak)

function Bar({ label, pct, color, colors }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <View style={styles.barHeader}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{label}</Text>
        <Text style={{ color, fontWeight: '700' }}>{pct}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function StatsScreen({ colors }) {
  const [range, setRange] = useState('week'); // 'week' | 'month'
  const [daysNewestFirst, setDays] = useState([]);

  // Build list of the last N dates (index 0 = today) and load them.
  const load = useCallback(async () => {
    const dates = [];
    for (let i = 0; i < HISTORY_DAYS; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(toKey(d));
    }
    const map = await loadDays(dates);
    setDays(dates.map((k) => map[k] || emptyDay()));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Week = last 7 days, Month = last 30 days.
  const n = range === 'week' ? 7 : 30;
  const stats = computeStats(daysNewestFirst.slice(0, n));
  const streak = computeStreak(daysNewestFirst);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Week / Month switch */}
      <View style={[styles.switch, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {['week', 'month'].map((r) => (
          <TouchableOpacity key={r} onPress={() => setRange(r)}
            style={[styles.switchBtn, range === r && { backgroundColor: colors.accent }]}>
            <Text style={{ color: range === r ? '#fff' : colors.sub, fontWeight: '600' }}>
              {r === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ color: colors.sub }}>Overall completion</Text>
        <Text style={[styles.big, { color: colors.text }]}>{stats.totalPct}%</Text>
        <Text style={{ color: colors.sub }}>
          {stats.prayed + stats.delayed} of {stats.denom} counted prayers
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Bar label="Prayed on time" pct={stats.onTimePct} color={STATUS.prayed.color} colors={colors} />
        <Bar label="Delayed" pct={stats.delayedPct} color={STATUS.delayed.color} colors={colors} />
        <Bar label="Missed" pct={stats.missedPct} color={STATUS.missed.color} colors={colors} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Current streak: {streak} day{streak === 1 ? '' : 's'}</Text>
        <Text style={{ color: colors.sub, marginTop: 6 }}>
          Days checked: {stats.checked}  |  Exempt prayers skipped: {stats.exempt}
        </Text>
        <Text style={{ color: colors.sub, marginTop: 6, fontSize: 12 }}>
          Formula: prayed / (days checked x 5 - exempt prayers). Exempt days never count as missed
          and never break your streak.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  switch: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, marginBottom: 16 },
  switchBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 14 },
  big: { fontSize: 44, fontWeight: '800', marginVertical: 4 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track: { height: 10, borderRadius: 5, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
});
