import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  NotebookPen,
  PencilLine,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { Empty, PageHeading, SectionHeading } from '../components/ui';
import { allLessons, courses } from '../domain/catalog';
import type { LearningActions } from '../domain/types';

export function Library(
  props: Pick<
    LearningActions,
    'state' | 'navigate' | 'update' | 'notify' | 'bookmark' | 'courseProgress'
  > & { type: 'notes' | 'saved' },
) {
  const { type, state, navigate, update, notify } = props;
  const [term, setTerm] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [text, setText] = useState('');
  const notes = allLessons.filter(
    (l) => state.notes[l.id]?.trim() && (l.title + state.notes[l.id]).includes(term),
  );
  const savedCourses = courses.filter(
    (c) => state.bookmarks.includes(c.id) && c.title.includes(term),
  );
  const savedLessons = allLessons.filter(
    (l) => state.bookmarks.includes(l.id) && l.title.includes(term),
  );
  return (
    <>
      <PageHeading
        eyebrow="کتابخانه‌ای به رنگ تجربه‌های تو"
        title={type === 'notes' ? 'یادداشت‌های من' : 'ذخیره‌شده‌های من'}
        description={
          type === 'notes'
            ? 'چیزی که به زبان خودت می‌نویسی، بیشتر در ذهنت می‌ماند.'
            : 'درس‌ها و مسیرهایی که می‌خواهی دوباره به آن‌ها برگردی.'
        }
      />
      <div className="library-search mini-search">
        <Search size={17} />
        <input
          placeholder={type === 'notes' ? 'جستجو در یادداشت‌ها...' : 'جستجو در ذخیره‌ها...'}
          aria-label="جستجوی کتابخانه"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
      {type === 'saved' ? (
        <>
          {savedCourses.length > 0 && (
            <>
              <SectionHeading title="مسیرهای ذخیره‌شده" />
              <div className="courses-grid">
                {savedCourses.map((c) => (
                  <CourseCard key={c.id} course={c} {...props} />
                ))}
              </div>
            </>
          )}
          {savedLessons.length > 0 && (
            <>
              <SectionHeading title="درس‌های ذخیره‌شده" />
              <div className="saved-lessons">
                {savedLessons.map((l) => (
                  <div className="panel saved-lesson" key={l.id}>
                    <span className="soft-icon olive">
                      <BookOpen size={23} />
                    </span>
                    <div>
                      <small>{l.courseTitle}</small>
                      <h3>{l.title}</h3>
                    </div>
                    <button className="button subtle" onClick={() => navigate(`lesson/${l.id}`)}>
                      مطالعه درس
                      <ArrowLeft size={15} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label="حذف از ذخیره‌ها"
                      onClick={() => props.bookmark(l.id)}
                    >
                      <Bookmark size={19} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          {!savedCourses.length && !savedLessons.length && (
            <Empty
              icon={Bookmark}
              title={term ? 'چیزی پیدا نشد' : 'جای ایده‌های خوبت اینجاست'}
              text="با زدن نشان ذخیره روی دوره یا درس، آن را برای مرور بعدی نگه دار."
              action={() => navigate('courses')}
              button="کشف مسیرهای یادگیری"
            />
          )}
        </>
      ) : (
        <>
          {notes.length ? (
            <div className="notes-grid">
              {notes.map((l) => (
                <article className="panel note-card" key={l.id}>
                  <div className="note-card-top">
                    <span>
                      <NotebookPen size={15} />
                      {l.courseTitle}
                    </span>
                    <button
                      className="icon-button"
                      aria-label="ویرایش یادداشت"
                      onClick={() => {
                        setEditing(l.id);
                        setText(state.notes[l.id]);
                      }}
                    >
                      <PencilLine size={17} />
                    </button>
                  </div>
                  <h3>{l.title}</h3>
                  {editing === l.id ? (
                    <>
                      <textarea
                        aria-label="ویرایش متن یادداشت"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      <div className="note-actions">
                        <button className="button subtle small" onClick={() => setEditing(null)}>
                          انصراف
                        </button>
                        <button
                          className="button primary small"
                          onClick={() => {
                            update((s) => ({ notes: { ...s.notes, [l.id]: text } }));
                            setEditing(null);
                            notify('یادداشت به‌روز شد');
                          }}
                        >
                          ذخیره تغییرات
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>{state.notes[l.id]}</p>
                  )}
                  <div className="note-bottom">
                    <button className="text-link" onClick={() => navigate(`lesson/${l.id}`)}>
                      بازگشت به درس
                      <ArrowLeft size={14} />
                    </button>
                    <button
                      className="icon-button delete-note"
                      aria-label="حذف یادداشت"
                      onClick={() => {
                        if (confirm('این یادداشت حذف شود؟')) {
                          update((s) => {
                            const n = { ...s.notes };
                            delete n[l.id];
                            return { notes: n };
                          });
                          notify('یادداشت حذف شد');
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              icon={NotebookPen}
              title={term ? 'یادداشتی پیدا نشد' : 'از یادگیری‌ات رد پا بگذار'}
              text="در صفحه هر درس، بخش یادداشت من را باز کن و نکته‌ها و تجربه‌هایت را بنویس."
              action={() => navigate('courses')}
              button="رفتن به درس‌ها"
            />
          )}
        </>
      )}
    </>
  );
}
