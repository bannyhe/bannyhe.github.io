import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, formatPercent, bucketDate, rangeStart, endpoint, pageName, mergeReferrers, rankTransitions, toCsv } from '../src/components/admin/adminModel.ts';

test('missing measurements stay distinct from zero and duration rounds across minutes', () => {
  assert.equal(formatDuration(null), '—'); assert.equal(formatDuration(0), '0s');
  assert.equal(formatDuration(59999), '1m 0s'); assert.equal(formatPercent(null), '—');
  assert.equal(formatPercent(0), '0%'); assert.equal(formatPercent(1.2), '100%');
});
test('timeline buckets parse in UTC regardless of the host time zone', () => {
  assert.equal(bucketDate('2026-10-19').toISOString(), '2026-10-19T00:00:00.000Z');
  assert.equal(bucketDate('2026-10-19T09').toISOString(), '2026-10-19T09:00:00.000Z');
  assert.equal(bucketDate('2026-10-19T09:15').toISOString(), '2026-10-19T09:15:00.000Z');
});
test('filter URLs use stable minute boundaries and safely encode location names', () => {
  const a = Date.parse('2026-10-19T09:15:01Z');
  assert.equal(rangeStart('24h', a), '2026-10-18T09:15:00.000Z');
  assert.equal(rangeStart('30d', a), rangeStart('30d', a + 20000));
  const url = new URL(endpoint('visitors', rangeStart('7d', a), { location: 'A&B, C', page: 2 }), 'https://example.test');
  assert.equal(url.searchParams.get('location'), 'A&B, C'); assert.equal(url.searchParams.get('page'), '2');
});
test('labels handle old hash routes and query strings without changing export paths', () => {
  assert.equal(pageName('/#/project/ai-assistant'), 'Network AI Assistant');
  assert.equal(pageName('/resume/?utm_source=test'), 'Résumé');
});
test('sources merge by host without exposing referral query strings', () => {
  assert.deepEqual(mergeReferrers([{ referrer: 'https://www.example.com/a?private=1', visitors: 2 }, { referrer: 'https://example.com/b', visitors: 3 }]), [{ name: 'example.com', count: 5 }]);
});
test('navigation paths preserve cycles and ignore invalid node references', () => {
  assert.deepEqual(rankTransitions({ nodes: [{name: '/a'}, {name: '/b'}], links: [{source:0,target:1,value:2},{source:1,target:0,value:3},{source:9,target:0,value:8}] }), [{from:'/b',to:'/a',count:3},{from:'/a',to:'/b',count:2}]);
});
test('CSV preserves quoted multiline values and neutralizes spreadsheet formulas', () => {
  assert.equal(toCsv([['a,"b"', 'line1\nline2', '=1+1', ' +SUM(A1)', -3, null]]), '\"a,\"\"b\"\"\",\"line1\nline2\",\"\'=1+1\",\"\' +SUM(A1)\",\"-3\",\"\"');
});
