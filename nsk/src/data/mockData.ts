import type {
  Task, CalendarEvent, Transaction, Note, VocabWord, HealthLog,
  Goal, Habit, ChatMessage, NskNotification,
} from '../types';

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seedTasks: Task[] = [
  { id: 't1', title: 'Finish AI assignment — Neural Nets', notes: 'Chapter 4 exercises', status: 'in-progress', priority: 'high', category: 'Study', dueDate: todayISO(), completed: false, createdAt: addDays(-2) },
  { id: 't2', title: 'Review NSK dashboard UI', status: 'planned', priority: 'medium', category: 'Project', dueDate: todayISO(), completed: false, createdAt: addDays(-1) },
  { id: 't3', title: 'Grocery run', status: 'inbox', priority: 'low', category: 'Personal', dueDate: addDays(1), completed: false, createdAt: addDays(-1) },
  { id: 't4', title: 'LeetCode — 2 problems', status: 'planned', priority: 'medium', category: 'Study', dueDate: todayISO(), completed: false, createdAt: addDays(-3) },
  { id: 't5', title: 'Pay electricity bill', status: 'completed', priority: 'high', category: 'Finance', dueDate: addDays(-1), completed: true, createdAt: addDays(-5) },
  { id: 't6', title: 'Japanese vocab — 10 words', status: 'in-progress', priority: 'medium', category: 'Learning', dueDate: todayISO(), completed: false, createdAt: addDays(-1) },
  { id: 't7', title: 'Plan weekend trip', status: 'inbox', priority: 'low', category: 'Personal', dueDate: addDays(4), completed: false, createdAt: addDays(-2) },
];

export const seedEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Data Science lecture', date: todayISO(), time: '09:00', type: 'event', color: 'crimson' },
  { id: 'e2', title: 'Submit assignment', date: todayISO(), time: '23:59', type: 'reminder', color: 'amber' },
  { id: 'e3', title: 'Gym — leg day', date: addDays(1), time: '18:00', type: 'plan', color: 'emerald' },
  { id: 'e4', title: 'Japanese class', date: addDays(2), time: '19:00', type: 'event', color: 'sky' },
  { id: 'e5', title: 'Family call', date: addDays(3), time: '20:00', type: 'plan', color: 'violet' },
  { id: 'e6', title: 'Project review with mentor', date: addDays(5), time: '11:00', type: 'event', color: 'crimson' },
];

export const seedTransactions: Transaction[] = [
  { id: 'x1', type: 'income', amount: 45000, category: 'Salary', date: addDays(-15), description: 'Monthly stipend' },
  { id: 'x2', type: 'expense', amount: 1200, category: 'Food', date: addDays(-1), description: 'Dinner with friends' },
  { id: 'x3', type: 'expense', amount: 450, category: 'Transport', date: addDays(-2), description: 'Auto fare' },
  { id: 'x4', type: 'expense', amount: 2999, category: 'Education', date: addDays(-4), description: 'Course subscription' },
  { id: 'x5', type: 'expense', amount: 899, category: 'Entertainment', date: addDays(-3), description: 'Movie night' },
  { id: 'x6', type: 'expense', amount: 3200, category: 'Shopping', date: addDays(-6), description: 'New headphones' },
  { id: 'x7', type: 'expense', amount: 1800, category: 'Bills', date: addDays(-8), description: 'Internet bill' },
  { id: 'x8', type: 'expense', amount: 600, category: 'Food', date: todayISO(), description: 'Groceries' },
];

export const seedNotes: Note[] = [
  { id: 'n1', title: 'NSK Architecture Ideas', content: 'Flutter clients → FastAPI → PostgreSQL, realtime sync via websockets. Keep auth stateless with JWT rotation.', tags: ['project', 'architecture'], pinned: true, favorite: true, archived: false, updatedAt: addDays(-1) },
  { id: 'n2', title: 'Data Science reading list', content: 'Hands-On ML (Géron), Deep Learning (Goodfellow), StatQuest playlist for stats refreshers.', tags: ['study'], pinned: true, favorite: false, archived: false, updatedAt: addDays(-2) },
  { id: 'n3', title: 'Japanese grammar notes', content: 'て-form connects actions. だ／です for plain vs polite. Practice particle は vs が.', tags: ['japanese', 'learning'], pinned: false, favorite: true, archived: false, updatedAt: addDays(-3) },
  { id: 'n4', title: 'Gift ideas for Amma', content: 'Silk saree, or a nice watch. Ask Akka for opinion.', tags: ['personal'], pinned: false, favorite: false, archived: false, updatedAt: addDays(-6) },
];

