export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'inbox' | 'planned' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: Priority;
  category: string;
  dueDate?: string; // ISO date
  completed: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date (yyyy-mm-dd)
  time?: string;
  type: 'event' | 'reminder' | 'plan';
  color?: string;
  notes?: string;
}

export type TxType = 'income' | 'expense';
export type TxCategory =
  | 'Food' | 'Transport' | 'Education' | 'Shopping' | 'Bills' | 'Entertainment' | 'Salary' | 'Other';

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: TxCategory;
  date: string;
  description: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  updatedAt: string;
}

export type LanguageCode = 'ta' | 'ml' | 'hi' | 'en' | 'ja' | 'de';

export interface VocabWord {
  id: string;
  lang: LanguageCode;
  word: string;
  romanized?: string;
  meaning: string;
  learned: boolean;
}

export interface HealthLog {
  sleepHours: number;
  waterMl: number;
  waterGoalMl: number;
  steps: number;
  stepsGoal: number;
  exerciseMin: number;
  weightKg: number;
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'long-term' | 'monthly' | 'weekly';
  progress: number; // 0-100
  milestones: Milestone[];
  dueDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  weekly: boolean[]; // 7 days, Mon-Sun
  completedToday: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: { label: string; type: string };
  timestamp: string;
}

export interface NskNotification {
  id: string;
  title: string;
  body: string;
  type: 'task' | 'calendar' | 'habit' | 'finance' | 'sp';
  read: boolean;
  timestamp: string;
}

export type ThemeMode = 'dark' | 'light' | 'system';

export type PageKey =
  | 'dashboard' | 'tasks' | 'calendar' | 'finance' | 'notes'
  | 'learning' | 'health' | 'goals' | 'habits' | 'sp' | 'settings';
