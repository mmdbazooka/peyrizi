import { localDate } from './locale';
import type { Course, LearningState } from './types';
export function getWeekData(state: LearningState, week = 0) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(localDate() + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() - 6 + i - week * 7);
    const id = d.toISOString().slice(0, 10);
    return {
      day: new Intl.DateTimeFormat('fa-IR', { weekday: 'short', timeZone: 'Asia/Tehran' }).format(
        d,
      ),
      minutes: state.activity[id] || 0,
      date: id,
    };
  });
}
export function getStreak(state: LearningState) {
  let streak = 0;
  const d = new Date(localDate() + 'T12:00:00Z');
  if (!state.activity[localDate()]) d.setUTCDate(d.getUTCDate() - 1);
  for (let i = 0; i < 366; i++) {
    const id = d.toISOString().slice(0, 10);
    if (!state.activity[id]) break;
    streak++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

export function getCourseProgress(course: Course, completed: readonly string[]) {
  if (!course.lessons.length) return 0;
  return (
    (course.lessons.filter(({ id }) => completed.includes(id)).length / course.lessons.length) * 100
  );
}

export function getCourseStatus(progress: number) {
  if (progress >= 100) return 'completed';
  return progress > 0 ? 'in-progress' : 'new';
}
