import { User, Flashcard, QuizQuestion, Progress } from '../types';

export const mockUsers: User[] = [
  {
    id: 'm1',
    email: 'admin@manager.com',
    password: 'admin',
    fullName: 'Admin Manager',
    role: 'manager',
    isActive: true,
  },
  {
    id: 'l1',
    email: 'student@learner.com',
    password: '123',
    fullName: 'Alice Student',
    role: 'learner',
    courseLevel: 'B1',
    isActive: true,
    streak: 5,
  },
  {
    id: 'l2',
    email: 'bob@learner.com',
    password: '123',
    fullName: 'Bob Beginner',
    role: 'learner',
    courseLevel: 'A1',
    isActive: false,
    streak: 0,
  }
];

export const mockFlashcards: Flashcard[] = [
  { id: 'f1', term: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'His ubiquitous influence was felt by all the family.', isMastered: false },
  { id: 'f2', term: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'Fashions are ephemeral.', isMastered: true },
  { id: 'f3', term: 'Resilient', definition: 'Able to withstand or recover quickly from difficult conditions.', example: 'Babies are generally far more resilient than new parents realize.', isMastered: false },
];

export const mockQuiz: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Choose the correct form: She _____ to the store yesterday.',
    options: ['go', 'goes', 'went', 'gone'],
    correctAnswerIndex: 2,
    explanation: '"Yesterday" indicates past tense, so the simple past form "went" is required.'
  },
  {
    id: 'q2',
    question: 'Which sentence is grammatically correct?',
    options: ["He don't like apples.", "He doesn't likes apples.", "He doesn't like apples.", "He don't likes apples."],
    correctAnswerIndex: 2,
    explanation: 'With third-person singular (he/she/it), use "doesn\'t" followed by the base form of the verb ("like").'
  }
];

export const mockProgress: Progress = {
  userId: 'l1',
  completedLessons: 12,
  totalLessons: 40,
  quizScores: [{ quizId: 'quiz1', score: 8, maxScore: 10 }],
  accuracyRate: 85,
};
