import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  ArrowLeft,
  Blocks,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  GanttChart,
  Handshake,
  PaintBucket,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { fa } from '../domain/locale';

const iconMap: Record<string, LucideIcon> = {
  Building2,
  ChartNoAxesCombined,
  GanttChart,
  UsersRound,
  Blocks,
  Handshake,
  PaintBucket,
  BriefcaseBusiness,
};
export const Progress = ({ value = 0, color = '' }) => (
  <div className={`progress-track ${color}`}>
    <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);
export const Icon = ({ name, ...props }: LucideProps & { name: string }) => {
  const C = iconMap[name] || BookOpen;
  return <C {...props} />;
};
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function SectionHeading({
  title,
  subtitle,
  children,
  icon: IconC,
}: {
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>
          {IconC && <IconC size={20} />} {title}
        </h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function Empty({
  icon: IconC = BookOpen,
  title,
  text,
  action,
  button,
}: {
  icon?: LucideIcon;
  title: string;
  text?: string;
  action?: () => void;
  button?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <IconC size={32} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="button primary" onClick={action}>
          {button}
          <ArrowLeft size={16} />
        </button>
      )}
    </div>
  );
}
export function StatCard({
  icon: IconC,
  label,
  value,
  unit,
  detail,
  color = 'olive',
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: string;
  color?: string;
  trend?: boolean;
}) {
  return (
    <div className="stat-card">
      <span className={`soft-icon ${color}`}>
        <IconC size={22} strokeWidth={1.7} />
      </span>
      <div className="stat-content">
        <span>{label}</span>
        <div className="stat-value">
          {value}
          <small>{unit}</small>
        </div>
      </div>
      {detail && (
        <div className="stat-detail">
          {trend && <TrendingUp size={13} />} {detail}
        </div>
      )}
    </div>
  );
}
export function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
}: {
  active?: boolean;
  payload?: { value?: unknown }[];
  label?: ReactNode;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip" dir="rtl">
      <small>{label}</small>
      <strong>
        {fa(Number(payload[0].value))} {unit}
      </strong>
    </div>
  );
}
