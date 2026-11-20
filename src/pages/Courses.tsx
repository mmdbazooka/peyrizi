import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Clock3,
  Layers3,
  Play,
  Route,
  Search,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { Empty, PageHeading, Progress, SectionHeading } from '../components/ui';
import { allLessons, categories, courses } from '../domain/catalog';
import { fa, normalizeSearch } from '../domain/locale';
import { getCourseStatus } from '../domain/metrics';
import type { LearningActions } from '../domain/types';

export function Courses(
  props: Pick<LearningActions, 'state' | 'navigate' | 'bookmark' | 'courseProgress'>,
) {
  const [category, setCategory] = useState('همه دوره‌ها');
  const [term, setTerm] = useState('');
  const [level, setLevel] = useState('همه سطوح');
  const [progress, setProgress] = useState('all');
  const query = normalizeSearch(term);
  const filtered = courses.filter(
    (c) =>
      (category === 'همه دوره‌ها' || c.category === category) &&
      (level === 'همه سطوح' || c.level === level) &&
      normalizeSearch(`${c.title} ${c.subtitle} ${c.description}`).includes(query) &&
      (progress === 'all' || progress === getCourseStatus(props.courseProgress(c))),
  );
  return (
    <>
      <PageHeading
        eyebrow="از دانش تا مهارت"
        title="مسیر یادگیری تو"
        description={`${fa(courses.length)} مسیر مکمل برای یادگیری ساخت‌وساز و مدیریت پروژه.`}
      >
        <span className="heading-badge">
          <Layers3 size={17} />
          {fa(allLessons.length)} درس کاربردی
        </span>
      </PageHeading>
      <div className="learning-banner">
        <span className="soft-icon olive">
          <Route size={24} />
        </span>
        <div>
          <h3>پیشنهاد ما: با «از زمین تا ساختمان» شروع کن.</h3>
          <p>بعد سراغ برآورد هزینه برو و دانشت را با مدیریت پروژه و رهبری تیم کامل کن.</p>
        </div>
        <button className="button primary" onClick={() => props.navigate('courses/construction')}>
          دیدن مسیر پیشنهادی
          <ArrowLeft size={16} />
        </button>
      </div>
      <div className="filter-bar">
        <div className="tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? 'active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-controls">
          <div className="mini-search">
            <Search size={16} />
            <input
              aria-label="جستجوی دوره"
              placeholder="جستجوی مسیر..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="سطح دوره">
            <option>همه سطوح</option>
            <option>مقدماتی</option>
            <option>متوسط</option>
            <option>پیشرفته</option>
          </select>
          <select
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            aria-label="وضعیت پیشرفت"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="new">شروع‌نشده</option>
            <option value="in-progress">در حال یادگیری</option>
            <option value="completed">تکمیل‌شده</option>
          </select>
        </div>
      </div>
      <div className="results-count">{fa(filtered.length)} مسیر برای یاد گرفتن</div>
      <div className="courses-grid all-courses">
        {filtered.map((c) => (
          <CourseCard key={c.id} course={c} {...props} />
        ))}
      </div>
      {!filtered.length && (
        <Empty
          icon={Search}
          title="مسیری با این فیلتر پیدا نشد"
          text="فیلتر یا عبارت جستجو را تغییر بده."
          button="پاک کردن فیلترها"
          action={() => {
            setCategory(categories[0]);
            setLevel('همه سطوح');
            setProgress('all');
            setTerm('');
          }}
        />
      )}
    </>
  );
}
export function CourseDetail(
  props: Pick<LearningActions, 'state' | 'navigate' | 'bookmark' | 'courseProgress'> & {
    id: string;
  },
) {
  const { id, state, navigate, courseProgress, bookmark } = props;
  const c = courses.find((c) => c.id === id);
  if (!c)
    return (
      <Empty title="این دوره پیدا نشد" action={() => navigate('courses')} button="همه دوره‌ها" />
    );
  const next = c.lessons.find((l) => !state.completed.includes(l.id)) || c.lessons[0];
  return (
    <>
      <button className="back-link" onClick={() => navigate('courses')}>
        <ArrowRight size={16} />
        همه مسیرهای یادگیری
      </button>
      <div className="course-detail-hero">
        <div className="course-detail-text">
          <span className="eyebrow">
            {c.category} <span> / </span>
            {c.level}
          </span>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
          <div className="detail-meta">
            <span>
              <BookOpen size={17} />
              {fa(c.lessons.length)} درس
            </span>
            <span>
              <Clock3 size={17} />
              {c.hours}
            </span>
            <span>
              <ClipboardCheck size={17} />
              تمرین‌های کاربردی
            </span>
          </div>
          <div className="detail-actions">
            <button className="button primary" onClick={() => navigate(`lesson/${next.id}`)}>
              <Play size={16} />
              {courseProgress(c) ? 'ادامه یادگیری' : 'شروع این مسیر'}
            </button>
            <button className="button secondary" onClick={() => bookmark(c.id)}>
              <Bookmark size={16} fill={state.bookmarks.includes(c.id) ? 'currentColor' : 'none'} />
              {state.bookmarks.includes(c.id) ? 'ذخیره شده' : 'ذخیره مسیر'}
            </button>
          </div>
        </div>
        <div className={`course-detail-image cover-${c.image}`} />
      </div>
      <div className="detail-layout">
        <section className="panel curriculum">
          <SectionHeading
            title="قدم‌های این مسیر"
            subtitle="درس‌ها را به ترتیب پیشنهادی بخوان یا موضوع موردنیازت را انتخاب کن."
          />
          {c.lessons.map((l, i) => (
            <button
              className={`lesson-row ${state.completed.includes(l.id) ? 'completed' : ''}`}
              key={l.id}
              onClick={() => navigate(`lesson/${l.id}`)}
            >
              <span className="lesson-number">
                {state.completed.includes(l.id) ? <Check size={18} /> : fa(i + 1)}
              </span>
              <div>
                <h3>{l.title}</h3>
                <p>{l.intro}</p>
              </div>
              <span className="lesson-duration">
                <Clock3 size={13} />
                {fa(l.duration)} دقیقه
              </span>
              <ChevronLeft size={18} />
            </button>
          ))}
        </section>
        <aside>
          <div className="panel course-overview">
            <span className="soft-icon olive">
              <Target size={23} />
            </span>
            <h3>این مسیر را به مهارت تبدیل کن</h3>
            <p>بخوان، مثال را بررسی کن و تمرین پایانی را با تجربه کارگاه خودت تطبیق بده.</p>
            <div className="progress-label">
              <span>پیشرفت تو در این مسیر</span>
              <strong>{fa(courseProgress(c))}٪</strong>
            </div>
            <Progress value={courseProgress(c)} />
            <ul className="check-list">
              <li>
                <CheckCircle2 size={16} />
                درس‌های کوتاه و متمرکز
              </li>
              <li>
                <CheckCircle2 size={16} />
                مثال‌های واقعی و عددی
              </li>
              <li>
                <CheckCircle2 size={16} />
                تمرین و یادداشت شخصی
              </li>
            </ul>
            <button className="button subtle full-width" onClick={() => navigate('practice')}>
              تمرین دانسته‌ها
              <ArrowLeft size={16} />
            </button>
          </div>
          <div className="technical-note">
            <ShieldCheck size={20} />
            <p>
              آموزش‌های فنی برای شناخت و مدیریت پروژه‌اند. طراحی و تصمیم‌های اجرایی حساس را با متخصص
              دارای صلاحیت و مقررات محلی تطبیق بده.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
