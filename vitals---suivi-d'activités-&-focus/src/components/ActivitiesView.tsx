import React from 'react';
import { Dumbbell, Terminal, Plus, Edit3, BookOpen, Clock } from 'lucide-react';
import { Activity } from '../types';
import { sound } from '../utils/audio';

interface ActivitiesViewProps {
  activities: Activity[];
  onAddNewActivity: () => void;
  onEditActivity: (activity: Activity) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  onAddNewActivity,
  onEditActivity,
}) => {
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'sport' || activity.type === 'cardio') {
      return (
        <div className="w-11 h-11 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
          <Dumbbell className="w-5 h-5 text-amber-300" />
        </div>
      );
    }
    if (activity.type === 'coding') {
      return (
        <div className="w-11 h-11 rounded-2xl bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center shrink-0">
          <Terminal className="w-5 h-5 text-indigo-300" />
        </div>
      );
    }
    if (activity.type === 'focus') {
      return (
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Clock className="w-5 h-5 text-white/70" />
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-3 pb-28 pt-2 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-geist">
            Historique quotidien
          </span>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white mt-0.5">
            Journal d'activités
          </h2>
        </div>
        <span className="font-geist text-[10px] font-bold text-amber-300 bg-[#1a1a1a] border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider">
          Aujourd'hui
        </span>
      </div>

      {/* Activities List */}
      <div className="flex flex-col gap-3">
        {activities.map((activity) => {
          const isSport = activity.type === 'sport' || activity.type === 'cardio' || (activity.sets && activity.sets > 0);

          return (
            <div
              key={activity.id}
              id={`activity-item-${activity.id}`}
              className="relative bg-[#1a1a1a] rounded-[28px] p-5 flex flex-col gap-3 border border-white/[0.04] hover:border-white/10 transition-all shadow-xl group"
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getActivityIcon(activity)}
                  <div>
                    <h3 className="text-base font-medium text-white">
                      {activity.title}
                    </h3>
                    <p className="text-xs text-white/40">
                      {activity.category || 'Général'}
                    </p>
                  </div>
                </div>
                <button
                  id={`edit-activity-${activity.id}`}
                  onClick={() => {
                    sound.playClick();
                    onEditActivity(activity);
                  }}
                  aria-label={`Modifier ${activity.title}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors bg-[#252525] hover:bg-white/10 border border-white/5 active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Metrics */}
              {isSport ? (
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="bg-black/30 rounded-2xl p-2.5 flex flex-col items-center justify-center border border-white/[0.02]">
                    <span className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Durée
                    </span>
                    <span className="font-geist text-lg font-light text-white mt-0.5">
                      {formatDuration(activity.durationMinutes)}
                    </span>
                  </div>
                  <div className="bg-black/30 rounded-2xl p-2.5 flex flex-col items-center justify-center border border-white/[0.02]">
                    <span className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Séries
                    </span>
                    <span className="font-geist text-lg font-light text-amber-300 mt-0.5">
                      {activity.sets || 0}
                    </span>
                  </div>
                  <div className="bg-black/30 rounded-2xl p-2.5 flex flex-col items-center justify-center border border-white/[0.02]">
                    <span className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Reps moy.
                    </span>
                    <span className="font-geist text-lg font-light text-amber-200 mt-0.5">
                      {activity.repsAvg || 10}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-black/30 rounded-2xl p-3 flex justify-between items-center border border-white/[0.02]">
                    <span className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Temps de Focus
                    </span>
                    <span className="font-geist text-xl font-light text-amber-200">
                      {formatDuration(activity.durationMinutes)}
                    </span>
                  </div>
                </div>
              )}

              {/* Optional Notes */}
              {activity.notes && (
                <p className="text-xs text-white/30 italic pt-1 border-t border-white/[0.04] line-clamp-1">
                  "{activity.notes}"
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty / Add CTA Card */}
      <button
        id="btn-add-activity-inline"
        onClick={() => {
          sound.playClick();
          onAddNewActivity();
        }}
        className="mt-2 w-full border border-dashed border-white/10 hover:border-amber-300/40 rounded-[28px] p-6 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] transition-all active:scale-[0.99] group"
      >
        <div className="w-11 h-11 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center group-hover:border-amber-400/50 transition-colors">
          <Plus className="w-5 h-5 text-white/40 group-hover:text-amber-200 transition-colors" />
        </div>
        <span className="text-xs font-medium text-white/50 group-hover:text-white transition-colors">
          Ajouter une nouvelle activité
        </span>
      </button>

      {/* Floating Action Button */}
      <button
        id="fab-add-activity"
        onClick={() => {
          sound.playClick();
          onAddNewActivity();
        }}
        aria-label="Ajouter une activité"
        className="fixed bottom-24 right-4 sm:right-6 w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-200 text-black rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.3)] z-30 active:scale-95 transition-all hover:scale-105"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};

