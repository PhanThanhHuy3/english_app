export type Role = 'learner' | 'manager';
export type CourseLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface User {
  id?: string;
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  fullName?: string;
  role: Role;
  courseLevel?: CourseLevel; // For learners only
  isActive?: boolean;
  streak?: number;
  xp?: number;
  createdAt?: string;
}

export interface Flashcard {
  _id?: string;
  id?: string;
  term: string;
  definition: string;
  example?: string;
  isMastered?: boolean;
  createdAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Progress {
  userId: string;
  completedLessons: number;
  totalLessons: number;
  quizScores: { quizId: string; score: number; maxScore: number }[];
  accuracyRate: number;
}
