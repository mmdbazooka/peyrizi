import { ArrowLeft, Info, Layers3 } from 'lucide-react';
import React from 'react';
import { fa } from '../domain/locale';

export function StructureDiagram({
  type = 'structure',
}: {
  type?: import('../domain/types').DiagramType;
}) {
  return (
    <figure className="diagram">
      <svg
        viewBox="0 0 680 265"
        role="img"
        aria-label={
          type === 'pipeline'
            ? 'توالی اجرای لوله، تست، پوشش و نازک‌کاری'
            : 'شماتیک انتقال بار از سقف به ستون و فونداسیون'
        }
      >
        {type === 'pipeline' ? (
          <>
            <defs>
              <marker
                id="arrowD"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M0 0L10 5L0 10" fill="#7c8867" />
              </marker>
            </defs>
            {[80, 245, 410, 575].map((x, i) => (
              <g key={x}>
                <rect
                  x={x - 58}
                  y="84"
                  width="116"
                  height="88"
                  rx="14"
                  fill={i === 1 ? '#e4e9db' : '#f5f4ee'}
                  stroke="#b3bba6"
                  strokeWidth="1.4"
                />
                <text
                  x={x}
                  y="117"
                  textAnchor="middle"
                  fontSize="22"
                  fill="#7b8862"
                  fontFamily="Vazirmatn Variable"
                >
                  {fa(i + 1)}
                </text>
                <text
                  x={x}
                  y="146"
                  textAnchor="middle"
                  fontSize="13"
                  fill="#3e4936"
                  fontFamily="Vazirmatn Variable"
                >
                  {['لوله‌کشی', 'تست و تأیید', 'پوشش', 'نازک‌کاری'][i]}
                </text>
                {i < 3 && (
                  <path
                    d={`M${x + 64} 128h30`}
                    stroke="#7c8867"
                    strokeWidth="2"
                    markerEnd="url(#arrowD)"
                  />
                )}
              </g>
            ))}
          </>
        ) : (
          <>
            <defs>
              <pattern id="gridD" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M22 0H0V22" fill="none" stroke="#dfe3d8" strokeWidth=".6" />
              </pattern>
              <pattern id="soilD" width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M0 14L14 0" stroke="#ddd4bf" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="680" height="265" fill="url(#gridD)" />
            <path d="M100 220H580V255H100z" fill="url(#soilD)" />
            <path d="M140 207H540V228H140z" fill="#bdc69e" stroke="#697953" strokeWidth="2" />
            <path
              d="M180 207V61h24v146m272 0V61h24v146"
              fill="#dce1d1"
              stroke="#7f8d6b"
              strokeWidth="2"
            />
            <path
              d="M160 55H520V72H160zM160 122H520V139H160z"
              fill="#d5dcc8"
              stroke="#7f8d6b"
              strokeWidth="2"
            />
            {[260, 340, 420].map((x) => (
              <g key={x}>
                <path d={`M${x} 22v23m-4-5 4 5 4-5`} fill="none" stroke="#b38f58" strokeWidth="2" />
              </g>
            ))}
            <path
              d="M100 216h36m410 0h32M502 100h76M522 60h56"
              stroke="#8b937f"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <text x="610" y="65" textAnchor="middle" fontSize="13" fill="#4f5b44">
              سقف
            </text>
            <text x="610" y="105" textAnchor="middle" fontSize="13" fill="#4f5b44">
              ستون
            </text>
            <text x="610" y="222" textAnchor="middle" fontSize="13" fill="#4f5b44">
              فونداسیون
            </text>
            <text x="340" y="253" textAnchor="middle" fontSize="11" fill="#978c72">
              خاک
            </text>
          </>
        )}
      </svg>
      <figcaption>
        <Info size={13} />
        شماتیک مفهومی آموزشی؛ بدون مقیاس و جزئیات اجرایی
      </figcaption>
    </figure>
  );
}
export function ConceptDiagram({ topic }: { topic: string }) {
  const diagrams: Record<string, { title: string; steps: [string, string][] }> = {
    finance: {
      title: 'از مقدار کار تا تصمیم مالی',
      steps: [
        ['مقدار', 'متره از نقشه'],
        ['نرخ واحد', 'قیمت هم‌مبنا'],
        ['هزینه', 'مقدار × نرخ'],
        ['کنترل', 'بودجه و واقعیت'],
      ],
    },
    project: {
      title: 'چرخه ساده برنامه‌ریزی و کنترل',
      steps: [
        ['تعریف', 'خروجی مشخص'],
        ['برنامه', 'زمان و مسئول'],
        ['اجرا', 'منابع آماده'],
        ['کنترل', 'سنجش و اصلاح'],
      ],
    },
    people: {
      title: 'چهار قدم یک گفت‌وگوی سازنده',
      steps: [
        ['مشاهده', 'واقعیت بدون قضاوت'],
        ['شنیدن', 'درک مانع و نیاز'],
        ['توافق', 'اقدام و مسئول'],
        ['پیگیری', 'بررسی نتیجه'],
      ],
    },
    commerce: {
      title: 'از نیاز تا یک خرید قابل‌اعتماد',
      steps: [
        ['نیاز', 'مشخصات روشن'],
        ['استعلام', 'مقایسه هم‌مبنا'],
        ['توافق', 'تعهد مکتوب'],
        ['تحویل', 'کنترل و تأیید'],
      ],
    },
    business: {
      title: 'منطق یک کسب‌وکار پایدار',
      steps: [
        ['مشتری', 'مسئله مشخص'],
        ['ارزش', 'راه‌حل معتبر'],
        ['درآمد', 'مدل سودآور'],
        ['رشد', 'اندازه‌گیری و بهبود'],
      ],
    },
  };
  const content = diagrams[topic];
  if (!content) return null;
  return (
    <figure className="concept-diagram">
      <div className="concept-title">
        <Layers3 size={16} />
        {content.title}
      </div>
      <div className="concept-steps">
        {content.steps.map(([title, desc], i) => (
          <React.Fragment key={title}>
            <div>
              <span>{fa(i + 1)}</span>
              <strong>{title}</strong>
              <small>{desc}</small>
            </div>
            {i < 3 && <ArrowLeft size={18} />}
          </React.Fragment>
        ))}
      </div>
      <figcaption>مدل مفهومی برای مرور و به‌کارگیری آموخته‌ها</figcaption>
    </figure>
  );
}
