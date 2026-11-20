import { ArrowLeft, Bookmark, BookOpen, Clock3 } from 'lucide-react';
import type { Navigate } from '../app/useRoute';
import { Icon, Progress } from '../components/ui';
import { fa } from '../domain/locale';
import type { Course, LearningState } from '../domain/types';

export function CourseCard({
  course,
  state,
  navigate,
  bookmark,
  courseProgress,
}: {
  course: Course;
  state: LearningState;
  navigate: Navigate;
  bookmark: (id: string) => void;
  courseProgress: (course: Course) => number;
}) {
  const count = course.lessons.filter((l) => state.completed.includes(l.id)).length;
  const p = courseProgress(course);
  return (
    <article className="course-card">
      <div
        className={`course-cover cover-${course.image}`}
        onClick={() => navigate(`courses/${course.id}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`courses/${course.id}`)}
      >
        <span className="cover-category">
          <Icon name={course.icon} size={13} />
          {course.category}
        </span>
        <button
          className={`cover-bookmark ${state.bookmarks.includes(course.id) ? 'is-saved' : ''}`}
          aria-label={`ذخیره دوره ${course.title}`}
          onClick={(e) => {
            e.stopPropagation();
            bookmark(course.id);
          }}
        >
          <Bookmark
            size={17}
            fill={state.bookmarks.includes(course.id) ? 'currentColor' : 'none'}
          />
        </button>
        <span className="cover-level">
          <span />
          {course.level}
        </span>
      </div>
      <div className="course-body">
        <div className="course-meta">
          <span>
            <BookOpen size={13} />
            {fa(course.lessons.length)} درس کاربردی
          </span>
          <span>
            <Clock3 size={13} />
            {course.hours}
          </span>
        </div>
        <h3>
          <a href={`#courses/${course.id}`}>{course.title}</a>
        </h3>
        <p>{course.subtitle}</p>
        <div className="course-progress-label">
          <span>
            {count
              ? `${fa(count)} از ${fa(course.lessons.length)} درس تکمیل شده`
              : 'اولین قدمت را بردار'}
          </span>
          <strong>{fa(p)}٪</strong>
        </div>
        <Progress value={p} color={course.color} />
        <button
          className="course-action"
          onClick={() =>
            navigate(
              `lesson/${course.lessons.find((l) => !state.completed.includes(l.id))?.id || course.lessons[0].id}`,
            )
          }
        >
          {count ? 'ادامه یادگیری' : 'شروع یادگیری'}
          <ArrowLeft size={16} />
        </button>
      </div>
    </article>
  );
}
