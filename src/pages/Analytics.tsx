import {
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronLeft,
  ClipboardCheck,
  Clock3,
  Flame,
  Info,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartTooltip,
  Empty,
  Icon,
  PageHeading,
  Progress,
  SectionHeading,
  StatCard,
} from '../components/ui';
import { categories, courses, questions } from '../domain/catalog';
import { fa, localDate } from '../domain/locale';
import { getStreak } from '../domain/metrics';
import type { LearningActions } from '../domain/types';

export function Analytics({ state, navigate }: Pick<LearningActions, 'state' | 'navigate'>) {
  const [period, setPeriod] = useState('7');
  const days = Number(period);
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(localDate() + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() - days + 1 + i);
    const key = d.toISOString().slice(0, 10);
    return {
      day: new Intl.DateTimeFormat('fa-IR', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Tehran',
      }).format(d),
      minutes: state.activity[key] || 0,
    };
  });
  const total = series.reduce((a, b) => a + b.minutes, 0);
  const attemptedCategories = categories.slice(1).map((c) => {
    const attempts = state.attempts.filter((a) => a.category === c);
    return {
      subject: c,
      score: attempts.length
        ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length)
        : 0,
      count: attempts.length,
    };
  });
  const latest = state.attempts.slice(-6).reverse();
  const weak = [...attemptedCategories]
    .filter((c) => c.count && c.score < 70)
    .sort((a, b) => a.score - b.score)[0];
  const unexplored = attemptedCategories.find((c) => !c.count);
  return (
    <>
      <PageHeading
        eyebrow="رشد تو، به روایت عددها"
        title="آنالیز یادگیری من"
        description="قدم‌هایی که برداشته‌ای را ببین و قدم بعدی را آگاهانه‌تر انتخاب کن."
      >
        <select
          className="small-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="بازه تحلیل"
        >
          <option value="7">۷ روز اخیر</option>
          <option value="30">۳۰ روز اخیر</option>
        </select>
      </PageHeading>
      <div className="stats-grid">
        <StatCard
          icon={Clock3}
          label="زمان یادگیری در این بازه"
          value={fa(total)}
          unit="دقیقه"
          color="olive"
        />
        <StatCard
          icon={CheckCheck}
          label="کل درس‌های تکمیل‌شده"
          value={fa(state.completed.length)}
          unit="درس"
          color="navy"
        />
        <StatCard
          icon={ClipboardCheck}
          label="کل پاسخ‌های ثبت‌شده"
          value={fa(state.attempts.length)}
          unit="پاسخ"
          color="sand"
        />
        <StatCard
          icon={Flame}
          label="تداوم یادگیری"
          value={fa(getStreak(state))}
          unit="روز"
          color="purple"
        />
      </div>
      <div className="analytics-grid">
        <section className="panel analytics-activity">
          <SectionHeading
            title="روند زمان یادگیری"
            subtitle="دقایق ثبت‌شده از مطالعه درس و پاسخ به تمرین‌ها"
          />
          <div className="chart" dir="ltr">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={series} margin={{ top: 20, right: 16, left: -12, bottom: 10 }}>
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84936b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#84936b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 5" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  minTickGap={30}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                />
                <YAxis
                  tickFormatter={(v) => fa(Number(v))}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                />
                <Tooltip content={<ChartTooltip unit="دقیقه" />} />
                <Area
                  dataKey="minutes"
                  stroke="#7d8c64"
                  strokeWidth={3}
                  fill="url(#analyticsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel skill-chart">
          <SectionHeading title="نقشه مهارت‌های تو" subtitle="میانگین پاسخ‌ها در هر حوزه" />
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={attemptedCategories} outerRadius="62%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontFamily: 'Vazirmatn Variable',
                    fontSize: 10,
                    fill: 'var(--text-secondary)',
                  }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke="#7d8c64"
                  fill="#7d8c64"
                  fillOpacity={0.24}
                  strokeWidth={2}
                />
                <Tooltip formatter={(v) => [`${fa(Number(v))}٪`, 'میانگین']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {!state.attempts.length && (
            <span className="chart-empty-caption">با اولین تمرین، نقشه مهارتت شکل می‌گیرد.</span>
          )}
        </section>
        <section className="panel path-analysis">
          <SectionHeading title="پیشرفت در مسیرها" subtitle="میزان تکمیل درس‌های هر دوره" />
          {courses.map((c) => {
            const n = c.lessons.filter((l) => state.completed.includes(l.id)).length;
            return (
              <button
                className="path-analysis-row"
                key={c.id}
                onClick={() => navigate(`courses/${c.id}`)}
              >
                <span className={`soft-icon ${c.color}`}>
                  <Icon name={c.icon} size={18} />
                </span>
                <div>
                  <strong>{c.title}</strong>
                  <Progress value={(n / c.lessons.length) * 100} />
                </div>
                <span>{fa((n / c.lessons.length) * 100)}٪</span>
                <ChevronLeft size={14} />
              </button>
            );
          })}
        </section>
        <section className="panel recent-results">
          <SectionHeading title="آخرین تمرین‌های تو" subtitle="نتیجه‌ها، سرنخ‌های قدم بعدی‌اند." />
          {latest.length ? (
            latest.map((a, i) => (
              <div className="recent-result-row" key={`${a.date}-${i}`}>
                <span className={`result-status ${a.score >= 70 ? 'pass' : 'review'}`}>
                  {a.score >= 70 ? <Check size={17} /> : <RotateCcw size={17} />}
                </span>
                <div>
                  <strong>{questions.find((q) => q.id === a.questionId)?.title || 'تمرین'}</strong>
                  <small>
                    {a.category}
                    {a.selfAssessed ? ' · خودارزیابی' : ''}
                  </small>
                </div>
                <b>{fa(a.score)}٪</b>
              </div>
            ))
          ) : (
            <Empty
              icon={ClipboardCheck}
              title="هنوز تمرینی ثبت نکرده‌ای"
              text="اولین تمرین، نقطه شروع شناخت مهارت‌های توست."
              action={() => navigate('practice')}
              button="شروع تمرین"
            />
          )}
        </section>
      </div>
      <div className="analysis-advice">
        <span className="soft-icon olive">
          <Sparkles size={25} />
        </span>
        <div>
          <h3>
            {weak
              ? `قدم پیشنهادی: مرور ${weak.subject}`
              : state.attempts.length && unexplored
                ? `قدم پیشنهادی: کشف ${unexplored.subject}`
                : state.attempts.length
                  ? 'خوب پیش رفته‌ای؛ وقت یک قدم تازه است'
                  : 'قدم پیشنهادی: از یک درس کوتاه شروع کن'}
          </h3>
          <p>
            {weak
              ? `میانگین فعلی تو در این حوزه ${fa(weak.score)}٪ است. درس مرتبط را مرور کن و دوباره تمرین کن؛ مقایسه با خودت مهم‌تر از هر رتبه‌ای است.`
              : state.attempts.length && unexplored
                ? 'در موضوع‌های تمرین‌شده عملکرد خوبی داشته‌ای. یک حوزه تازه را امتحان کن تا نقشه مهارت‌هایت کامل‌تر شود.'
                : state.attempts.length
                  ? 'در هر سه حوزه میانگین حداقل ۷۰٪ داری. دانسته‌هایت را در یک پروژه واقعی به کار بگیر و مسیرها را ادامه بده.'
                  : 'با تکمیل درس‌ها و انجام تمرین‌ها، پیشنهادها بر اساس عملکرد واقعی تو شکل می‌گیرند.'}
          </p>
        </div>
        <button className="button primary" onClick={() => navigate(weak ? 'practice' : 'courses')}>
          {weak ? 'تمرین بیشتر' : 'دیدن مسیرها'}
          <ArrowLeft size={16} />
        </button>
      </div>
      <p className="analytics-disclaimer">
        <Info size={14} />
        زمان مطالعه برابر زمان آموزشی درس‌های تکمیل‌شده و ۲ دقیقه برای هر پاسخ است؛ زمان‌سنج حضور
        نیست. امتیازهای تشریحی خودارزیابی هستند.
      </p>
    </>
  );
}
