import {
  ArrowLeft,
  ArrowUpLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Clock3,
  Flame,
  HardHat,
  Lightbulb,
  Play,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CourseCard } from '../components/CourseCard';
import { ChartTooltip, PageHeading, Progress, SectionHeading, StatCard } from '../components/ui';
import { allLessons, courses } from '../domain/catalog';
import { fa } from '../domain/locale';
import { getStreak, getWeekData } from '../domain/metrics';
import type { LearningActions } from '../domain/types';

export function Dashboard(
  props: Pick<LearningActions, 'state' | 'navigate' | 'bookmark' | 'courseProgress'>,
) {
  const { state, navigate } = props;
  const totalMinutes = Object.values(state.activity).reduce((a, b) => a + b, 0);
  const last = allLessons.find((l) => l.id === state.lastLesson);
  const currentCourse = courses.find((c) => c.id === last?.courseId) || courses[0];
  const next =
    currentCourse.lessons.find((l) => !state.completed.includes(l.id)) || currentCourse.lessons[0];
  const [week, setWeek] = useState(0);
  const weekly = getWeekData(state, week);
  const weeklyCompleted = state.completed.filter((id) =>
    getWeekData(state).some((day) => day.date === state.completionDates?.[id]),
  ).length;
  return (
    <>
      <PageHeading
        title={
          <>
            سلام {state.name}، خوش اومدی <span className="greeting-leaf">✦</span>
          </>
        }
        description="هر چیزی که برای بهتر ساختن و هوشمندانه‌تر مدیریت کردن نیاز داری، اینجاست."
      >
        <div className="learning-streak">
          <span className="streak-fire">
            <Flame size={21} />
          </span>
          <div>
            <strong>{fa(getStreak(state))} روز</strong>
            <span>یادگیری پیوسته</span>
          </div>
        </div>
      </PageHeading>
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-blueprint" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span /> مسیر حرفه‌ای تو، از همین‌جا شروع می‌شود
          </div>
          <h2>
            فقط ساختمان نساز؛
            <br />
            <span>آینده‌ات را پی‌ریزی کن.</span>
          </h2>
          <p>
            دانش ساختمان‌سازی و مدیریت بازرگانی را به هم وصل کن؛
            <br className="desktop-break" /> یاد بگیر، تمرین کن و در پروژه‌های واقعی به کار ببر.
          </p>
          <div className="hero-actions">
            <button className="button hero-button" onClick={() => navigate(`lesson/${next.id}`)}>
              {state.completed.length ? 'ادامه مسیر یادگیری' : 'شروع مسیر یادگیری'}
              <ArrowLeft size={17} />
            </button>
            <span className="hero-caption">
              <span className="tiny-avatars">
                <i>
                  <HardHat size={12} />
                </i>
                <i>
                  <Building2 size={12} />
                </i>
                <i>
                  <BriefcaseBusiness size={12} />
                </i>
              </span>{' '}
              از دانش تا مهارت، قدم‌به‌قدم
            </span>
          </div>
        </div>
        <div className="hero-image-label">
          <span className="live-dot" /> ساختن، از یاد گرفتن شروع می‌شود <ArrowUpLeft size={15} />
        </div>
        <div className="hero-pagination">
          <i />
          <i />
          <i />
        </div>
      </section>
      <div className="stats-grid">
        <StatCard
          icon={BookOpen}
          label="درس‌های تکمیل‌شده"
          value={fa(state.completed.length)}
          unit={`از ${fa(allLessons.length)} درس`}
          detail="هر درس، یک قدم رو به جلو"
        />
        <StatCard
          icon={Clock3}
          label="زمان یادگیری"
          value={fa(totalMinutes)}
          unit="دقیقه"
          detail="سرمایه‌گذاری روی خودت"
          color="navy"
        />
        <StatCard
          icon={Target}
          label="میانگین آزمون‌ها"
          value={
            state.attempts.length
              ? fa(state.attempts.reduce((a, b) => a + b.score, 0) / state.attempts.length)
              : '—'
          }
          unit={state.attempts.length ? 'درصد' : 'هنوز شروع نشده'}
          detail={
            state.attempts.length
              ? `${fa(state.attempts.length)} پاسخ ثبت‌شده`
              : 'دانشت را به چالش بکش'
          }
          color="sand"
        />
        <StatCard
          icon={Award}
          label="پیشرفت کل مسیر"
          value={fa((state.completed.length / allLessons.length) * 100)}
          unit="درصد"
          detail="قدم‌های کوچک، نتیجه‌های بزرگ"
          color="purple"
        />
      </div>
      {state.completed.length > 0 && (
        <section className="continue-strip">
          <span className="soft-icon olive">
            <Play size={19} />
          </span>
          <div>
            <small>از همین‌جا ادامه بده</small>
            <h3>{next.title}</h3>
          </div>
          <span className="continue-course">{currentCourse.title}</span>
          <button className="button subtle" onClick={() => navigate(`lesson/${next.id}`)}>
            ادامه درس
            <ArrowLeft size={15} />
          </button>
        </section>
      )}
      <SectionHeading
        title="مسیرهای یادگیری پیشنهادی"
        subtitle="از پایه شروع کن، مهارت بساز و با اطمینان جلو برو."
      >
        <button className="text-link" onClick={() => navigate('courses')}>
          مشاهده همه مسیرها <ArrowLeft size={16} />
        </button>
      </SectionHeading>
      <div className="courses-grid home-courses">
        {courses.slice(0, 3).map((c) => (
          <CourseCard key={c.id} course={c} {...props} />
        ))}
      </div>
      <div className="dashboard-bottom">
        <section className="panel activity-panel">
          <SectionHeading title="یک نگاه به یادگیری تو" subtitle="پیشرفت‌های کوچک را هم ببین.">
            <select
              aria-label="بازه فعالیت"
              className="small-select"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              <option value={0}>۷ روز اخیر</option>
              <option value={1}>هفته قبل</option>
            </select>
          </SectionHeading>
          <div className="activity-chart-header">
            <strong>
              {fa(weekly.reduce((a, b) => a + b.minutes, 0))}
              <small>دقیقه یادگیری</small>
            </strong>
            <span className="chart-legend">
              <i /> زمان مطالعه و تمرین
            </span>
          </div>
          <div className="chart activity-chart" dir="ltr">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weekly} margin={{ top: 15, right: 12, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#899773" stopOpacity={0.26} />
                    <stop offset="100%" stopColor="#899773" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 5" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'auto']}
                  tickFormatter={(v) => fa(v)}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                />
                <Tooltip content={<ChartTooltip unit="دقیقه" />} />
                <Area
                  dataKey="minutes"
                  stroke="#7f8c67"
                  strokeWidth={2.5}
                  fill="url(#studyGradient)"
                  dot={{ r: 3, strokeWidth: 2, fill: 'var(--panel)' }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel weekly-panel">
          <div className="weekly-top">
            <span className="soft-icon olive">
              <Target size={22} />
            </span>
            <span className="tiny-tag">آهسته و پیوسته</span>
          </div>
          <h3>یک هفته، چند قدم جلوتر</h3>
          <p>
            هدفت را به قدم‌های کوچک تبدیل کن؛
            <br />
            حتی یک درس کوتاه هم یک پیشرفت است.
          </p>
          <div className="weekly-numbers">
            <span>هدف هفتگی تو</span>
            <strong>
              {fa(Math.min(weeklyCompleted, state.goal))} <small>از {fa(state.goal)} درس</small>
            </strong>
          </div>
          <Progress value={Math.min(100, (weeklyCompleted / state.goal) * 100)} />
          <button className="text-link" onClick={() => navigate('settings')}>
            تنظیم هدف یادگیری <ArrowLeft size={15} />
          </button>
        </section>
        <section className="practice-promo">
          <div className="practice-promo-icon">
            <ClipboardCheck size={34} strokeWidth={1.4} />
            <span>؟</span>
          </div>
          <span className="eyebrow">یادگیری با انجام دادن</span>
          <h3>
            چقدر آماده‌ای؟
            <br /> بیا امتحان کنیم.
          </h3>
          <p>
            سؤال‌های تصویری، محاسباتی و<br />
            موقعیت‌های واقعی کارگاه.
          </p>
          <button className="button primary" onClick={() => navigate('practice')}>
            رفتن به تمرین‌ها <ArrowLeft size={16} />
          </button>
        </section>
      </div>
      <div className="daily-tip">
        <span>
          <Lightbulb size={20} />
          <strong>ایده امروز</strong>
        </span>
        <p>یک مدیر خوب، فقط هزینه‌ها را کم نمی‌کند؛ جلوی دوباره‌کاری‌ها را می‌گیرد.</p>
        <span className="tip-category">#مدیریت_هوشمند</span>
      </div>
    </>
  );
}
