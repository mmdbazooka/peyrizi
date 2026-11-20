import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleDot,
  ClipboardCheck,
  Flag,
  Layers3,
  Lightbulb,
  PencilLine,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { StructureDiagram } from '../components/Diagrams';
import { PageHeading, Progress } from '../components/ui';
import { categories, questions } from '../domain/catalog';
import { fa, numberValue } from '../domain/locale';
import type { LearningActions, NewAttempt, Question } from '../domain/types';

export function Practice(props: Pick<LearningActions, 'state' | 'recordAttempt' | 'navigate'>) {
  const { state, recordAttempt } = props;
  const [category, setCategory] = useState('همه موضوع‌ها');
  const [type, setType] = useState('همه سؤال‌ها');
  const [mode, setMode] = useState('practice');
  const [session, setSession] = useState<{ questions: Question[]; exam: boolean } | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | number>('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [self, setSelf] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<NewAttempt[]>([]);
  const typeNames = { choice: 'تستی', numeric: 'محاسباتی', visual: 'تصویری', essay: 'تشریحی' };
  const bank = questions.filter(
    (q) =>
      (category === 'همه موضوع‌ها' || q.category === category) &&
      (type === 'همه سؤال‌ها' || q.type === type),
  );
  const start = (list: Question[], exam = false) => {
    setSession({ questions: list, exam });
    setIndex(0);
    setAnswer('');
    setSubmitted(false);
    setFinished(false);
    setAnswers([]);
    setSelf([]);
    setScore(0);
  };
  const q = session?.questions[index];
  const answered = typeof answer === 'number' || String(answer).trim().length > 0;
  const getScore = (q: Question) =>
    q.type === 'essay'
      ? Math.round((self.length / 3) * 100)
      : q.type === 'numeric'
        ? Number.isFinite(numberValue(answer)) && Math.abs(numberValue(answer) - q.answer) < 0.001
          ? 100
          : 0
        : Number(answer) === q.answer
          ? 100
          : 0;
  const submit = () => {
    if (!q || !answered) return;
    const value = getScore(q);
    setScore(value);
    setSubmitted(true);
    const a = {
      questionId: q.id,
      category: q.category,
      type: q.type,
      score: value,
      selfAssessed: q.type === 'essay',
      answer,
    };
    setAnswers((prev) => [...prev, a]);
    recordAttempt(a);
  };
  const next = () => {
    if (!session) return;
    if (index >= session.questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setAnswer('');
    setSubmitted(false);
    setSelf([]);
  };
  if (session && finished) {
    const avg = Math.round(answers.reduce((a, b) => a + b.score, 0) / answers.length);
    return (
      <>
        <PageHeading
          title="هر تمرین، یک فرصت برای بهتر شدن"
          description="نتیجه این نوبت یادگیری تو ثبت شد."
        />
        <div className="panel result-panel">
          <span className="result-award">
            <Award size={46} />
          </span>
          <span className="eyebrow">
            {session.exam ? 'آزمون ترکیبی' : 'تمرین آزاد'} به پایان رسید
          </span>
          <h2>
            {avg >= 70 ? 'آفرین، مسیر را خوب پیش رفتی!' : 'این تمرین، نقطه شروع یادگیری بعدی توست.'}
          </h2>
          <div className="result-score">
            {fa(avg)}
            <small>از ۱۰۰</small>
          </div>
          <p>
            {fa(answers.length)} پاسخ ثبت شد. سؤال‌های تشریحی بر اساس خودارزیابی تو امتیاز
            گرفته‌اند.
          </p>
          <div className="result-summary">
            {answers.map((a, i) => (
              <div key={a.questionId}>
                <span>
                  {fa(i + 1)}. {session.questions[i].title}
                </span>
                <strong className={a.score >= 70 ? 'success-text' : 'warning-text'}>
                  {fa(a.score)}٪ {a.selfAssessed ? '(خودارزیابی)' : ''}
                </strong>
              </div>
            ))}
          </div>
          <div className="result-actions">
            <button
              className="button primary"
              onClick={() => {
                setSession(null);
                setFinished(false);
              }}
            >
              تمرین بیشتر
              <RotateCcw size={16} />
            </button>
            <button className="button secondary" onClick={() => props.navigate('analytics')}>
              تحلیل یادگیری من
              <BarChart3 size={16} />
            </button>
          </div>
        </div>
      </>
    );
  }
  if (session && q)
    return (
      <>
        <div className="quiz-top">
          <button
            className="back-link"
            onClick={() => {
              setSession(null);
            }}
          >
            {' '}
            <ArrowRight size={16} />
            بازگشت به بانک تمرین <small>پاسخ‌های ثبت‌شده حفظ می‌شوند</small>
          </button>
          <span>
            {session.exam ? 'آزمون ترکیبی' : 'تمرین آزاد'} · سؤال {fa(index + 1)} از{' '}
            {fa(session.questions.length)}
          </span>
        </div>
        <Progress value={(index / session.questions.length) * 100} />
        <div className="quiz-layout">
          <section className="panel question-panel">
            <div className="question-meta">
              <span className="tag">{q.category}</span>
              <span>
                <span className="type-dot" />
                {typeNames[q.type]}
              </span>
            </div>
            <h1>{q.title}</h1>
            {q.type === 'visual' && <StructureDiagram type={q.diagram} />}
            <div className="answer-area">
              {('options' in q ? q.options : []).map((option, i) => (
                <button
                  disabled={submitted}
                  className={`answer-option ${answer === i ? 'selected' : ''} ${submitted && 'answer' in q && q.answer === i ? 'correct' : ''} ${submitted && answer === i && 'answer' in q && q.answer !== i ? 'incorrect' : ''}`}
                  key={i}
                  onClick={() => setAnswer(i)}
                >
                  <span className="option-letter">{['الف', 'ب', 'ج', 'د'][i]}</span>
                  <span>{option}</span>
                  {submitted && 'answer' in q && q.answer === i ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <span className="option-radio" />
                  )}
                </button>
              ))}
              {q.type === 'numeric' && (
                <div className="numeric-answer">
                  <label htmlFor="numeric-answer">پاسخ محاسبه تو</label>
                  <div>
                    <input
                      id="numeric-answer"
                      autoComplete="off"
                      inputMode="decimal"
                      dir="ltr"
                      placeholder="۰"
                      disabled={submitted}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    <span>{q.unit}</span>
                  </div>
                  <small>عدد فارسی یا انگلیسی وارد کن.</small>
                </div>
              )}
              {q.type === 'essay' && (
                <>
                  <textarea
                    className="essay-answer"
                    aria-label="پاسخ تشریحی"
                    placeholder="راهکار و دلیل تصمیم خودت را بنویس..."
                    disabled={submitted}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <div className="self-assessment">
                    <strong>چک‌لیست خودارزیابی</strong>
                    <p>پس از نوشتن، مشخص کن پاسخت کدام بخش‌ها را پوشش می‌دهد:</p>
                    {q.rubric.map((r, i) => (
                      <label key={r}>
                        <input
                          type="checkbox"
                          disabled={submitted}
                          checked={self.includes(i)}
                          onChange={() =>
                            setSelf((s) => (s.includes(i) ? s.filter((n) => n !== i) : [...s, i]))
                          }
                        />
                        {r}
                      </label>
                    ))}
                    <small>امتیاز تشریحی، خودارزیابی است و تصحیح خودکار محسوب نمی‌شود.</small>
                  </div>
                </>
              )}
            </div>
            {submitted && (
              <div
                className={`answer-feedback ${score >= 70 ? 'positive' : 'review'}`}
                role="status"
              >
                <h3>
                  {q.type === 'essay' ? (
                    <PencilLine size={20} />
                  ) : score === 100 ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Lightbulb size={20} />
                  )}{' '}
                  {q.type === 'essay'
                    ? `خودارزیابی تو: ${fa(score)} از ۱۰۰`
                    : score === 100
                      ? 'درست بود؛ آفرین!'
                      : 'بیا با هم مرور کنیم.'}
                </h3>
                <p>{q.explanation}</p>
              </div>
            )}
            <div className="question-actions">
              <span>
                <ShieldCheck size={15} />
                تمرین برای یادگیری است؛ از اشتباه نترس.
              </span>
              {submitted ? (
                <button className="button primary" onClick={next}>
                  {index === session.questions.length - 1 ? 'دیدن نتیجه' : 'سؤال بعدی'}
                  <ArrowLeft size={16} />
                </button>
              ) : (
                <button
                  className="button primary"
                  disabled={
                    !answered || (q.type === 'numeric' && !Number.isFinite(numberValue(answer)))
                  }
                  onClick={submit}
                >
                  ثبت و بررسی پاسخ
                  <Check size={16} />
                </button>
              )}
            </div>
          </section>
          <aside className="panel quiz-guide">
            <span className="soft-icon olive">
              <ClipboardCheck size={25} />
            </span>
            <h3>دانسته‌هایت را به کار بگیر</h3>
            <p>قبل از انتخاب پاسخ، مسئله را بخوان و دلیل تصمیم خودت را پیدا کن.</p>
            <div className="quiz-dots">
              {session.questions.map((item, i) => (
                <span
                  className={`${i === index ? 'current' : ''} ${i < index ? 'done' : ''}`}
                  key={item.id}
                >
                  {i < index ? <Check size={14} /> : fa(i + 1)}
                </span>
              ))}
            </div>
            <hr />
            <p className="small-text">
              نتیجه هر پاسخ در آنالیز من ثبت می‌شود. می‌توانی هر تمرین را دوباره انجام بدهی.
            </p>
          </aside>
        </div>
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="دانش، وقتی به کار بیاید ماندگار می‌شود"
        title="تمرین کن، اشتباه کن، یاد بگیر."
        description="از سؤال‌های کوتاه تا تصمیم‌های واقعی در کارگاه؛ اینجا جایی برای محک زدن خودت است."
      >
        <span className="heading-badge">
          <ClipboardCheck size={17} />
          {fa(questions.length)} سؤال کاربردی
        </span>
      </PageHeading>
      <div className="practice-mode-grid">
        <button
          className={mode === 'practice' ? 'selected' : ''}
          onClick={() => setMode('practice')}
        >
          <span className="soft-icon olive">
            <BookOpen size={24} />
          </span>
          <div>
            <h3>تمرین آزاد</h3>
            <p>با انتخاب موضوع و نوع سؤال، روی مهارت دلخواهت تمرکز کن.</p>
          </div>
          <CircleDot size={20} />
        </button>
        <button className={mode === 'exam' ? 'selected' : ''} onClick={() => setMode('exam')}>
          <span className="soft-icon navy">
            <Flag size={24} />
          </span>
          <div>
            <h3>آزمون ترکیبی</h3>
            <p>۱۰ سؤال از موضوع‌های مختلف، با نتیجه و تحلیل پایانی.</p>
          </div>
          <CircleDot size={20} />
        </button>
      </div>
      {mode === 'exam' ? (
        <div className="panel exam-start">
          <div className="exam-illustration">
            <ClipboardCheck size={70} strokeWidth={1} />
            <Sparkles size={25} />
          </div>
          <h2>یک چالش کوچک، یک شناخت بهتر</h2>
          <p>
            ۱۰ سؤال تستی، تصویری، عددی و تشریحی به صورت ترکیبی انتخاب می‌شوند.
            <br />
            محدودیت زمانی ندارد؛ روی یادگیری تمرکز کن.
          </p>
          <button
            className="button primary"
            onClick={() => start([...questions].sort(() => Math.random() - 0.5).slice(0, 10), true)}
          >
            شروع آزمون ترکیبی
            <ArrowLeft size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="filter-bar">
            <div className="tabs">
              {['همه موضوع‌ها', ...categories.slice(1)].map((c) => (
                <button
                  key={c}
                  className={category === c ? 'active' : ''}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <select aria-label="نوع سؤال" value={type} onChange={(e) => setType(e.target.value)}>
              <option>همه سؤال‌ها</option>
              {Object.entries(typeNames).map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="section-heading">
            <span className="results-count">{fa(bank.length)} سؤال برای تمرین</span>
            <button
              className="button primary small"
              disabled={!bank.length}
              onClick={() => start(bank)}
            >
              شروع تمرین این مجموعه
              <Play size={14} />
            </button>
          </div>
          <div className="question-bank">
            {bank.map((q) => (
              <button className="panel question-bank-item" key={q.id} onClick={() => start([q])}>
                <span
                  className={`soft-icon ${q.type === 'numeric' ? 'sand' : q.type === 'essay' ? 'navy' : 'olive'}`}
                >
                  {q.type === 'numeric' ? (
                    <Calculator size={21} />
                  ) : q.type === 'essay' ? (
                    <PencilLine size={21} />
                  ) : q.type === 'visual' ? (
                    <Layers3 size={21} />
                  ) : (
                    <ClipboardCheck size={21} />
                  )}
                </span>
                <div>
                  <div className="question-bank-meta">
                    <span>{q.category}</span>
                    <i /> <span>{typeNames[q.type]}</span>
                  </div>
                  <h3>{q.title}</h3>
                </div>
                {state.attempts.some((a) => a.questionId === q.id) && (
                  <span className="attempted-tag">
                    <Check size={12} />
                    تمرین شده
                  </span>
                )}
                <ChevronLeft size={18} />
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
