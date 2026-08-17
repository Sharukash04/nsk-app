import { useLocalStorage } from './useLocalStorage';
import {
  seedTasks, seedEvents, seedTransactions, seedNotes, seedVocab,
  seedHealth, seedGoals, seedHabits, seedChat, seedNotifications,
} from '../data/mockData';
import type {
  Task, CalendarEvent, Transaction, Note, VocabWord, HealthLog,
  Goal, Habit, ChatMessage, NskNotification, ThemeMode,
} from '../types';

export function useNskStore() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('nsk.tasks', seedTasks);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('nsk.events', seedEvents);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('nsk.transactions', seedTransactions);
  const [notes, setNotes] = useLocalStorage<Note[]>('nsk.notes', seedNotes);
  const [vocab, setVocab] = useLocalStorage<VocabWord[]>('nsk.vocab', seedVocab);
  const [health, setHealth] = useLocalStorage<HealthLog>('nsk.health', seedHealth);
  const [goals, setGoals] = useLocalStorage<Goal[]>('nsk.goals', seedGoals);
  const [habits, setHabits] = useLocalStorage<Habit[]>('nsk.habits', seedHabits);
  const [chat, setChat] = useLocalStorage<ChatMessage[]>('nsk.chat', seedChat);
  const [notifications, setNotifications] = useLocalStorage<NskNotification[]>('nsk.notifications', seedNotifications);
  const [theme, setTheme] = useLocalStorage<ThemeMode>('nsk.theme', 'dark');
  const [unlocked, setUnlocked] = useLocalStorage<boolean>('nsk.unlocked', false);
  const [pin, setPin] = useLocalStorage<string>('nsk.pin', '1234');
  const [autoLockMin, setAutoLockMin] = useLocalStorage<number>('nsk.autolock', 5);
  const [biometric, setBiometric] = useLocalStorage<boolean>('nsk.biometric', true);

  return {
    tasks, setTasks,
    events, setEvents,
    transactions, setTransactions,
    notes, setNotes,
    vocab, setVocab,
    health, setHealth,
    goals, setGoals,
    habits, setHabits,
    chat, setChat,
    notifications, setNotifications,
    theme, setTheme,
    unlocked, setUnlocked,
    pin, setPin,
    autoLockMin, setAutoLockMin,
    biometric, setBiometric,
  };
}

export type NskStore = ReturnType<typeof useNskStore>;
