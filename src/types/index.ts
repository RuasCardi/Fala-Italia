export type LevelId = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  name: string;
  email: string;
  currentLevel: LevelId;
  totalXP: number;
  streak: number;
  completedLessons: string[];
}

export interface Exercise {
  id: string;
  type: 'translation' | 'multiple_choice';
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  xpReward: number;
}