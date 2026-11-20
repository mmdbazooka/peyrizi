import type { Navigate } from '../app/useRoute';
export interface LessonContent {
  id: string;
  title: string;
  intro: string;
  points: string[];
  example: string;
  task: string;
  duration: number;
  diagram: boolean;
}

export type LessonRow = [
  title: string,
  intro: string,
  points: string[],
  example: string,
  task: string,
];

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  icon: string;
  color: string;
  image: number;
  hours: string;
  description: string;
  lessons: LessonContent[];
}

export type DiagramType = 'structure' | 'pipeline';
type QuestionFormat =
  | { type: 'choice'; options: string[]; answer: number }
  | { type: 'visual'; options: string[]; answer: number; diagram: DiagramType }
  | { type: 'numeric'; answer: number; unit: string }
  | { type: 'essay'; rubric: string[] };

export type Question = QuestionFormat & {
  id: string;
  category: string;
  title: string;
  explanation: string;
};

export interface NewAttempt {
  questionId: string;
  category: string;
  type: Question['type'];
  score: number;
  selfAssessed: boolean;
  answer: string | number;
}

export interface LearningState {
  version: 1;
  name: string;
  theme: 'light' | 'dark';
  completed: string[];
  completionDates: Record<string, string>;
  bookmarks: string[];
  notes: Record<string, string>;
  attempts: (NewAttempt & { date: string })[];
  activity: Record<string, number>;
  goal: number;
  lastLesson: string | null;
  joined: string;
  drafts: Record<string, string>;
  reminder: boolean;
}

export type UpdateState = (
  patch: Partial<LearningState> | ((state: LearningState) => Partial<LearningState>),
) => void;

export interface LearningActions {
  state: LearningState;
  navigate: Navigate;
  update: UpdateState;
  bookmark: (id: string) => void;
  complete: (lesson: LessonContent) => void;
  courseProgress: (course: Course) => number;
  recordAttempt: (attempt: NewAttempt) => void;
  notify: (message: string) => void;
}
