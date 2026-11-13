import { test, expect } from '@playwright/test';
import { questions, numberValue, startingState } from '../src/data.js';

const readState = page => page.evaluate(() => JSON.parse(localStorage.getItem('peyrizi-v1')));

test('dashboard, course filters and global search expose real lesson routes', async ({page}) => {
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/سلام همراه/})).toBeVisible();
 await expect(page.locator('.home-courses .course-card')).toHaveCount(3);
 expect(await page.locator('.hero-photo').evaluate(async el=>{const url=getComputedStyle(el).backgroundImage.slice(5,-2);const r=await fetch(url);return r.ok;})).toBeTruthy();
 await page.getByRole('button',{name:'مشاهده همه مسیرها'}).click();
 await expect(page.locator('.all-courses .course-card')).toHaveCount(8);
 await page.locator('.tabs').getByRole('button',{name:'مدیریت بازرگانی',exact:true}).click();
 await expect(page.locator('.all-courses .course-card')).toHaveCount(3);
 await page.getByRole('textbox',{name:'جستجوی دوره'}).fill('مالی');
 await expect(page.locator('.all-courses .course-card')).toHaveCount(1);
 await page.getByRole('textbox',{name:'جستجو در درس‌ها'}).fill('نقشه‌خوانی');
 await page.locator('.search-results button').first().click();
 await expect(page).toHaveURL(/lesson\/construction-2/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('نقشه‌خوانی؛ زبان مشترک پروژه');
 expect(errors).toEqual([]);
});

test('completing a lesson records time once and notes, exercise, goal and bookmarks survive reload', async ({page}) => {
 await page.goto('/#lesson/construction-1');
 await page.getByRole('textbox',{name:'پاسخ تمرین درس'}).fill('استعلام کاربری و گزارش خاک را از مرجع معتبر دریافت می‌کنم.');
 await page.getByRole('button',{name:'ذخیره درس',exact:true}).click();
 await page.getByRole('button',{name:'مطالعه کردم و یاد گرفتم'}).click();
 await page.getByRole('button',{name:'یادداشت من',exact:true}).click();
 await page.getByRole('textbox',{name:'یادداشت درس',exact:true}).fill('پیش از خرید زمین، هزینه دسترسی و انشعاب را بررسی کنم.');
 await page.getByRole('button',{name:'ذخیره یادداشت',exact:true}).click();
 await page.reload();
 await expect(page.getByRole('button',{name:'درس تکمیل شده'})).toBeDisabled();
 await expect(page.getByRole('textbox',{name:'پاسخ تمرین درس'})).toHaveValue(/استعلام کاربری/);
 let state=await readState(page);
 expect(state.completed).toEqual(['construction-1']);
 expect(Object.values(state.activity).reduce((a,b)=>a+b,0)).toBe(12);
 expect(state.notes['construction-1']).toContain('پیش از خرید');
 await page.goto('/#dashboard');
 await expect(page.locator('.weekly-numbers strong')).toContainText('۱');
 await page.goto('/#saved');
 await expect(page.locator('.saved-lesson')).toHaveCount(1);
 await page.goto('/#notes');
 await expect(page.locator('.note-card')).toHaveCount(1);
 await page.getByRole('button',{name:'ویرایش یادداشت'}).click();
 await page.getByRole('textbox',{name:'ویرایش متن یادداشت'}).fill('نسخه تازه یادداشت');
 await page.getByRole('button',{name:'ذخیره تغییرات'}).click();
 await page.reload();
 await expect(page.locator('.note-card>p')).toHaveText('نسخه تازه یادداشت');
});

test('numeric Persian input and incorrect answers are graded and persisted correctly', async ({page}) => {
 await page.goto('/#practice');
 await page.locator('.question-bank-item').filter({hasText:'حجم بتن یک پی'}).click();
 await page.getByRole('textbox',{name:'پاسخ محاسبه تو'}).fill('۴۰');
 await page.getByRole('button',{name:'ثبت و بررسی پاسخ'}).click();
 await expect(page.locator('.answer-feedback')).toContainText('درست بود');
 await page.getByRole('button',{name:'دیدن نتیجه'}).click();
 await expect(page.locator('.result-score')).toContainText('۱۰۰');
 await page.getByRole('button',{name:'تمرین بیشتر'}).click();
 await page.locator('.question-bank-item').filter({hasText:'دو کارگر درباره ترتیب استفاده'}).click();
 await page.getByRole('button',{name:/جریمه هر دو نفر/}).click();
 await page.getByRole('button',{name:'ثبت و بررسی پاسخ'}).click();
 await expect(page.locator('.answer-feedback')).toContainText('بیا با هم مرور کنیم');
 expect((await readState(page)).attempts.map(a=>a.score)).toEqual([100,0]);
});

test('essay scores clearly identify self assessment and save the written answer', async ({page}) => {
 await page.goto('/#practice');
 await page.locator('.question-bank-item').filter({hasText:'یک پیمانکار سه روز از برنامه عقب'}).click();
 await page.getByRole('textbox',{name:'پاسخ تشریحی'}).fill('تاریخ ابلاغ و گزارش را بررسی می‌کنم، اثر تأخیر را بر برنامه می‌سنجم و برای جبران با مسئول اجرا توافق می‌کنم.');
 for(const checkbox of await page.getByRole('checkbox').all()) await checkbox.check();
 await page.getByRole('button',{name:'ثبت و بررسی پاسخ'}).click();
 await expect(page.locator('.answer-feedback')).toContainText('خودارزیابی تو');
 const state=await readState(page);
 expect(state.attempts[0].selfAssessed).toBeTruthy();
 expect(state.attempts[0].answer).toContain('تاریخ ابلاغ');
});

