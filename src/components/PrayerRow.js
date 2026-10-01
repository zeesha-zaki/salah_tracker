// One row = one prayer. Tap to cycle: none -> prayed -> delayed -> missed -> none.
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS } from '../theme';

export const NEXT = { none: 'prayed', prayed: 'delayed', delayed: 'missed', missed: 'none' };

export default function PrayerRow({ name, status, disabled, onPress, colors }) {
  const s = STATUS[status] || STATUS.none;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}            // Exempt days cannot be edited
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      <View style={styles.right}>
        <Text style={[styles.label, { color: s.color }]}>{s.label}</Text>
        <Ionicons name={s.icon} size={30} color={s.color} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
         padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '600' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 14, fontWeight: '500' },
});
