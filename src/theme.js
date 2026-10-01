// Calm colour palettes (sage green / slate / soft neutrals).
export const palettes = {
  light: { bg: '#F4F5F2', card: '#FFFFFF', text: '#26302B', sub: '#6B7770', border: '#E2E6E1', accent: '#7A9E87' },
  dark:  { bg: '#14181A', card: '#1E2427', text: '#E8EDEA', sub: '#92A09A', border: '#2B3338', accent: '#8FB39B' },
};

// Visual definition of every prayer status. `none` = not logged yet.
export const STATUS = {
  prayed:  { label: 'Prayed',     icon: 'checkmark-circle', color: '#4C9A6A' },
  delayed: { label: 'Delayed',    icon: 'time',             color: '#E0A030' },
  missed:  { label: 'Missed',     icon: 'close-circle',     color: '#D0584F' },
  exempt:  { label: 'Exempt',     icon: 'moon',             color: '#9B87C4' },
  none:    { label: 'Not logged', icon: 'ellipse-outline',  color: '#9AA5A0' },
};
