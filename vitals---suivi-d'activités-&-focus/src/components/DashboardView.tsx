import React from 'react';
import { Dumbbell, Code2, Edit2, Plus, Flame, Award } from 'lucide-react';
import { Activity, UserStats } from '../types';
import { sound } from '../utils/audio';

interface DashboardViewProps {
  stats: UserStats;
  activities: Activity[];
  onAddNewActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onOpenFocus: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  activities,
  onAddNewActivity,
  onEditActivity,
}) => {
  // Find primary sport and coding activities if available
  const sportActivity = activities.find((a) => a.type === 'sport') || activities[0];
  const codingActivity = activities.find((a) => a.type === 'coding') || activities[1];

  const sportProgressPercent = Math.min(
    100,
    Math.round((stats.sportMinutesToday / (stats.sportMinutesGoal || 60)) * 100)
  );

  return (
    <div className="flex flex-col w-full gap-4 pb-28 pt-2">
      {/* Title Header */}
      <div className="flex flex-col gap-1 mb-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-geist">
              Synthèse journalière
            </span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white mt-0.5">
              Aujourd'hui
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-white/5 text-xs text-amber-300 font-semibold shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-geist">{stats.streakDays}j streak</span>
          </div>
        </div>
        <p className="text-xs text-white/40">
          Suivez vos séances, focus et temps de code.
        </p>
      </div>

      {/* Sport Card */}
      <div
        id="card-dashboard-sport"
        className="relative w-full rounded-[32px] bg-[#1a1a1a] border border-white/[0.04] overflow-hidden shadow-2xl p-6 hover:border-white/10 transition-all duration-300 group"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-200">
              <Dumbbell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Sport</h3>
              <p className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                Objectif journalier
              </p>
            </div>
          </div>
          <button
            id="edit-sport-btn"
            onClick={() => {
              sound.playClick();
              if (sportActivity) onEditActivity(sportActivity);
              else onAddNewActivity();
            }}
            aria-label="Modifier l'activité Sport"
            className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 text-white/80 active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col gap-1">
            <span className="font-geist text-3xl sm:text-4xl font-light text-white">
              {stats.sportMinutesToday}{' '}
              <span className="text-white/40 text-sm font-normal">min</span>
            </span>
            <span className="text-xs text-white/60 font-medium">
              {stats.sportSetsCompleted} Sets Complétés
            </span>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-[#252525]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="100, 100"
                strokeWidth="3.2"
              />
              {/* Progress Circle */}
              <path
                className="text-amber-300 transition-all duration-1000 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${sportProgressPercent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="font-geist text-xs font-bold text-amber-200">
                {sportProgressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coding Card */}
      <div
        id="card-dashboard-coding"
        className="relative w-full rounded-[32px] bg-[#1a1a1a] border border-white/[0.04] overflow-hidden shadow-2xl p-6 hover:border-white/10 transition-all duration-300 group"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-400/10 flex items-center justify-center border border-indigo-400/20 text-indigo-300">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Coding</h3>
              <p className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                Session actuelle
              </p>
            </div>
          </div>
          <button
            id="edit-coding-btn"
            onClick={() => {
              sound.playClick();
              if (codingActivity) onEditActivity(codingActivity);
              else onAddNewActivity();
            }}
            aria-label="Modifier la session Coding"
            className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 text-white/80 active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mb-4 relative z-10">
          <span className="font-geist text-3xl sm:text-4xl font-light text-white">
            {stats.codingHoursToday}{' '}
            <span className="text-white/40 text-sm font-normal">heures</span>
          </span>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-32 flex items-end justify-between gap-2 border-t border-white/[0.04] pt-4 px-1 relative z-10">
          {stats.codingWeeklyData.map((item, idx) => {
            // max height approx 3h = 100%
            const heightPercent = Math.min(100, Math.max(10, Math.round((item.hours / 3.0) * 100)));
            const isToday = item.isToday;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 group/bar">
                <div className="w-full h-24 flex items-end justify-center">
                  <div
                    className={`w-full max-w-[28px] rounded-t-sm transition-all duration-500 relative ${
                      isToday
                        ? 'bg-gradient-to-t from-amber-400 to-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : item.hours > 0.5
                        ? 'bg-[#383838]'
                        : 'bg-[#222222]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {isToday && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-300 text-black text-[10px] font-bold px-1.5 py-0.5 rounded font-geist whitespace-nowrap shadow-sm">
                        Auj
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`font-geist text-[10px] font-bold tracking-wider ${
                    isToday ? 'text-amber-200' : 'text-white/30'
                  }`}
                >
                  {item.shortDay}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Pill */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1a1a1a]/60 border border-white/[0.03] text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-200" />
          <span>Total activités : <strong className="text-white">{activities.length}</strong></span>
        </div>
        <span className="text-emerald-400 font-semibold font-geist">+12% vs hier</span>
      </div>

      {/* Action Button: Nouvelle Activité */}
      <button
        id="btn-new-activity-dashboard"
        onClick={() => {
          sound.playClick();
          onAddNewActivity();
        }}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-black font-semibold text-sm shadow-[0_10px_25px_rgba(245,158,11,0.2)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1 tracking-wide"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Nouvelle Activité</span>
      </button>
    </div>
  );
};

