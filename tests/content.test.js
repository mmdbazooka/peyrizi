import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allLessons, courses, questions, numberValue, loadState, startingState } from '../src/data.js';

test('Persian and Arabic calculation inputs normalize without treating blanks as zero', () => {
  assert.equal(numberValue('۱۲۳٬۴۵۶٫۷۸'), 123456.78);
  assert.equal(numberValue('٠٫٨'), .8);
  assert.equal(numberValue(' -۲۵ '), -25);
  assert.ok(Number.isNaN(numberValue('')));
  assert.ok(Number.isNaN(numberValue('  ')));
  assert.ok(Number.isNaN(numberValue('بیست')));
});
test('lesson, course and quiz references are unique and complete', () => {
  assert.equal(allLessons.length, 48);
  assert.equal(new Set(allLessons.map(l => l.id)).size, allLessons.length);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const course of courses) {
    assert.equal(course.lessons.length, 6);
    assert.ok(course.lessons.every(l => l.points.length === 3 && l.example && l.task));
  }
  for (const question of questions) {
    assert.ok(question.explanation);
    if (question.options) assert.ok(question.options[question.answer]);
    if (question.type === 'numeric') assert.ok(Number.isFinite(question.answer));
    if (question.type === 'essay') assert.equal(question.rubric.length, 3);
  }
});
test('invalid or unavailable browser storage falls back to a usable empty profile', () => {
  global.localStorage = { getItem: () => '{broken' };
  assert.deepEqual(loadState(), startingState);
  global.localStorage = { getItem: () => { throw new Error('disabled'); } };
  assert.deepEqual(loadState(), startingState);
  delete global.localStorage;
});
