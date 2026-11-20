import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  HardHat,
  Lightbulb,
  Menu,
  Search,
  Settings,
  Target,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { allLessons } from '../domain/catalog';
import { fa, normalizeSearch } from '../domain/locale';
import type { LearningState } from '../domain/types';

import type { Navigate } from './useRoute';
export function Topbar({
  route,
  state,
  navigate,
  openMenu,
  closeMenu,
}: {
  route: string;
  state: LearningState;
  navigate: Navigate;
  openMenu: () => void;
  closeMenu: () => void;
}) {
  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setSearch('');
    setNotifications(false);
    setProfileOpen(false);
  }, [route]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearch('');
        setNotifications(false);
        setProfileOpen(false);
        closeMenu();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMenu]);
  const today = new Intl.DateTimeFormat('fa-IR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date());
  const query = normalizeSearch(search);
  const results =
    query.length > 1
      ? allLessons
          .filter((l) => normalizeSearch(`${l.title} ${l.courseTitle} ${l.intro}`).includes(query))
          .slice(0, 7)
      : [];
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" aria-label="باز کردن منو" onClick={openMenu}>
        <Menu size={23} />
      </button>
      <div className="search-wrap">
        <Search size={19} />
        <input
          ref={searchRef}
          aria-label="جستجو در درس‌ها"
          placeholder="دوست داری امروز چی یاد بگیری؟"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <kbd>⌘ K</kbd>
        {search && (
          <button
            className="clear-search"
            aria-label="پاک کردن جستجو"
            onClick={() => setSearch('')}
          >
            <X size={15} />
          </button>
        )}
        {query.length > 1 && (
          <div className="search-results">
            <div className="dropdown-heading">
              نتیجه جستجو در درس‌ها <span>{fa(results.length)} مورد</span>
            </div>
            {results.length ? (
              results.map((l) => (
                <button key={l.id} onClick={() => navigate(`lesson/${l.id}`)}>
                  <span className="search-result-icon">
                    <BookOpen size={17} />
                  </span>
                  <span>
                    <strong>{l.title}</strong>
                    <small>{l.courseTitle}</small>
                  </span>
                  <ChevronLeft size={15} />
                </button>
              ))
            ) : (
              <div className="search-empty">
                درسی پیدا نشد. «بتن»، «هزینه» یا «قرارداد» را امتحان کن.
              </div>
            )}
          </div>
        )}
      </div>
      <div className="topbar-spacer" />
      <div className="today">
        <CalendarDays size={17} />
        {today}
      </div>
      <div className="header-divider" />
      <div className="popover-wrap">
        <button
          className="icon-button bell-button"
          aria-label="اعلان‌ها"
          onClick={() => {
            setNotifications(!notifications);
            setProfileOpen(false);
          }}
        >
          <Bell size={20} />
          {state.reminder && <i />}
        </button>
        {notifications && (
          <div className="notification-panel">
            <div className="dropdown-heading">
              یادآوری‌های یادگیری <Bell size={16} />
            </div>
            <div className="notification-item">
              <span className="soft-icon olive">
                <Target size={20} />
              </span>
              <div>
                <strong>برای خودت وقت بگذار</strong>
                <p>امروز یک درس کوتاه بخوان؛ استمرار از سرعت مهم‌تر است.</p>
              </div>
            </div>
            <div className="notification-item">
              <span className="soft-icon sand">
                <Lightbulb size={20} />
              </span>
              <div>
                <strong>دانش را به کار بگیر</strong>
                <p>کارگاه محاسبات با مثال‌های واقعی منتظر توست.</p>
                <button className="text-link" onClick={() => navigate('workshop')}>
                  رفتن به کارگاه <ArrowLeft size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="popover-wrap">
        <button
          className="profile-trigger"
          onClick={() => {
            setProfileOpen(!profileOpen);
            setNotifications(false);
          }}
          aria-label="پروفایل من"
        >
          <span className="avatar">
            <HardHat size={21} />
          </span>
          <div>
            <strong>{state.name}</strong>
            <small>سازنده آینده</small>
          </div>
          <ChevronDown size={15} />
        </button>
        {profileOpen && (
          <div className="profile-panel">
            <strong>{state.name}، خوش آمدی</strong>
            <small>{fa(state.completed.length)} درس در مسیر رشد</small>
            <button onClick={() => navigate('settings')}>
              <Settings size={16} />
              تنظیمات پروفایل
            </button>
            <button onClick={() => navigate('analytics')}>
              <BarChart3 size={16} />
              مشاهده پیشرفت من
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
