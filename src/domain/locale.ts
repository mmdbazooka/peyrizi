export const fa = (n: number, digits = 0) =>
  new Intl.NumberFormat('fa-IR', { maximumFractionDigits: digits }).format(n);
export const toEnglish = (value: string | number) =>
  String(value)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/٫/g, '.')
    .replace(/[٬,]/g, '');
export const numberValue = (value: string | number) => {
  const text = toEnglish(value).trim();
  return text === '' ? NaN : Number(text);
};
export const localDate = () =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tehran',
  }).format(new Date());

export function normalizeSearch(value: string) {
  return value
    .normalize('NFKC')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\s\u200c]+/g, ' ')
    .trim()
    .toLocaleLowerCase('fa-IR');
}
