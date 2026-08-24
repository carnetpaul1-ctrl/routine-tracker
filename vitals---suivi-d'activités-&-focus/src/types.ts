export type ActivityType = 'sport' | 'coding' | 'focus' | 'cardio' | 'other';

export interface Activity {
  id: string;
  title: string;
  category: string;
  type: ActivityType;
  durationMinutes: number;
  sets?: number;
  repsAvg?: number;
  date: string; // YYYY-MM-DD or readable
  createdAt: number;
  notes?: string;
}

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface Lap {
  id: string;
  lapNumber: number;
  timeMs: number;
  formattedTime: string;
}

export interface DayProgress {
  day: string;
  shortDay: string;
  hours: number;
  isToday?: boolean;
}

export interface UserStats {
  sportMinutesToday: number;
  sportMinutesGoal: number;
  sportSetsCompleted: number;
  codingHoursToday: number;
  codingWeeklyData: DayProgress[];
  streakDays: number;
}
