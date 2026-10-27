import test from 'node:test';
import assert from 'node:assert/strict';
import { TIME_RANGES, formatDate, formatTime, formatExportDate, formatBucketLabel, formatDuration, formatPercent, bucketDate, rangeStart, endpoint, pageName, mergeReferrers, rankTransitions, toCsv, protectedProjectAccess } from '../src/components/admin/adminModel.ts';

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

test('one-hour range replaces 90 days and requests quarter-hour intervals', () => {
  assert.deepEqual(TIME_RANGES.map(range => range.value), ['1h', '8h', '24h', '7d', '30d']);
  assert.equal(TIME_RANGES[0].granularity, '15min');
  assert.equal(rangeStart('1h', Date.parse('2026-10-19T00:15:01Z')), '2026-10-18T23:15:00.000Z');
  assert.equal(TIME_RANGES.find(range => range.value === '8h').granularity, 'hour');
  assert.equal(rangeStart('8h', Date.parse('2026-10-19T00:15:01Z')), '2026-10-18T16:15:00.000Z');
});
test('protected-page visits and project clicks never imply a successful unlock', () => {
  assert.deepEqual(protectedProjectAccess({
    pageViews: [{ path: '/project/ai-assistant/' }, { path: '/project/ai-assistant' }, { path: '/zh/project/vcf-network/?source=work' }, { path: '/about' }],
    interactions: [{ type: 'project_view', target: 'ai-assistant', path: '/', created_at: '2026-10-19T09:15:00Z' }, { type: 'click', target: 'other', path: '/project/ai-assistant', created_at: '2026-10-19T09:16:00Z' }],
  }), [{ path: '/project/ai-assistant', unlockedAt: null }, { path: '/zh/project/vcf-network', unlockedAt: null }]);
});
test('successful unlocks retain their project and latest timestamp, even if a page view was lost', () => {
  const action = (path, created_at) => ({ type: 'click', target: 'project_unlock', path, created_at });
  assert.deepEqual(protectedProjectAccess({ pageViews: [], interactions: [
    action('/zh/project/ai-assistant/', '2026-10-19T09:17:00Z'),
    action('/zh/project/ai-assistant', '2026-10-19T09:16:00Z'),
    action('/zh/project/ai-assistant', 'invalid'),
    action('/project/vcf-network', '2026-10-19T09:18:00Z'),
    action('/about', '2026-10-19T09:19:00Z'),
  ] }), [{ path: '/zh/project/ai-assistant', unlockedAt: '2026-10-19T09:17:00Z' }, { path: '/project/vcf-network', unlockedAt: '2026-10-19T09:18:00Z' }]);
});
test('PST timestamps use UTC minus eight in both winter and summer', () => {
  assert.equal(formatDate('2026-01-01T04:15:00Z'), 'Dec 31, 8:15 PM');
  assert.equal(formatTime('2026-07-01T04:15:00Z'), '8:15 PM');
  assert.equal(formatExportDate('2026-07-01T04:15:00Z'), '2026-06-30T20:15:00.000-08:00');
  assert.equal(new Date(formatExportDate('2026-07-01T04:15:00Z')).toISOString(), '2026-07-01T04:15:00.000Z');
  assert.equal(formatBucketLabel('2026-10-19T00:15'), 'Oct 18, 4:15 PM');
  assert.equal(formatBucketLabel('2026-10-19T00:15', true), '4:15 PM');
  assert.equal(formatBucketLabel('2026-10-19'), 'Oct 18, 4:00 PM');
});