test('ten-question mixed exam completes with genuine answers and a score', async ({page}) => {
 await page.goto('/#practice');
 await page.getByRole('button',{name:/آزمون ترکیبی.*۱۰ سؤال/}).click();
 await page.getByRole('button',{name:'شروع آزمون ترکیبی'}).click();
 for(let i=0;i<10;i++){
  const title=await page.locator('.question-panel h1').innerText();
  const q=questions.find(q=>q.title===title); expect(q).toBeTruthy();
  if(q.options)await page.locator('.answer-option').nth(q.answer).click();
  else if(q.type==='numeric')await page.getByRole('textbox',{name:'پاسخ محاسبه تو'}).fill(String(q.answer));
  else {await page.getByRole('textbox',{name:'پاسخ تشریحی'}).fill('پاسخ با بررسی مستندات، مسئولیت روشن، کنترل اثر و پیگیری نتیجه تدوین می‌شود.');for(const checkbox of await page.getByRole('checkbox').all())await checkbox.check();}
  await page.getByRole('button',{name:'ثبت و بررسی پاسخ'}).click();
  await page.getByRole('button',{name:i===9?'دیدن نتیجه':'سؤال بعدی'}).click();
 }
 await expect(page.locator('.result-score')).toContainText('۱۰۰');
 expect((await readState(page)).attempts).toHaveLength(10);
});

test('all five calculators use their stated formulas and reject empty inputs', async ({page}) => {
 await page.goto('/#workshop');
 await page.getByRole('button',{name:'محاسبه و یادگیری'}).click();
 await expect(page.getByRole('alert')).toContainText('همه فیلدها');
 const cases=[['حجم و هزینه بتن',40],['سود و حاشیه سود',20],['جریان نقدی پروژه',40000000],['کنترل ارزش کسب‌شده',.8],['مصالح و پرت خرید',105]];
 for(const [label,expected] of cases){
  await page.locator('.calculator-nav').getByRole('button',{name:label}).click();
  await page.getByRole('button',{name:'پر کردن با مثال'}).click();
  await page.getByRole('button',{name:'محاسبه و یادگیری'}).click();
  const value=await page.locator('.calculated-value').evaluate(el=>el.firstChild.textContent);
  expect(numberValue(value)).toBe(expected);
 }
 await page.locator('.calculator-nav').getByRole('button',{name:'سود و حاشیه سود'}).click();
 await page.getByRole('textbox',{name:'مبلغ فروش'}).fill('۰');
 await page.getByRole('textbox',{name:'بهای تمام‌شده'}).fill('۱۰۰');
 await page.getByRole('button',{name:'محاسبه و یادگیری'}).click();
 await expect(page.getByRole('alert')).toContainText('بزرگ‌تر از صفر');
});

test('profile, theme, backups, safe import and deliberate reset work', async ({page},testInfo) => {
 await page.goto('/#settings');
 await page.getByRole('textbox',{name:'دوست داری چه صدایت کنیم؟'}).fill('آرمان');
 await page.getByRole('combobox',{name:'هدف هفتگی یادگیری'}).selectOption('3');
 await page.locator('form').getByRole('button',{name:'ذخیره تغییرات'}).click();
 await page.getByRole('button',{name:'تاریک',exact:true}).click();
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 expect((await readState(page)).name).toBe('آرمان');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'دریافت نسخه پشتیبان'}).click();
 const download=await downloadPromise;
 const path=testInfo.outputPath('backup.json');await download.saveAs(path);
 await page.locator('input[type=file]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await expect(page.getByRole('alert')).toContainText('معتبر');
 await page.locator('input[type=file]').setInputFiles(path);
 await expect(page.locator('.import-confirm')).toBeVisible();
 await page.getByRole('button',{name:'تأیید و بازیابی'}).click();
 await page.getByRole('button',{name:'پاک کردن اطلاعات یادگیری'}).click();
 await expect(page.getByRole('button',{name:'حذف داده‌ها و شروع دوباره'})).toBeDisabled();
 await page.getByRole('textbox',{name:'برای تأیید، عبارت «شروع دوباره» را بنویس.'}).fill('شروع دوباره');
 await page.getByRole('button',{name:'حذف داده‌ها و شروع دوباره'}).click();
 expect((await readState(page)).name).toBe('همراه');
});

test('all principal pages render on mobile without horizontal overflow and navigation closes', async ({page}) => {
 await page.setViewportSize({width:390,height:844});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['dashboard','courses','courses/construction','lesson/finance-1','practice','workshop','analytics','notes','saved','settings']){
  await page.goto(`/#${route}`);
  await expect(page.locator('main h1, main .empty-state h2').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
 await page.getByRole('button',{name:'باز کردن منو'}).click();
 await expect(page.locator('.sidebar')).toHaveClass(/open/);
 await page.locator('.sidebar').getByRole('link',{name:'پیشخوان',exact:true}).click();
 await expect(page.locator('.sidebar')).not.toHaveClass(/open/);
 expect(errors).toEqual([]);
});
