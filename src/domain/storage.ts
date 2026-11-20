import { allLessons, courses, questions } from './catalog';
import type { LearningState } from './types';

export const STORAGE_KEY = 'peyrizi-v1';
export const startingState: LearningState = {
  version: 1,
  name: 'همراه',
  theme: 'light',
  completed: [],
  completionDates: {},
  bookmarks: [],
  notes: {},
  attempts: [],
  activity: {},
  goal: 5,
  lastLesson: null,
  joined: new Date().toISOString(),
  drafts: {},
  reminder: true,
};

export function loadState(): LearningState {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return { ...startingState };
    const saved: unknown = JSON.parse(value);
    if (!isRecord(saved)) return { ...startingState };
    return validateBackup({ ...startingState, ...saved, version: saved.version });
  } catch {
    return { ...startingState };
  }
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

const lessons = new Set(allLessons.map(({ id }) => id));
const bookmarkIds = new Set([...lessons, ...courses.map(({ id }) => id)]);
const questionById = new Map(questions.map((question) => [question.id, question]));

function isKnownIdList(value: unknown, ids: ReadonlySet<string>): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === 'string' && ids.has(id));
}

type Attempt = LearningState['attempts'][number];

function parseAttempt(value: unknown): Attempt | null {
  if (!isRecord(value) || typeof value.questionId !== 'string') return null;
  const question = questionById.get(value.questionId);
  if (
    !question ||
    typeof value.score !== 'number' ||
    !Number.isFinite(value.score) ||
    value.score < 0 ||
    value.score > 100 ||
    typeof value.date !== 'string' ||
    !Number.isFinite(Date.parse(value.date))
  )
    return null;
  return {
    questionId: question.id,
    category: question.category,
    type: question.type,
    score: value.score,
    selfAssessed: question.type === 'essay',
    answer:
      typeof value.answer === 'string' || typeof value.answer === 'number' ? value.answer : '',
    date: value.date,
  };
}

export function parseBackup(json: string): LearningState {
  return validateBackup(JSON.parse(json));
}

function validateBackup(data: unknown): LearningState {
  const invalid = () => new Error('این فایل، نسخه پشتیبان معتبر پی‌ریزی نیست.');
  if (
    !isRecord(data) ||
    data.version !== 1 ||
    typeof data.name !== 'string' ||
    (data.theme !== 'light' && data.theme !== 'dark') ||
    !isKnownIdList(data.completed, lessons) ||
    !isKnownIdList(data.bookmarks, bookmarkIds) ||
    !Array.isArray(data.attempts) ||
    !isStringRecord(data.notes) ||
    !isRecord(data.activity) ||
    typeof data.goal !== 'number' ||
    !Number.isInteger(data.goal) ||
    data.goal < 1 ||
    data.goal > 14 ||
    (data.drafts != null && !isStringRecord(data.drafts))
  )
    throw invalid();

  const activity: [string, number][] = [];
  for (const [date, minutes] of Object.entries(data.activity)) {
    if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes < 0) throw invalid();
    activity.push([date, minutes]);
  }

  const attempts = data.attempts.map(parseAttempt);
  if (attempts.some((attempt) => attempt === null)) throw invalid();

  return {
    ...startingState,
    name: data.name,
    theme: data.theme,
    completed: [...new Set(data.completed)],
    bookmarks: [...new Set(data.bookmarks)],
    attempts: attempts.filter((attempt) => attempt !== null),
    notes: data.notes,
    activity: Object.fromEntries(activity),
    goal: data.goal,
    completionDates: isStringRecord(data.completionDates) ? data.completionDates : {},
    drafts: isStringRecord(data.drafts) ? data.drafts : {},
    lastLesson:
      typeof data.lastLesson === 'string' && lessons.has(data.lastLesson) ? data.lastLesson : null,
    joined: typeof data.joined === 'string' ? data.joined : startingState.joined,
    reminder: typeof data.reminder === 'boolean' ? data.reminder : startingState.reminder,
  };
}
