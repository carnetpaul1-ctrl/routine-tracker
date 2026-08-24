import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Flag, RefreshCw } from 'lucide-react';
import { Lap, TimerMode } from '../types';
import { INITIAL_LAPS } from '../data/initialData';
import { sound } from '../utils/audio';

export const FocusView: React.FC = () => {
  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const modeDurations: Record<TimerMode, number> = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.pomodoro);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const totalDuration = modeDurations[timerMode];

  // Stopwatch state
  const [stopwatchTimeMs, setStopwatchTimeMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>(INITIAL_LAPS);
  const stopwatchRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sound.playCompletion();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  // Handle Mode Change
  const handleModeChange = (mode: TimerMode) => {
    sound.playClick();
    setTimerMode(mode);
    setTimeLeft(modeDurations[mode]);
    setIsTimerRunning(false);
  };

  const toggleTimer = () => {
    sound.playClick();
    if (timeLeft === 0) {
      setTimeLeft(modeDurations[timerMode]);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
    setTimeLeft(modeDurations[timerMode]);
  };

  const skipTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
    if (timerMode === 'pomodoro') {
      handleModeChange('shortBreak');
    } else if (timerMode === 'shortBreak') {
      handleModeChange('pomodoro');
    } else {
      handleModeChange('pomodoro');
    }
  };

  // Stopwatch effect
  useEffect(() => {
    if (isStopwatchRunning) {
      lastTimeRef.current = performance.now();
      const updateStopwatch = () => {
        const now = performance.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;
        setStopwatchTimeMs((prev) => prev + delta);
        stopwatchRef.current = requestAnimationFrame(updateStopwatch);
      };
      stopwatchRef.current = requestAnimationFrame(updateStopwatch);
    } else if (stopwatchRef.current) {
      cancelAnimationFrame(stopwatchRef.current);
    }
    return () => {
      if (stopwatchRef.current) cancelAnimationFrame(stopwatchRef.current);
    };
  }, [isStopwatchRunning]);

  const toggleStopwatch = () => {
    sound.playClick();
    setIsStopwatchRunning(!isStopwatchRunning);
  };

  const resetStopwatch = () => {
    sound.playClick();
    setIsStopwatchRunning(false);
    setStopwatchTimeMs(0);
    setLaps([]);
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  };

  const addLap = () => {
    sound.playClick();
    const newLap: Lap = {
      id: `lap-${Date.now()}`,
      lapNumber: laps.length + 1,
      timeMs: stopwatchTimeMs,
      formattedTime: formatStopwatch(stopwatchTimeMs),
    };
    setLaps([newLap, ...laps]);
  };

  // Format timer MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate circular SVG progress
  // Radius = 45 -> circumference = 2 * PI * 45 = 282.743
  const circumference = 282.743;
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* Mode Switcher */}
      <div className="flex bg-[#1a1a1a] rounded-full p-1 mb-8 max-w-sm mx-auto border border-white/5" role="tablist">
        <button
          role="tab"
          aria-selected={timerMode === 'pomodoro'}
          onClick={() => handleModeChange('pomodoro')}
          className={`px-4 py-2 rounded-full font-geist text-xs font-semibold transition-all duration-300 ${
            timerMode === 'pomodoro'
              ? 'bg-gradient-to-r from-amber-200 to-amber-400 text-black shadow-sm'
              : 'text-white/40 hover:text-white'
          }`}
        >
          Pomodoro
        </button>
        <button
          role="tab"
          aria-selected={timerMode === 'shortBreak'}
          onClick={() => handleModeChange('shortBreak')}
          className={`px-4 py-2 rounded-full font-geist text-xs font-semibold transition-all duration-300 ${
            timerMode === 'shortBreak'
              ? 'bg-gradient-to-r from-amber-200 to-amber-400 text-black shadow-sm'
              : 'text-white/40 hover:text-white'
          }`}
        >
          Short Break
        </button>
        <button
          role="tab"
          aria-selected={timerMode === 'longBreak'}
          onClick={() => handleModeChange('longBreak')}
          className={`px-4 py-2 rounded-full font-geist text-xs font-semibold transition-all duration-300 ${
            timerMode === 'longBreak'
              ? 'bg-gradient-to-r from-amber-200 to-amber-400 text-black shadow-sm'
              : 'text-white/40 hover:text-white'
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Timer Ring */}
      <div className="relative w-64 h-64 mb-8 mx-auto flex items-center justify-center">
        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Background & Progress SVG */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-[#252525]"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          <circle
            className="text-amber-300 transition-all duration-500 ease-linear"
            cx="50"
            cy="50"
            fill="none"
            id="progress-circle"
            r="45"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="3.5"
          />
        </svg>

        {/* Time Display */}
        <div className="text-center z-10 flex flex-col items-center justify-center">
          <span
            id="time-display"
            className="font-geist text-[56px] sm:text-[64px] font-light leading-none text-white tracking-tighter"
          >
            {formatTimer(timeLeft)}
          </span>
          <span className="font-geist text-[10px] font-bold text-white/40 mt-3 uppercase tracking-[0.2em]">
            {timerMode === 'pomodoro' ? 'FOCUS SESSION' : 'PAUSE TEMPO'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          id="btn-timer-reset"
          onClick={resetTimer}
          aria-label="Réinitialiser le minuteur"
          className="w-12 h-12 rounded-full bg-[#1a1a1a] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 border border-white/5"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          id="play-pause-btn"
          onClick={toggleTimer}
          aria-label={isTimerRunning ? 'Mettre en pause' : 'Démarrer le minuteur'}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-black shadow-[0_10px_30px_rgba(245,158,11,0.25)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          {isTimerRunning ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        <button
          id="btn-timer-skip"
          onClick={skipTimer}
          aria-label="Passer à l'étape suivante"
          className="w-12 h-12 rounded-full bg-[#1a1a1a] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95 border border-white/5"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.04] mb-6" />

      {/* Stopwatch Section */}
      <div className="w-full bg-[#1a1a1a] rounded-[32px] p-6 border border-white/[0.04] shadow-2xl">
        <div className="flex justify-between items-end mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-geist">
              Chronomètre
            </span>
            <div
              id="stopwatch-display"
              className="font-geist text-3xl sm:text-4xl font-light text-white tracking-tight mt-0.5"
            >
              {formatStopwatch(stopwatchTimeMs)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              id="sw-reset-btn"
              onClick={resetStopwatch}
              title="Réinitialiser chronomètre"
              className="w-10 h-10 rounded-full bg-[#252525] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/5 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              id="sw-lap-btn"
              onClick={addLap}
              disabled={stopwatchTimeMs === 0}
              title="Marquer un tour (Lap)"
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 transition-colors active:scale-95 ${
                stopwatchTimeMs > 0
                  ? 'bg-[#252525] text-white hover:bg-white/10'
                  : 'bg-[#1a1a1a] text-white/20 opacity-40 cursor-not-allowed'
              }`}
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              id="sw-play-btn"
              onClick={toggleStopwatch}
              title={isStopwatchRunning ? 'Pause' : 'Démarrer'}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 border border-white/5 ${
                isStopwatchRunning
                  ? 'bg-amber-400 text-black'
                  : 'bg-[#252525] text-white hover:bg-white/10'
              }`}
            >
              {isStopwatchRunning ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Laps List */}
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {laps.length === 0 ? (
            <div className="text-center py-4 text-xs text-white/30">
              Aucun tour enregistré. Marquez un temps intermédiaire avec le drapeau.
            </div>
          ) : (
            laps.map((lap) => (
              <div
                key={lap.id}
                className="flex justify-between items-center py-2 px-1 border-b border-white/[0.04] last:border-0 text-sm"
              >
                <span className="font-geist text-xs font-semibold text-white/50">
                  Lap {lap.lapNumber}
                </span>
                <span className="font-mono text-sm text-amber-200">
                  {lap.formattedTime}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

