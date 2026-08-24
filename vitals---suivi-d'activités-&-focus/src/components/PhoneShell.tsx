import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Smartphone, Maximize2 } from 'lucide-react';

interface PhoneShellProps {
  children: React.ReactNode;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState<string>('10:24');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-x-hidden flex flex-col items-center justify-start text-[#e0e0e0] select-none">
      {/* Ambient background glow spots inspired by Elegant Dark theme */}
      <div className="fixed top-[-150px] left-[-150px] w-[550px] h-[550px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-150px] right-[-150px] w-[550px] h-[550px] bg-amber-900/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Top Simulator Control Bar for Desktop */}
      <div className="w-full py-2.5 px-6 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/[0.04] hidden md:flex items-center justify-between z-50 text-xs">
        <div className="flex items-center gap-2.5 text-white/50">
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="font-semibold text-white tracking-wide">Vitals</span>
          <span className="text-white/30 uppercase tracking-widest text-[10px]">• Elegant Dark OLED Edition</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFrameMode(!isFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1a1a] hover:bg-white/5 text-white/80 hover:text-white text-xs transition-colors border border-white/5"
          >
            {isFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-200" />
                <span>Plein écran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-200" />
                <span>Cadre Smartphone</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`w-full flex-1 flex justify-center ${isFrameMode ? 'md:py-8' : ''}`}>
        <div
          className={`w-full transition-all duration-300 relative bg-[#121212] ${
            isFrameMode
              ? 'max-w-[420px] md:rounded-[56px] md:border-[6px] md:border-[#252525] md:shadow-[0_40px_100px_rgba(0,0,0,0.8)] md:overflow-hidden md:min-h-[860px]'
              : 'max-w-md'
          }`}
        >
          {/* Android Status Bar (Shown on frame mode / mobile) */}
          <div className="w-full h-9 px-7 flex items-center justify-between text-xs text-white/70 z-50 pt-2 pointer-events-none">
            <span className="font-medium tracking-tight font-geist text-[13px] text-white/90">{currentTime}</span>
            
            {/* Camera Punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#080808] border border-[#252525] -mt-1 hidden md:block" />

            <div className="flex items-center gap-2 text-white/60">
              <Wifi className="w-3.5 h-3.5 text-white/70" />
              <div className="flex items-center gap-1">
                <span className="font-geist text-[10px] font-semibold text-white/60">85%</span>
                <BatteryMedium className="w-4 h-4 text-amber-200/80" />
              </div>
            </div>
          </div>

          {/* App Body Content */}
          <div className="relative min-h-[calc(100vh-36px)] md:min-h-[815px] flex flex-col">
            {children}
          </div>

          {/* Android Home Bar */}
          <div className="w-full h-5 flex items-center justify-center pointer-events-none pb-1.5">
            <div className="w-28 h-1 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};
