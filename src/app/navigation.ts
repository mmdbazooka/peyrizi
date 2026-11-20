import { BarChart3, Calculator, ClipboardCheck, LayoutDashboard, Route } from 'lucide-react';
import { courses } from '../domain/catalog';
import { fa } from '../domain/locale';

export const navItems = [
  { id: 'dashboard', label: 'پیشخوان', icon: LayoutDashboard },
  { id: 'courses', label: 'مسیر یادگیری', icon: Route, badge: fa(courses.length) },
  { id: 'practice', label: 'تمرین و آزمون', icon: ClipboardCheck },
  { id: 'workshop', label: 'کارگاه محاسبات', icon: Calculator },
  { id: 'analytics', label: 'آنالیز من', icon: BarChart3 },
];
