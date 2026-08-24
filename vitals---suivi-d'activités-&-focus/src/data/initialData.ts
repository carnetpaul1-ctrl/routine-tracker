import { Activity, UserStats, Lap } from '../types';

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Séance Musculation',
    category: 'Haut du corps',
    type: 'sport',
    durationMinutes: 45,
    sets: 12,
    repsAvg: 10,
    date: "Aujourd'hui",
    createdAt: Date.now() - 3600000 * 3,
    notes: 'Développé couché, tractions et élévations latérales. Bonne intensité.'
  },
  {
    id: 'act-2',
    title: 'Session Code React',
    category: 'Refactoring UI',
    type: 'coding',
    durationMinutes: 135, // 2h 15m
    date: "Aujourd'hui",
    createdAt: Date.now() - 3600000 * 6,
    notes: 'Optimisation des animations motion et découpage des composants.'
  }
];

export const INITIAL_STATS: UserStats = {
  sportMinutesToday: 45,
  sportMinutesGoal: 60,
  sportSetsCompleted: 3,
  codingHoursToday: 2.5,
  codingWeeklyData: [
    { day: 'Lundi', shortDay: 'L', hours: 1.2 },
    { day: 'Mardi', shortDay: 'M', hours: 2.0 },
    { day: 'Mercredi', shortDay: 'M', hours: 0.9 },
    { day: 'Jeudi', shortDay: 'J', hours: 2.8 },
    { day: 'Vendredi', shortDay: 'V', hours: 2.5, isToday: true },
    { day: 'Samedi', shortDay: 'S', hours: 0.4 },
    { day: 'Dimanche', shortDay: 'D', hours: 0.3 },
  ],
  streakDays: 7
};

export const INITIAL_LAPS: Lap[] = [
  { id: 'lap-3', lapNumber: 3, timeMs: 72450, formattedTime: '01:12.45' },
  { id: 'lap-2', lapNumber: 2, timeMs: 58210, formattedTime: '00:58.21' },
  { id: 'lap-1', lapNumber: 1, timeMs: 65100, formattedTime: '01:05.10' }
];
