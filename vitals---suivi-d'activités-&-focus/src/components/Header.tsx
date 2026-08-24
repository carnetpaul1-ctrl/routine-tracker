import React from 'react';
import { User } from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 w-full z-40 bg-[#121212]/90 backdrop-blur-xl border-b border-white/[0.03] transition-all"
    >
      <div className="h-16 px-5 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-2xl tracking-tight text-white">
                Vitals
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" title="Synchronisé" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 font-geist -mt-0.5">
              Performance OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="profile-button"
            onClick={onOpenProfile}
            aria-label="Profil utilisateur"
            className="w-9 h-9 rounded-full bg-[#1a1a1a] hover:bg-white/10 border border-white/10 flex items-center justify-center text-amber-200 transition-all active:scale-95 shadow-sm"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

