import { Calculator, ChevronLeft, Lightbulb, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { PageHeading } from '../components/ui';
import { calculateEstimate, calculators, type CalculatorResult } from '../domain/calculators';
import { fa } from '../domain/locale';

export function Workshop() {
  const [active, setActive] = useState('concrete');
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState('');
  const calc = calculators.find((c) => c.id === active) ?? calculators[0];
  const change = (id: string) => {
    setActive(id);
    setResult(null);
    setError('');
    setValues({});
  };
  const calculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const outcome = calculateEstimate(calc, values);
    setError('error' in outcome ? outcome.error : '');
    setResult('result' in outcome ? outcome.result : null);
  };
  return (
    <>
      <PageHeading
        eyebrow="عددها را بفهم، بهتر تصمیم بگیر"
        title="کارگاه محاسبات"
        description="یک مسئله واقعی را با عددهای خودت امتحان کن؛ فرمول و تفسیر نتیجه را هم یاد بگیر."
      />
      <div className="workshop-layout">
        <nav className="calculator-nav" aria-label="نوع محاسبه">
          {calculators.map((c) => (
            <button
              key={c.id}
              className={active === c.id ? 'active' : ''}
              onClick={() => change(c.id)}
            >
              <c.icon size={21} />
              <span>{c.title}</span>
              <ChevronLeft size={15} />
            </button>
          ))}
        </nav>
        <section className="panel calculator-panel">
          <div className="calculator-title">
            <span className="soft-icon olive">
              <calc.icon size={26} />
            </span>
            <div>
              <h2>{calc.title}</h2>
              <p>{calc.subtitle}</p>
            </div>
            <button
              className="icon-button"
              aria-label="پاک کردن محاسبه"
              onClick={() => {
                setValues({});
                setResult(null);
                setError('');
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <div className="formula-box">
            <span>رابطه‌ای که استفاده می‌کنیم</span>
            <strong>{calc.formula}</strong>
          </div>
          <form onSubmit={calculate}>
            <div className="calculator-fields">
              {calc.fields.map(([id, label, unit, placeholder]) => (
                <label key={id}>
                  {label}
                  <div>
                    <input
                      inputMode="decimal"
                      dir="ltr"
                      aria-label={label}
                      placeholder={placeholder}
                      value={values[id] || ''}
                      onChange={(e) => {
                        setValues({ ...values, [id]: e.target.value });
                        setResult(null);
                      }}
                    />
                    <span>{unit}</span>
                  </div>
                </label>
              ))}
            </div>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary" type="submit">
              <Calculator size={17} />
              محاسبه و یادگیری
            </button>
            <button
              className="button text-button"
              type="button"
              onClick={() => {
                setValues(Object.fromEntries(calc.fields.map(([id, , , value]) => [id, value])));
                setResult(null);
                setError('');
              }}
            >
              پر کردن با مثال
            </button>
          </form>
          {result && (
            <div className="calculator-result" role="status">
              <span className="eyebrow">نتیجه محاسبه</span>
              <h3>{calc.result}</h3>
              <div className="calculated-value">
                {fa(result.value, 2)}
                <small>{calc.unit}</small>
              </div>
              {result.extra.map(([l, v, u]) => (
                <div className="extra-result" key={l}>
                  <span>{l}</span>
                  <strong>
                    {fa(v, 2)} <small>{u}</small>
                  </strong>
                </div>
              ))}
              <div className="result-explanation">
                <Lightbulb size={20} />
                <p>{result.explanation}</p>
              </div>
            </div>
          )}
        </section>
        <aside className="calculator-guide">
          <div className="small-tip">
            <Lightbulb size={28} />
            <h3>قبل از محاسبه</h3>
            <p>واحدها را یکسان کن. اعداد هزینه را همگی به تومان وارد کن و فرض‌هایت را بنویس.</p>
            <hr />
            <h4>این یک ابزار یادگیری است.</h4>
            <p>
              نتیجه برای برآورد مقدماتی است؛ قیمت‌ها فرضی‌اند و جای متره دقیق، طراحی یا مشاوره تخصصی
              را نمی‌گیرند.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