export const seedVocab: VocabWord[] = [
  { id: 'v1', lang: 'ja', word: 'こんにちは', romanized: 'Konnichiwa', meaning: 'Hello', learned: true },
  { id: 'v2', lang: 'ja', word: 'ありがとう', romanized: 'Arigatou', meaning: 'Thank you', learned: true },
  { id: 'v3', lang: 'ja', word: '頑張って', romanized: 'Ganbatte', meaning: 'Do your best', learned: false },
  { id: 'v4', lang: 'ja', word: '勉強', romanized: 'Benkyou', meaning: 'Study', learned: false },
  { id: 'v5', lang: 'ta', word: 'வணக்கம்', romanized: 'Vanakkam', meaning: 'Hello', learned: true },
  { id: 'v6', lang: 'ta', word: 'நன்றி', romanized: 'Nandri', meaning: 'Thank you', learned: true },
  { id: 'v7', lang: 'hi', word: 'नमस्ते', romanized: 'Namaste', meaning: 'Hello', learned: true },
  { id: 'v8', lang: 'hi', word: 'धन्यवाद', romanized: 'Dhanyavaad', meaning: 'Thank you', learned: false },
  { id: 'v9', lang: 'de', word: 'Guten Morgen', meaning: 'Good morning', learned: false },
  { id: 'v10', lang: 'de', word: 'Danke schön', meaning: 'Thank you very much', learned: false },
  { id: 'v11', lang: 'ml', word: 'നമസ്കാരം', romanized: 'Namaskaram', meaning: 'Hello', learned: false },
  { id: 'v12', lang: 'en', word: 'Ephemeral', meaning: 'Lasting for a short time', learned: true },
];

export const seedHealth: HealthLog = {
  sleepHours: 6.5,
  waterMl: 1800,
  waterGoalMl: 3000,
  steps: 6240,
  stepsGoal: 10000,
  exerciseMin: 25,
  weightKg: 68.4,
  mood: 'good',
};

export const seedGoals: Goal[] = [
  {
    id: 'g1', title: 'Become a better Data Scientist', category: 'long-term', progress: 42, dueDate: addDays(180),
    milestones: [
      { id: 'm1', title: 'Complete ML specialization', done: true },
      { id: 'm2', title: 'Build 3 portfolio projects', done: false },
      { id: 'm3', title: 'Contribute to open-source ML repo', done: false },
      { id: 'm4', title: 'Publish 1 technical blog post', done: true },
    ],
  },
  {
    id: 'g2', title: 'Reach conversational Japanese (N4)', category: 'long-term', progress: 28,
    milestones: [
      { id: 'm5', title: 'Learn all Hiragana & Katakana', done: true },
      { id: 'm6', title: 'Finish Genki I textbook', done: false },
      { id: 'm7', title: '500 vocabulary words', done: false },
    ],
  },
  {
    id: 'g3', title: 'Ship NSK v1.0 demo', category: 'monthly', progress: 70,
    milestones: [
      { id: 'm8', title: 'Design system + layout', done: true },
      { id: 'm9', title: 'All core modules functional', done: true },
      { id: 'm10', title: 'Polish + responsive QA', done: false },
    ],
  },
  {
    id: 'g4', title: '3 workouts this week', category: 'weekly', progress: 66,
    milestones: [
      { id: 'm11', title: 'Monday session', done: true },
      { id: 'm12', title: 'Wednesday session', done: true },
      { id: 'm13', title: 'Friday session', done: false },
    ],
  },
];

export const seedHabits: Habit[] = [
  { id: 'h1', name: 'Japanese practice', icon: 'Languages', streak: 12, weekly: [true, true, true, true, true, false, false], completedToday: false },
  { id: 'h2', name: 'LeetCode', icon: 'Code2', streak: 8, weekly: [true, true, false, true, true, false, false], completedToday: true },
  { id: 'h3', name: 'Reading', icon: 'BookOpen', streak: 21, weekly: [true, true, true, true, true, true, false], completedToday: false },
  { id: 'h4', name: 'Exercise', icon: 'Dumbbell', streak: 4, weekly: [false, true, false, true, false, false, false], completedToday: false },
];

export const seedChat: ChatMessage[] = [
  { id: 'c1', role: 'assistant', content: "Good evening, Sharukash 👋 I've reviewed your day — 3 tasks are still open and you're ₹600 under your food budget so far. Want a quick focus plan for tonight?", timestamp: new Date().toISOString() },
];

export const seedNotifications: NskNotification[] = [
  { id: 'nt1', title: 'Task due today', body: '"Finish AI assignment" is due today.', type: 'task', read: false, timestamp: new Date().toISOString() },
  { id: 'nt2', title: 'Calendar reminder', body: 'Data Science lecture at 09:00.', type: 'calendar', read: false, timestamp: addDays(0) },
  { id: 'nt3', title: 'Habit streak at risk', body: 'Exercise habit — complete today to keep your streak.', type: 'habit', read: true, timestamp: addDays(-1) },
  { id: 'nt4', title: 'Budget update', body: 'You have spent 61% of your monthly budget.', type: 'finance', read: true, timestamp: addDays(-1) },
  { id: 'nt5', title: 'SP suggestion', body: 'SP recommends tackling your high-priority task first.', type: 'sp', read: false, timestamp: addDays(0) },
];
