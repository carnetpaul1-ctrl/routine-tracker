import React, { useState, useEffect } from 'react';
import { X, Trash2, Dumbbell, Code2, BookOpen, Activity as PulseIcon, Check } from 'lucide-react';
import { Activity, ActivityType } from '../types';
import { sound } from '../utils/audio';

interface ActivityModalProps {
  isOpen: boolean;
  activityToEdit?: Activity | null;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id' | 'createdAt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  activityToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<ActivityType>('sport');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [sets, setSets] = useState<number>(12);
  const [repsAvg, setRepsAvg] = useState<number>(10);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setCategory(activityToEdit.category);
      setType(activityToEdit.type);
      setDurationMinutes(activityToEdit.durationMinutes);
      setSets(activityToEdit.sets || 0);
      setRepsAvg(activityToEdit.repsAvg || 10);
      setNotes(activityToEdit.notes || '');
    } else {
      // Default new activity template
      setTitle('Séance Musculation');
      setCategory('Haut du corps');
      setType('sport');
      setDurationMinutes(45);
      setSets(12);
      setRepsAvg(10);
      setNotes('');
    }
  }, [activityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    onSave({
      id: activityToEdit ? activityToEdit.id : undefined,
      title: title.trim(),
      category: category.trim(),
      type,
      durationMinutes: Math.max(1, Number(durationMinutes) || 30),
      sets: type === 'sport' || sets > 0 ? Number(sets) : undefined,
      repsAvg: type === 'sport' || repsAvg > 0 ? Number(repsAvg) : undefined,
      date: activityToEdit ? activityToEdit.date : "Aujourd'hui",
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleTypeSelect = (newType: ActivityType) => {
    sound.playClick();
    setType(newType);
    if (!activityToEdit) {
      if (newType === 'sport') {
        setTitle('Séance Musculation');
        setCategory('Haut du corps');
        setDurationMinutes(45);
        setSets(12);
        setRepsAvg(10);
      } else if (newType === 'coding') {
        setTitle('Session Code React');
        setCategory('Refactoring UI');
        setDurationMinutes(135);
      } else if (newType === 'focus') {
        setTitle('Session Lecture & Synthèse');
        setCategory('Deep Work');
        setDurationMinutes(60);
      } else {
        setTitle('Session Cardio');
        setCategory('Course à pied');
        setDurationMinutes(30);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="activity-modal-container"
        className="w-full max-w-md bg-[#121212] border border-white/[0.08] rounded-[36px] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-geist">
              Configuration
            </span>
            <h3 className="text-lg font-medium text-white mt-0.5">
              {activityToEdit ? "Modifier l'activité" : 'Nouvelle activité'}
            </h3>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Activity Type Badges */}
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.15em] font-geist">
              Type d'activité
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleTypeSelect('sport')}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
                  type === 'sport'
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1a1a1a] border-white/5 text-white/50 hover:text-white'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>Sport</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('coding')}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
                  type === 'coding'
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1a1a1a] border-white/5 text-white/50 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Coding</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('focus')}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
                  type === 'focus'
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1a1a1a] border-white/5 text-white/50 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Focus</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('cardio')}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold border transition-all ${
                  type === 'cardio'
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1a1a1a] border-white/5 text-white/50 hover:text-white'
                }`}
              >
                <PulseIcon className="w-4 h-4" />
                <span>Cardio</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-geist">
              Titre de l'activité
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Séance Musculation"
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Subtitle / Category */}
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-geist">
              Catégorie / Détail
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Haut du corps, Refactoring UI..."
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          {/* Duration */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-geist">
                Durée (minutes)
              </label>
              <span className="font-geist text-xs text-amber-200 font-bold">
                {durationMinutes} min ({Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="240"
              step="5"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Sport specific: Sets and Reps */}
          {type === 'sport' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-geist">
                  Nombre de Séries
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:border-amber-400 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none transition-colors font-geist"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-geist">
                  Répétitions moy.
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={repsAvg}
                  onChange={(e) => setRepsAvg(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-white/10 focus:border-amber-400 rounded-2xl px-3 py-2 text-sm text-white focus:outline-none transition-colors font-geist"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-geist">
              Notes (Optionnel)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sensations, exercices effectués, objectifs..."
              className="w-full bg-[#1a1a1a] border border-white/10 focus:border-amber-400 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {activityToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onDelete(activityToEdit.id);
                  onClose();
                }}
                className="px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1.5 border border-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-4 py-3 rounded-2xl bg-[#1a1a1a] hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold border border-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 text-black text-xs font-bold shadow-md shadow-amber-400/20 flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

