import React, { useState } from 'react';
import { X, User, Flame, Target, RotateCcw, Check, Sparkles } from 'lucide-react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onResetData: () => void;
  totalActivitiesCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  onResetData,
  totalActivitiesCount,
}) => {
  const [sportGoal, setSportGoal] = useState(stats.sportMinutesGoal);

  if (!isOpen) return null;

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onUpdateStats({
      sportMinutesGoal: Number(sportGoal),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="profile-modal-container"
        className="w-full max-w-md bg-[#121212] border border-white/[0.08] rounded-[36px] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-geist">
              Compte & Préférences
            </span>
            <h3 className="text-lg font-medium text-white mt-0.5">Profil & Paramètres</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 mt-4 p-4 rounded-2xl bg-[#1a1a1a] border border-white/5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-black font-bold text-xl shadow-md">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-medium text-white">Paul Carnet</h4>
            <p className="text-xs text-white/40 font-geist">carnet.paul1@gmail.com</p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <span>Membre Premium Pro</span>
            </div>
          </div>
        </div>

        {/* Stats Highlights */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-300">
              <Flame className="w-5 h-5 fill-amber-400/40" />
            </div>
            <div>
              <p className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-wider">Série active</p>
              <p className="font-geist text-lg font-light text-white">{stats.streakDays} Jours</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-wider">Activités</p>
              <p className="font-geist text-lg font-light text-white">{totalActivitiesCount} Loggées</p>
            </div>
          </div>
        </div>

        {/* Edit Daily Goals Form */}
        <form onSubmit={handleSaveGoals} className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-amber-200" />
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-geist">
              Objectifs Quotidiens
            </h5>
          </div>

          <div>
            <label className="flex justify-between items-center text-xs font-semibold text-white/60 mb-1 font-geist">
              <span>Objectif Sport Quotidien</span>
              <span className="text-amber-300 font-bold">{sportGoal} min</span>
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              value={sportGoal}
              onChange={(e) => setSportGoal(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 hover:opacity-95 text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/20 active:scale-[0.98]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Mettre à jour les objectifs</span>
            </button>
          </div>
        </form>

        {/* Reset / Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.05] flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser les données comme dans la démo initiale ?')) {
                sound.playClick();
                onResetData();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-red-500/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser les données de démo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

