import {
  ArrowLeft,
  Blocks,
  Bookmark,
  Building2,
  Moon,
  NotebookPen,
  Settings,
  Sun,
} from 'lucide-react';
import { fa } from '../domain/locale';
import type { LearningState, UpdateState } from '../domain/types';

import { navItems } from './navigation';
import type { Navigate } from './useRoute';
export function Sidebar({
  active,
  mobileOpen,
  state,
  navigate,
  update,
}: {
  active: string;
  mobileOpen: boolean;
  state: LearningState;
  navigate: Navigate;
  update: UpdateState;
}) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <a className="brand" href="#dashboard" aria-label="پی‌ریزی، پیشخوان">
        <span className="brand-symbol">
          <Building2 size={27} strokeWidth={1.6} />
        </span>
        <div>
          <strong>
            پی‌ریزی<span className="brand-dot">.</span>
          </strong>
          <small>آکادمی ساختن و مدیریت</small>
        </div>
      </a>
      <div className="sidebar-caption">فضای یادگیری شما</div>
      <nav aria-label="منوی اصلی">
        {navItems.map((n) => (
          <a href={`#${n.id}`} key={n.id} className={`nav-item ${active === n.id ? 'active' : ''}`}>
            <n.icon size={20} />
            <span>{n.label}</span>
            {n.badge && <b className="nav-badge">{n.badge}</b>}
            {active === n.id && <span className="nav-active-dot" />}
          </a>
        ))}
      </nav>
      <div className="sidebar-divider" />
      <div className="sidebar-caption">کتابخانه شخصی</div>
      <nav aria-label="کتابخانه">
        <a className={`nav-item ${active === 'saved' ? 'active' : ''}`} href="#saved">
          <Bookmark size={20} />
          <span>ذخیره‌شده‌ها</span>
          {state.bookmarks.length > 0 && <b className="nav-badge">{fa(state.bookmarks.length)}</b>}
        </a>
        <a className={`nav-item ${active === 'notes' ? 'active' : ''}`} href="#notes">
          <NotebookPen size={20} />
          <span>یادداشت‌های من</span>
        </a>
      </nav>
      <div className="sidebar-grow" />
      <div className="sidebar-promo">
        <div className="promo-art">
          <Building2 size={48} strokeWidth={1} />
          <div className="promo-art-line" />
          <Blocks size={26} strokeWidth={1} />
        </div>
        <strong>دانش امروز، بنای فردا</strong>
        <p>
          هر روز یک قدم کوچک،
          <br />
          برای ساختن آینده‌ای محکم‌تر.
        </p>
        <button onClick={() => navigate('courses')}>
          ادامه مسیر یادگیری <ArrowLeft size={15} />
        </button>
      </div>
      <div className="sidebar-bottom">
        <button className="settings-nav" onClick={() => navigate('settings')}>
          <Settings size={19} />
          <span>تنظیمات</span>
        </button>
        <button
          className="theme-switch"
          onClick={() => update({ theme: state.theme === 'dark' ? 'light' : 'dark' })}
          aria-label={state.theme === 'dark' ? 'فعال کردن حالت روشن' : 'فعال کردن حالت تاریک'}
        >
          <Sun size={16} className={state.theme === 'light' ? 'selected' : ''} />
          <Moon size={16} className={state.theme === 'dark' ? 'selected' : ''} />
        </button>
      </div>
      <div className="sidebar-version">
        <span className="status-dot" /> فضای شخصی یادگیری <span>نسخه ۱.۰</span>
      </div>
    </aside>
  );
}
