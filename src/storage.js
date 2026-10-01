// All data lives on the device in AsyncStorage. No network, no accounts.
// One record per day, key "salah:YYYY-MM-DD", value:
//   { exempt: boolean, prayers: { fajr: 'prayed'|'delayed'|'missed', ... } }
// A prayer with no entry = "not logged".
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PRAYERS = [
  { key: 'fajr', name: 'Fajr' },
  { key: 'dhuhr', name: 'Dhuhr' },
  { key: 'asr', name: 'Asr' },
  { key: 'maghrib', name: 'Maghrib' },
  { key: 'isha', name: 'Isha' },
];

const PREFIX = 'salah:';
export const emptyDay = () => ({ exempt: false, prayers: {} });

// Date -> "YYYY-MM-DD" using LOCAL time (toISOString would use UTC and shift days).
export const toKey = (d) => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export async function loadDay(dateKey) {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + dateKey);
    return raw ? { ...emptyDay(), ...JSON.parse(raw) } : emptyDay();
  } catch (e) {
    console.warn('loadDay failed', e);
    return emptyDay();
  }
}

export async function saveDay(dateKey, day) {
  try {
    await AsyncStorage.setItem(PREFIX + dateKey, JSON.stringify(day));
  } catch (e) {
    console.warn('saveDay failed', e);
  }
}

// Load many days at once -> { "2025-01-02": day, ... }
export async function loadDays(dateKeys) {
  const out = {};
  try {
    const pairs = await AsyncStorage.multiGet(dateKeys.map((k) => PREFIX + k));
    pairs.forEach(([k, v]) => {
      if (v) out[k.slice(PREFIX.length)] = { ...emptyDay(), ...JSON.parse(v) };
    });
  } catch (e) {
    console.warn('loadDays failed', e);
  }
  return out;
}
