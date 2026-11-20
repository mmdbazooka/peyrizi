import {
  Blocks,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  GanttChart,
  TrendingUp,
} from 'lucide-react';
import { numberValue } from './locale';
export type CalculatorResult = {
  value: number;
  extra: [string, number, string][];
  explanation: string;
};
type CalculatorId = 'concrete' | 'profit' | 'cash' | 'evm' | 'material' | 'schedule';

export const calculators: {
  id: CalculatorId;
  title: string;
  subtitle: string;
  icon: import('lucide-react').LucideIcon;
  fields: [string, string, string, string][];
  formula: string;
  result: string;
  unit: string;
}[] = [
  {
    id: 'concrete',
    title: 'حجم و هزینه بتن',
    subtitle: 'مقدار بتن یک پی مستطیلی را برآورد کن.',
    icon: Building2,
    fields: [
      ['length', 'طول پی', 'متر', '۱۰'],
      ['width', 'عرض پی', 'متر', '۸'],
      ['depth', 'ضخامت پی', 'متر', '۰٫۵'],
      ['rate', 'نرخ هر مترمکعب', 'تومان', '۳۰۰۰۰۰۰'],
    ],
    formula: 'حجم = طول × عرض × ضخامت',
    result: 'حجم بتن',
    unit: 'مترمکعب',
  },
  {
    id: 'profit',
    title: 'سود و حاشیه سود',
    subtitle: 'فروش، هزینه و سود را درست کنار هم ببین.',
    icon: TrendingUp,
    fields: [
      ['revenue', 'مبلغ فروش', 'تومان', '۱۰۰۰۰۰۰۰۰'],
      ['cost', 'بهای تمام‌شده', 'تومان', '۸۰۰۰۰۰۰۰'],
    ],
    formula: 'حاشیه سود = (فروش − هزینه) ÷ فروش × ۱۰۰',
    result: 'حاشیه سود',
    unit: 'درصد',
  },
  {
    id: 'cash',
    title: 'جریان نقدی پروژه',
    subtitle: 'مانده نقد پایان یک دوره را محاسبه کن.',
    icon: ChartNoAxesCombined,
    fields: [
      ['initial', 'موجودی ابتدای دوره', 'تومان', '۱۰۰۰۰۰۰۰۰'],
      ['income', 'دریافت‌ها', 'تومان', '۸۰۰۰۰۰۰۰'],
      ['outgoing', 'پرداخت‌ها', 'تومان', '۱۴۰۰۰۰۰۰۰'],
    ],
    formula: 'مانده پایان = موجودی آغاز + دریافت − پرداخت',
    result: 'مانده نقد پایان دوره',
    unit: 'تومان',
  },
  {
    id: 'evm',
    title: 'کنترل ارزش کسب‌شده',
    subtitle: 'کارایی هزینه و زمان را به زبان عدد ببین.',
    icon: GanttChart,
    fields: [
      ['ev', 'ارزش کسب‌شده (EV)', 'میلیون تومان', '۸۰'],
      ['ac', 'هزینه واقعی (AC)', 'میلیون تومان', '۱۰۰'],
      ['pv', 'ارزش برنامه‌ریزی‌شده (PV)', 'میلیون تومان', '۱۰۰'],
    ],
    formula: 'CPI = EV ÷ AC     |     SPI = EV ÷ PV',
    result: 'شاخص کارایی هزینه (CPI)',
    unit: 'بدون واحد',
  },
  {
    id: 'material',
    title: 'مصالح و پرت خرید',
    subtitle: 'برای یک مقدار پایه، پرت فرضی را اضافه کن.',
    icon: Blocks,
    fields: [
      ['amount', 'مقدار خالص', 'واحد', '۱۰۰'],
      ['waste', 'پرت فرضی', 'درصد', '۵'],
      ['price', 'قیمت واحد', 'تومان', '۲۰۰۰۰۰'],
    ],
    formula: 'مقدار خرید = مقدار خالص × (۱ + پرت ÷ ۱۰۰)',
    result: 'مقدار خرید برآوردی',
    unit: 'واحد',
  },
  {
    id: 'schedule',
    title: 'تحقق برنامه هفتگی',
    subtitle: 'درصد تعهدهای تکمیل‌شده و تعداد کارهای باقی‌مانده را پیدا کن.',
    icon: ClipboardCheck,
    fields: [
      ['planned', 'تعداد کارهای برنامه‌ریزی‌شده', 'کار', '۱۰'],
      ['done', 'تعداد کارهای تکمیل‌شده', 'کار', '۷'],
    ],
    formula: 'درصد تحقق = کارهای تکمیل‌شده ÷ کارهای برنامه‌ریزی‌شده × ۱۰۰',
    result: 'درصد تحقق برنامه',
    unit: 'درصد',
  },
];
export function calculateEstimate(
  calculator: (typeof calculators)[number],
  values: Record<string, string>,
): { result: CalculatorResult } | { error: string } {
  const v = Object.fromEntries(
    calculator.fields.map(([id]) => [id, numberValue(values[id] ?? '')]),
  );
  if (Object.values(v).some((n) => !Number.isFinite(n) || n < 0)) {
    return { error: 'همه فیلدها را با عدد معتبر و غیرمنفی کامل کن.' };
  }
  if (
    (calculator.id === 'concrete' && (!v.length || !v.width || !v.depth)) ||
    (calculator.id === 'profit' && (!v.revenue || !v.cost)) ||
    (calculator.id === 'evm' && (!v.ac || !v.pv))
  ) {
    return { error: 'ابعاد و عددهای مورد استفاده در تقسیم باید بزرگ‌تر از صفر باشند.' };
  }
  let result: CalculatorResult;
  switch (calculator.id) {
    case 'concrete':
      result = {
        value: v.length * v.width * v.depth,
        extra: [['هزینه پایه برآوردی', v.length * v.width * v.depth * v.rate, 'تومان']],
        explanation: `ابتدا حجم را از ضرب سه بُعد به دست می‌آوریم. سپس حجم در نرخ واحد ضرب می‌شود. هزینه حمل، پمپ، آزمایش و پرت در این برآورد ساده لحاظ نشده‌اند.`,
      };
      break;
    case 'profit':
      result = {
        value: ((v.revenue - v.cost) / v.revenue) * 100,
        extra: [
          ['سود / زیان', v.revenue - v.cost, 'تومان'],
          ['اضافه‌بها روی هزینه', ((v.revenue - v.cost) / v.cost) * 100, 'درصد'],
        ],
        explanation:
          'مخرج حاشیه سود، مبلغ فروش است؛ مخرج اضافه‌بها، هزینه است. هزینه‌های فراموش‌شده می‌توانند سود واقعی را کاهش دهند.',
      };
      break;
    case 'cash':
      result = {
        value: v.initial + v.income - v.outgoing,
        extra: [],
        explanation:
          v.initial + v.income - v.outgoing < 0
            ? 'مانده منفی است؛ پیش از سررسید پرداخت‌ها باید برای تأمین نقد یا تغییر زمان‌بندی توافق‌شده اقدام کنی.'
            : 'مانده نقد مثبت است. این عدد به معنی سودآوری قطعی نیست؛ تعهدهای آینده و مطالبات را هم بررسی کن.',
      };
      break;
    case 'evm':
      result = {
        value: v.ev / v.ac,
        extra: [['شاخص کارایی برنامه (SPI)', v.ev / v.pv, 'بدون واحد']],
        explanation: `CPI ${v.ev / v.ac < 1 ? 'کمتر از یک است؛ هزینه واقعی از ارزش بودجه‌ای کار انجام‌شده بیشتر است.' : 'حداقل یک است؛ از منظر هزینه وضعیت مطلوب‌تری داریم.'} SPI ${v.ev / v.pv < 1 ? 'کمتر از یک است؛ پیشرفت از برنامه عقب است.' : 'حداقل یک است؛ ارزش کار انجام‌شده به برنامه رسیده است.'}`,
      };
      break;
    case 'material':
      result = {
        value: v.amount * (1 + v.waste / 100),
        extra: [['هزینه خرید برآوردی', v.amount * (1 + v.waste / 100) * v.price, 'تومان']],
        explanation:
          'این فرمول، پرت را به صورت درصدی از مقدار خالص اضافه می‌کند. درصد واقعی پرت به جنس مصالح، روش اجرا و شرایط پروژه بستگی دارد.',
      };
      break;
    case 'schedule':
      if (
        !Number.isInteger(v.planned) ||
        !Number.isInteger(v.done) ||
        v.planned < 1 ||
        v.done > v.planned
      ) {
        return {
          error:
            'تعداد کارها باید عدد صحیح باشد و تعداد تکمیل‌شده از تعداد برنامه‌ریزی‌شده بیشتر نباشد.',
        };
      }
      result = {
        value: (v.done / v.planned) * 100,
        extra: [['کارهای باقی‌مانده', v.planned - v.done, 'کار']],
        explanation:
          'هر کار تکمیل‌شده یک تعهد انجام‌شده است. کارهای باقی‌مانده را در برنامه نوبت بعد بررسی کن.',
      };
      break;
  }
  if (![result.value, ...result.extra.map(([, value]) => value)].every(Number.isFinite)) {
    return { error: 'نتیجه خارج از محدوده محاسبه است. مقدارهای کوچک‌تری وارد کن.' };
  }
  return { result };
}
