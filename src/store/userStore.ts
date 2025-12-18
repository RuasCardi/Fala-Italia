import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LevelId } from '../types';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

interface UserState {
  user: User | null;
  achievements: Achievement[];
  lastStudyDate: string | null;
  
  // Ações
  initUser: (name: string, email: string) => void;
  completeLesson: (lessonId: string, xpEarned: number, perfectScore: boolean) => void;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  resetProgress: () => void;
  updateLevel: (newLevel: LevelId) => void;
}

// Sistema de conquistas
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', name: 'Primeiro Passo', description: 'Complete sua primeira lição', icon: '🎯' },
  { id: 'streak_3', name: 'Consistência', description: 'Mantenha 3 dias de sequência', icon: '🔥' },
  { id: 'streak_7', name: 'Semana Perfeita', description: 'Mantenha 7 dias de sequência', icon: '⭐' },
  { id: 'streak_30', name: 'Mestre da Disciplina', description: 'Mantenha 30 dias de sequência', icon: '👑' },
  { id: 'perfect_5', name: 'Perfeccionista', description: 'Complete 5 lições com pontuação perfeita', icon: '💎' },
  { id: 'xp_1000', name: 'Explorador', description: 'Ganhe 1000 XP', icon: '🏆' },
  { id: 'xp_5000', name: 'Dedicado', description: 'Ganhe 5000 XP', icon: '🌟' },
  { id: 'level_a2', name: 'Básico Completo', description: 'Alcance o nível A2', icon: '📚' },
  { id: 'level_b1', name: 'Intermediário', description: 'Alcance o nível B1', icon: '🎓' },
  { id: 'all_a1', name: 'Mestre A1', description: 'Complete todas as lições A1', icon: '✨' },
];

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      achievements: ACHIEVEMENTS,
      lastStudyDate: null,

      initUser: (name: string, email: string) => {
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          currentLevel: 'A1',
          totalXP: 0,
          streak: 0,
          completedLessons: [],
        };
        set({ user: newUser, lastStudyDate: new Date().toISOString().split('T')[0] });
      },

      completeLesson: (lessonId: string, xpEarned: number) => {
        const state = get();
        if (!state.user) return;

        const newXP = state.user.totalXP + xpEarned;
        const newCompletedLessons = [...state.user.completedLessons];
        
        if (!newCompletedLessons.includes(lessonId)) {
          newCompletedLessons.push(lessonId);
        }

        set({
          user: {
            ...state.user,
            totalXP: newXP,
            completedLessons: newCompletedLessons,
          },
        });

        // Verificar conquistas
        if (newCompletedLessons.length === 1) {
          get().unlockAchievement('first_lesson');
        }
        if (newXP >= 1000 && state.user.totalXP < 1000) {
          get().unlockAchievement('xp_1000');
        }
        if (newXP >= 5000 && state.user.totalXP < 5000) {
          get().unlockAchievement('xp_5000');
        }
        
        // Atualizar sequência
        get().updateStreak();
      },

      updateStreak: () => {
        const state = get();
        if (!state.user) return;

        const today = new Date().toISOString().split('T')[0];
        const lastDate = state.lastStudyDate;

        if (lastDate === today) {
          return; // Já estudou hoje
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.user.streak;
        
        if (lastDate === yesterdayStr) {
          // Mantém a sequência
          newStreak += 1;
        } else if (lastDate !== today) {
          // Quebrou a sequência
          newStreak = 1;
        }

        set({
          user: { ...state.user, streak: newStreak },
          lastStudyDate: today,
        });

        // Verificar conquistas de sequência
        if (newStreak >= 3 && state.user.streak < 3) {
          get().unlockAchievement('streak_3');
        }
        if (newStreak >= 7 && state.user.streak < 7) {
          get().unlockAchievement('streak_7');
        }
        if (newStreak >= 30 && state.user.streak < 30) {
          get().unlockAchievement('streak_30');
        }
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();
        const achievements = state.achievements.map(ach =>
          ach.id === achievementId && !ach.unlockedAt
            ? { ...ach, unlockedAt: new Date() }
            : ach
        );
        set({ achievements });
      },

      updateLevel: (newLevel: LevelId) => {
        const state = get();
        if (!state.user) return;

        set({
          user: { ...state.user, currentLevel: newLevel },
        });

        // Conquistas de nível
        if (newLevel === 'A2') {
          get().unlockAchievement('level_a2');
        }
        if (newLevel === 'B1') {
          get().unlockAchievement('level_b1');
        }
      },

      resetProgress: () => {
        set({
          user: null,
          achievements: ACHIEVEMENTS,
          lastStudyDate: null,
        });
      },
    }),
    {
      name: 'parliamo-user-storage',
      version: 1,
    }
  )
);

export default useUserStore;