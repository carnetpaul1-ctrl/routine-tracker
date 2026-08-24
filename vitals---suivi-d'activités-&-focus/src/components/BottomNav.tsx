import React from 'react';
import { LayoutGrid, ListFilter, Timer } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavTab = 'dashboard' | 'activites' | 'focus';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'DASHBOARD',
      icon: LayoutGrid,
    },
    {
      id: 'activites' as NavTab,
      label: 'ACTIVITÉS',
      icon: ListFilter,
    },
    {
      id: 'focus' as NavTab,
      label: 'FOCUS',
      icon: Timer,
    },
  ];

  const handleTabClick = (tabId: NavTab) => {
    sound.playClick();
    onSelectTab(tabId);
  };

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c]/95 backdrop-blur-2xl border-t border-white/[0.03] pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="h-16 max-w-lg mx-auto flex items-center justify-around px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
                isActive
                  ? 'text-amber-200'
                  : 'text-white/35 hover:text-white/70'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-amber-200' : ''}`} />
                {isActive && (
                  <span className="absolute -inset-1.5 bg-amber-400/20 rounded-full blur-sm -z-10" />
                )}
              </div>
              <span className={`font-geist text-[10px] font-bold tracking-[0.15em] uppercase ${isActive ? 'text-amber-200' : 'text-white/40'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

