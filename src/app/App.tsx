import { CheckCircle2, ChevronLeft, Info, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Empty } from '../components/ui';
import { localDate } from '../domain/locale';
import { getCourseProgress } from '../domain/metrics';
import { loadState, STORAGE_KEY } from '../domain/storage';
import type {
  Course,
  LearningState,
  LessonContent,
  NewAttempt,
  UpdateState,
} from '../domain/types';
import { Analytics } from '../pages/Analytics';
import { CourseDetail, Courses } from '../pages/Courses';
import { Dashboard } from '../pages/Dashboard';
import { Lesson } from '../pages/Lesson';
import { Library } from '../pages/Library';
import { Practice } from '../pages/Practice';
import { SettingsPage } from '../pages/Settings';
import { Workshop } from '../pages/Workshop';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { navItems } from './navigation';
import { useRoute } from './useRoute';

export function App() {
  const [state, setState] = useState(loadState);
  const [route, navigate] = useRoute();
  const [toast, setToast] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = useCallback(() => setMobileOpen(false), []);
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(closeMenu, [route, closeMenu]);
  const update: UpdateState = (patch) =>
    setState((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  const addActivity = (s: LearningState, minutes: number) => ({
    ...s.activity,
    [localDate()]: (s.activity[localDate()] || 0) + minutes,
  });
  const complete = (lesson: LessonContent) => {
    setState((s) => {
      if (s.completed.includes(lesson.id)) return s;
      return {
        ...s,
        completed: [...s.completed, lesson.id],
        completionDates: { ...s.completionDates, [lesson.id]: localDate() },
        lastLesson: lesson.id,
        activity: addActivity(s, lesson.duration),
      };
    });
    setToast('درس به پایان رسید. یک قدم به هدفت نزدیک‌تر شدی!');
  };
  const bookmark = (id: string) => {
    const has = state.bookmarks.includes(id);
    update((s) => ({
      bookmarks: has ? s.bookmarks.filter((i) => i !== id) : [...s.bookmarks, id],
    }));
    setToast(has ? 'از ذخیره‌ها برداشته شد' : 'برای مرور بعدی ذخیره شد');
  };
  const recordAttempt = (attempt: NewAttempt) =>
    update((s) => ({
      attempts: [...s.attempts, { ...attempt, date: new Date().toISOString() }],
      activity: addActivity(s, 2),
    }));
  const path = route.split('/');
  const active = path[0] === 'lesson' ? 'courses' : path[0];
  const activeLabel =
    navItems.find((n) => n.id === active)?.label ||
    (
      { notes: 'یادداشت‌های من', saved: 'ذخیره‌شده‌ها', settings: 'تنظیمات' } as Record<
        string,
        string
      >
    )[active] ||
    'مسیر یادگیری';
  const courseProgress = (course: Course) => getCourseProgress(course, state.completed);
  const common = {
    state,
    update,
    navigate,
    bookmark,
    complete,
    courseProgress,
    recordAttempt,
    notify: setToast,
  };
  return (
    <div className="app-shell" dir="rtl">
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          aria-label="بستن منو"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar {...{ active, mobileOpen, state, navigate, update }} />
      <div className="main-shell">
        <Topbar
          {...{ route, state, navigate }}
          openMenu={() => setMobileOpen(true)}
          closeMenu={closeMenu}
        />
        <main className="content" id="main-content">
          <div className="breadcrumb">
            <span>فضای یادگیری</span>
            <ChevronLeft size={12} />
            <span>{activeLabel}</span>
            {path.length > 1 && (
              <>
                <ChevronLeft size={12} />
                <span>{path[0] === 'lesson' ? 'مطالعه درس' : 'جزئیات دوره'}</span>
              </>
            )}
          </div>
          {storageError && (
            <div className="storage-warning">
              <Info size={18} />
              فضای ذخیره مرورگر در دسترس نیست. برای حفظ اطلاعات، از تنظیمات خروجی بگیر.
            </div>
          )}
          {path[0] === 'dashboard' && <Dashboard {...common} />}
          {path[0] === 'courses' && !path[1] && <Courses {...common} />}
          {path[0] === 'courses' && path[1] && <CourseDetail {...common} id={path[1]} />}
          {path[0] === 'lesson' && <Lesson {...common} id={path[1]} />}
          {path[0] === 'practice' && <Practice {...common} />}
          {path[0] === 'workshop' && <Workshop />}
          {path[0] === 'analytics' && <Analytics {...common} />}
          {(path[0] === 'notes' || path[0] === 'saved') && <Library {...common} type={path[0]} />}
          {path[0] === 'settings' && <SettingsPage {...common} setState={setState} />}
          {![
            'dashboard',
            'courses',
            'lesson',
            'practice',
            'workshop',
            'analytics',
            'notes',
            'saved',
            'settings',
          ].includes(path[0]) && (
            <Empty
              icon={Search}
              title="این صفحه پیدا نشد"
              text="از مسیر یادگیری، دوباره شروع کن."
              action={() => navigate('dashboard')}
              button="بازگشت به پیشخوان"
            />
          )}
          <footer className="footer">
            <span>
              <span className="mini-brand">پی‌ریزی.</span> جایی برای یاد گرفتن، بهتر ساختن و رشد
              کردن.
            </span>
            <span>
              با قدم‌های کوچک، بناهای بزرگ بساز <span className="footer-spark">✦</span>
            </span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={20} />
          {toast}
          <button aria-label="بستن پیام" onClick={() => setToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
