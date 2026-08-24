import React, { useState, useEffect } from 'react';
import { Activity, UserStats } from './types';
import { INITIAL_ACTIVITIES, INITIAL_STATS } from './data/initialData';
import { PhoneShell } from './components/PhoneShell';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ActivitiesView } from './components/ActivitiesView';
import { FocusView } from './components/FocusView';
import { ActivityModal } from './components/ActivityModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Activities State with localStorage persistence
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem('vitals_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // User Stats State
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('vitals_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vitals_activities', JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activities to localStorage:', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('vitals_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats to localStorage:', e);
    }
  }, [stats]);

  // Recalculate stats when activities change
  const refreshStats = (currentActivities: Activity[]) => {
    const sportActs = currentActivities.filter((a) => a.type === 'sport' || a.type === 'cardio');
    const totalSportMinutes = sportActs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const totalSets = sportActs.reduce((acc, curr) => acc + (curr.sets || 0), 0);

    const codingActs = currentActivities.filter((a) => a.type === 'coding');
    const totalCodingMinutes = codingActs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const totalCodingHours = Math.round((totalCodingMinutes / 60) * 10) / 10;

    setStats((prev) => ({
      ...prev,
      sportMinutesToday: totalSportMinutes || 45,
      sportSetsCompleted: totalSets || 3,
      codingHoursToday: totalCodingHours || 2.5,
    }));
  };

  // Add or Update Activity
  const handleSaveActivity = (data: Omit<Activity, 'id' | 'createdAt'> & { id?: string }) => {
    if (data.id) {
      // Update
      const updated = activities.map((act) =>
        act.id === data.id
          ? {
              ...act,
              title: data.title,
              category: data.category,
              type: data.type,
              durationMinutes: data.durationMinutes,
              sets: data.sets,
              repsAvg: data.repsAvg,
              notes: data.notes,
            }
          : act
      );
      setActivities(updated);
      refreshStats(updated);
    } else {
      // Create
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        title: data.title,
        category: data.category,
        type: data.type,
        durationMinutes: data.durationMinutes,
        sets: data.sets,
        repsAvg: data.repsAvg,
        date: "Aujourd'hui",
        createdAt: Date.now(),
        notes: data.notes,
      };
      const updated = [newActivity, ...activities];
      setActivities(updated);
      refreshStats(updated);
    }
    setActivityToEdit(null);
  };

  // Delete Activity
  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((act) => act.id !== id);
    setActivities(updated);
    refreshStats(updated);
    setActivityToEdit(null);
  };

  // Reset to initial mockup data
  const handleResetData = () => {
    setActivities(INITIAL_ACTIVITIES);
    setStats(INITIAL_STATS);
    localStorage.removeItem('vitals_activities');
    localStorage.removeItem('vitals_stats');
  };

  const handleOpenAddModal = () => {
    setActivityToEdit(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditModal = (activity: Activity) => {
    setActivityToEdit(activity);
    setIsActivityModalOpen(true);
  };

  return (
    <PhoneShell>
      {/* Sticky Header */}
      <Header onOpenProfile={() => setIsProfileModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-2 overflow-x-hidden">
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            activities={activities}
            onAddNewActivity={handleOpenAddModal}
            onEditActivity={handleOpenEditModal}
            onOpenFocus={() => setCurrentTab('focus')}
          />
        )}

        {currentTab === 'activites' && (
          <ActivitiesView
            activities={activities}
            onAddNewActivity={handleOpenAddModal}
            onEditActivity={handleOpenEditModal}
          />
        )}

        {currentTab === 'focus' && <FocusView />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Add / Edit Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        activityToEdit={activityToEdit}
        onClose={() => {
          setIsActivityModalOpen(false);
          setActivityToEdit(null);
        }}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        stats={stats}
        onUpdateStats={(newStats) => setStats((prev) => ({ ...prev, ...newStats }))}
        onResetData={handleResetData}
        totalActivitiesCount={activities.length}
      />
    </PhoneShell>
  );
}
