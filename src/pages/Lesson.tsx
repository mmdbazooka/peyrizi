import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  PencilLine,
  Route,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConceptDiagram, StructureDiagram } from '../components/Diagrams';
import { Empty, Progress } from '../components/ui';
import { courses } from '../domain/catalog';
import { fa } from '../domain/locale';
import type { LearningActions } from '../domain/types';

export function Lesson(
  props: Pick<
    LearningActions,
    'state' | 'navigate' | 'complete' | 'bookmark' | 'update' | 'notify' | 'courseProgress'
  > & { id: string },
) {
  const { id, state, navigate, complete, bookmark, update, notify } = props;
  const c = courses.find((c) => c.lessons.some((l) => l.id === id));
  const l = c?.lessons.find((l) => l.id === id);
  const [note, setNote] = useState(state.notes[id] || '');
  const [tab, setTab] = useState('lesson');
  useEffect(() => {
    setNote(state.notes[id] || '');
    setTab('lesson');
    if (l) update({ lastLesson: id });
  }, [id]);
  if (!c || !l)
    return (
      <Empty title="این درس پیدا نشد" action={() => navigate('courses')} button="انتخاب مسیر" />
    );
  const index = c.lessons.findIndex((l) => l.id === id);
  const done = state.completed.includes(id);
  const saveNote = () => {
    update((s) => ({ notes: { ...s.notes, [id]: note } }));
    notify('یادداشت این درس ذخیره شد');
  };
  return (
    <>
      <div className="lesson-toolbar">
        <button className="back-link" onClick={() => navigate(`courses/${c.id}`)}>
          <ArrowRight size={16} />
          {c.title}
        </button>
        <button
          className={`icon-button ${state.bookmarks.includes(id) ? 'bookmarked' : ''}`}
          aria-label="ذخیره درس"
          onClick={() => bookmark(id)}
        >
          <Bookmark size={20} fill={state.bookmarks.includes(id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="lesson-layout">
        <article className="panel lesson-article">
          <div className="lesson-eyebrow">
            <span>
              درس {fa(index + 1)} از {fa(c.lessons.length)}
            </span>
            <span>
              <Clock3 size={14} />
              {fa(l.duration)} دقیقه مطالعه و تمرین
            </span>
            {done && (
              <span className="done-label">
                <CheckCircle2 size={14} />
                تکمیل‌شده
              </span>
            )}
          </div>
          <h1>{l.title}</h1>
          <p className="lesson-intro">{l.intro}</p>
          <div className="tabs lesson-tabs">
            <button className={tab === 'lesson' ? 'active' : ''} onClick={() => setTab('lesson')}>
              <BookOpen size={16} />
              متن درس
            </button>
            <button className={tab === 'notes' ? 'active' : ''} onClick={() => setTab('notes')}>
              <PencilLine size={16} />
              یادداشت من{state.notes[id] && <span className="note-dot" />}
            </button>
          </div>
          {tab === 'lesson' ? (
            <>
              <div className="lesson-opening">
                <span className="soft-icon olive">
                  <Lightbulb size={22} />
                </span>
                <div>
                  <strong>چرا این درس مهم است؟</strong>
                  <p>{c.description}</p>
                </div>
              </div>
              {l.diagram &&
                (['construction', 'structure', 'finishing'].includes(c.id) ? (
                  <StructureDiagram type={c.id === 'finishing' ? 'pipeline' : 'structure'} />
                ) : (
                  <ConceptDiagram topic={c.id} />
                ))}
              {l.points.map((p, i) => (
                <section className="lesson-section" key={i}>
                  <h2>
                    <span>{fa(i + 1)}</span>
                    {
                      [
                        'مفهوم اصلی را بشناس',
                        'در کارگاه چه چیزی را بررسی کنیم؟',
                        'از دانستن تا تصمیم درست',
                      ][i]
                    }
                  </h2>
                  <p>{p}</p>
                </section>
              ))}
              <div className="example-box">
                <h3>
                  <Calculator size={19} />
                  یک مثال از دنیای واقعی
                </h3>
                <p>{l.example}</p>
              </div>
              <div className="task-box">
                <h3>
                  <PencilLine size={19} />
                  حالا نوبت توست
                </h3>
                <p>{l.task}</p>
                <textarea
                  aria-label="پاسخ تمرین درس"
                  placeholder="پاسخت را اینجا بنویس؛ می‌توانی بعداً آن را کامل کنی..."
                  value={state.drafts[id] || ''}
                  onChange={(e) =>
                    update((s) => ({ drafts: { ...s.drafts, [id]: e.target.value } }))
                  }
                />
                <small>
                  <Check size={12} /> پاسخ در همین مرورگر ذخیره می‌شود.
                </small>
              </div>
              <div className="lesson-takeaway">
                <ShieldCheck size={21} />
                <p>
                  یک نکته برای اجرا: پیش از تصمیم، نقشه و قرارداد مصوب، شرایط واقعی پروژه و نظر
                  مسئول دارای صلاحیت را کنار هم بررسی کن.
                </p>
              </div>
              <div className="lesson-complete">
                <div>
                  <strong>
                    {done ? 'این قدم را برداشتی؛ عالیه!' : 'آماده‌ای یک قدم جلوتر بروی؟'}
                  </strong>
                  <p>بعد از مطالعه و انجام تمرین، این درس را تکمیل کن.</p>
                </div>
                <button
                  className={`button ${done ? 'secondary' : 'primary'}`}
                  disabled={done}
                  onClick={() => complete(l)}
                >
                  <CheckCircle2 size={18} />
                  {done ? 'درس تکمیل شده' : 'مطالعه کردم و یاد گرفتم'}
                </button>
              </div>
            </>
          ) : (
            <div className="notes-editor">
              <h2>دانش را با کلمات خودت ثبت کن.</h2>
              <p>نکته‌ای که یاد گرفتی، تجربه کارگاه یا سؤالی برای پیگیری بعدی را یادداشت کن.</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="از این درس چه چیزی با خودت می‌بری؟"
                aria-label="یادداشت درس"
              />
              <div className="note-actions">
                <span>{fa(note.length)} نویسه</span>
                <button className="button primary" onClick={saveNote}>
                  <Check size={16} />
                  ذخیره یادداشت
                </button>
              </div>
            </div>
          )}
          <div className="lesson-pagination">
            <button
              className="text-link"
              disabled={!index}
              onClick={() => navigate(`lesson/${c.lessons[index - 1].id}`)}
            >
              <ArrowRight size={16} />
              درس قبل
            </button>
            <button
              className="text-link"
              onClick={() =>
                navigate(
                  index < c.lessons.length - 1 ? `lesson/${c.lessons[index + 1].id}` : 'practice',
                )
              }
            >
              {index < c.lessons.length - 1 ? 'درس بعدی' : 'وقت تمرین است'}
              <ArrowLeft size={16} />
            </button>
          </div>
        </article>
        <aside className="lesson-side">
          <div className="panel">
            <h3>
              <Route size={18} /> قدم‌های این مسیر
            </h3>
            <Progress value={props.courseProgress(c)} />
            <div className="lesson-side-list">
              {c.lessons.map((item, i) => (
                <button
                  key={item.id}
                  className={item.id === id ? 'active' : ''}
                  onClick={() => navigate(`lesson/${item.id}`)}
                >
                  {state.completed.includes(item.id) ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <span>{fa(i + 1)}</span>
                  )}
                  <div>
                    {item.title}
                    <small>{fa(item.duration)} دقیقه</small>
                  </div>
                  {item.id === id && <Volume2 size={15} />}
                </button>
              ))}
            </div>
          </div>
          <div className="small-tip">
            <Lightbulb size={24} />
            <h3>یادگیری عمیق‌تر</h3>
            <p>
              بعد از هر درس، یک مثال از پروژه خودت پیدا کن. ارتباط دانش با تجربه، یادگیری را
              ماندگارتر می‌کند.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
