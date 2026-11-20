import {
  Check,
  CheckCircle2,
  Download,
  Moon,
  RotateCcw,
  Sun,
  Trash2,
  Upload,
  UsersRound,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { PageHeading, SectionHeading } from '../components/ui';
import { fa, localDate } from '../domain/locale';
import { parseBackup, startingState } from '../domain/storage';
import type { LearningActions, LearningState } from '../domain/types';

export function SettingsPage({
  state,
  update,
  setState,
  notify,
}: Pick<LearningActions, 'state' | 'update' | 'notify'> & {
  setState: (state: LearningState) => void;
}) {
  const [name, setName] = useState(state.name);
  const [goal, setGoal] = useState(state.goal);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetText, setResetText] = useState('');
  const [importError, setImportError] = useState('');
  const [pendingImport, setPendingImport] = useState<LearningState | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peyrizi-backup-${localDate()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('نسخه پشتیبان آماده و دانلود شد');
  };
  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (file.size > 5000000) throw new Error('حجم فایل نباید بیشتر از ۵ مگابایت باشد.');
      setPendingImport(parseBackup(await file.text()));
      setImportError('');
    } catch (err) {
      setImportError(
        err instanceof SyntaxError
          ? 'فایل JSON خوانا نیست. یک نسخه پشتیبان معتبر انتخاب کن.'
          : err instanceof Error
            ? err.message
            : 'بازیابی فایل انجام نشد.',
      );
    }
    input.value = '';
  };
  return (
    <>
      <PageHeading
        eyebrow="فضای یادگیری، به سبک تو"
        title="تنظیمات من"
        description="هدفت را تنظیم کن، ظاهر سایت را انتخاب کن و از مسیرت نسخه پشتیبان بگیر."
      />
      <div className="settings-layout">
        <section className="panel settings-section">
          <SectionHeading title="پروفایل و هدف یادگیری" icon={UsersRound} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) {
                notify('یک نام برای خودت بنویس');
                return;
              }
              update({ name: name.trim().slice(0, 40), goal: Number(goal) });
              notify('پروفایل و هدف تو ذخیره شد');
            }}
          >
            <label className="field-label">
              دوست داری چه صدایت کنیم؟
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="نام شما"
                required
              />
            </label>
            <label className="field-label">
              هدف هفتگی یادگیری
              <select value={goal} onChange={(e) => setGoal(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((n) => (
                  <option value={n} key={n}>
                    {fa(n)} درس در هفته
                  </option>
                ))}
              </select>
            </label>
            <p className="field-hint">
              یک هدف واقع‌بینانه انتخاب کن. پیوستگی از حجم مطالعه مهم‌تر است.
            </p>
            <button className="button primary" type="submit">
              <Check size={16} />
              ذخیره تغییرات
            </button>
          </form>
        </section>
        <section className="panel settings-section">
          <SectionHeading title="ظاهر و یادآوری" icon={Sun} />
          <div className="theme-options">
            <button
              className={state.theme === 'light' ? 'selected' : ''}
              onClick={() => update({ theme: 'light' })}
            >
              <div className="theme-preview light-preview">
                <i />
                <span />
                <span />
              </div>
              <span>
                <Sun size={17} />
                روشن{state.theme === 'light' && <CheckCircle2 size={16} />}
              </span>
            </button>
            <button
              className={state.theme === 'dark' ? 'selected' : ''}
              onClick={() => update({ theme: 'dark' })}
            >
              <div className="theme-preview dark-preview">
                <i />
                <span />
                <span />
              </div>
              <span>
                <Moon size={17} />
                تاریک{state.theme === 'dark' && <CheckCircle2 size={16} />}
              </span>
            </button>
          </div>
          <div className="setting-toggle-row">
            <div>
              <strong>یادآوری یادگیری در سایت</strong>
              <p>نشان یادآوری را روی آیکون اعلان‌ها ببین.</p>
            </div>
            <button
              role="switch"
              aria-checked={state.reminder}
              aria-label="یادآوری یادگیری"
              className={`toggle ${state.reminder ? 'on' : ''}`}
              onClick={() => update({ reminder: !state.reminder })}
            >
              <span />
            </button>
          </div>
        </section>
        <section className="panel settings-section backup-section">
          <SectionHeading title="یادگیری‌ات را همراهت داشته باش" icon={Download} />
          <p>
            درس‌ها، تمرین‌ها، یادداشت‌ها و تنظیمات در همین مرورگر ذخیره می‌شوند. پاک کردن داده‌های
            مرورگر آن‌ها را حذف می‌کند. برای جابه‌جایی به دستگاه دیگر، یک نسخه پشتیبان بگیر.
          </p>
          <div className="backup-actions">
            <button className="button primary" onClick={exportData}>
              <Download size={17} />
              دریافت نسخه پشتیبان
            </button>
            <button className="button secondary" onClick={() => inputRef.current?.click()}>
              <Upload size={17} />
              بازیابی از فایل
            </button>
            <input
              type="file"
              ref={inputRef}
              accept=".json,application/json"
              hidden
              onChange={importData}
            />
          </div>
          {importError && (
            <p className="field-error" role="alert">
              {importError}
            </p>
          )}
          {pendingImport && (
            <div className="import-confirm">
              <strong>
                این نسخه شامل {fa(pendingImport.completed.length)} درس تکمیل‌شده و{' '}
                {fa(pendingImport.attempts.length)} پاسخ است.
              </strong>
              <p>
                بازیابی، اطلاعات فعلی این مرورگر را جایگزین می‌کند. در صورت نیاز، ابتدا نسخه پشتیبان
                بگیر.
              </p>
              <button
                className="button primary small"
                onClick={() => {
                  setState(pendingImport);
                  setName(pendingImport.name);
                  setGoal(pendingImport.goal);
                  setPendingImport(null);
                  notify('نسخه پشتیبان با موفقیت بازیابی شد');
                }}
              >
                تأیید و بازیابی
              </button>
              <button className="button text-button" onClick={() => setPendingImport(null)}>
                انصراف
              </button>
            </div>
          )}
        </section>
        <section className="panel settings-section reset-section">
          <SectionHeading title="شروع دوباره" icon={RotateCcw} />
          <p>
            اگر می‌خواهی مسیر را از ابتدا طی کنی، می‌توانی همه داده‌های این مرورگر را پاک کنی. قبل
            از این کار نسخه پشتیبان بگیر.
          </p>
          {confirmReset ? (
            <div className="reset-confirm">
              <label className="field-label">
                برای تأیید، عبارت «شروع دوباره» را بنویس.
                <input
                  value={resetText}
                  onChange={(e) => setResetText(e.target.value)}
                  placeholder="شروع دوباره"
                />
              </label>
              <button
                className="button danger"
                disabled={resetText !== 'شروع دوباره'}
                onClick={() => {
                  setState({
                    ...startingState,
                    theme: state.theme,
                    joined: new Date().toISOString(),
                  });
                  setName(startingState.name);
                  setGoal(startingState.goal);
                  setConfirmReset(false);
                  setResetText('');
                  notify('داده‌ها پاک شدند؛ آماده یک شروع تازه‌ای.');
                }}
              >
                حذف داده‌ها و شروع دوباره
              </button>
              <button
                className="button text-button"
                onClick={() => {
                  setConfirmReset(false);
                  setResetText('');
                }}
              >
                انصراف
              </button>
            </div>
          ) : (
            <button className="button danger-outline" onClick={() => setConfirmReset(true)}>
              <Trash2 size={16} />
              پاک کردن اطلاعات یادگیری
            </button>
          )}
        </section>
      </div>
    </>
  );
}
