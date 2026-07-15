import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAdminDataStore } from './admin-data.js';
import {
  createPageFeedbackStore,
  createRequestMetrics,
  createSetupDoctorFeedbackStore
} from './admin.js';

test('restores traffic and anonymous feedback after reopening the database', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'nuvio-admin-data-'));
  const file = join(directory, 'admin-data.sqlite');
  let persistence = null;
  t.after(() => {
    try {
      persistence?.close();
    } catch {
      // The store may already have been closed by the restart simulation.
    }
    rmSync(directory, { recursive: true, force: true });
  });

  let now = Date.parse('2026-07-15T12:00:00.000Z');
  persistence = createAdminDataStore({ file });
  const firstKey = persistence.anonymizationKey.toString('hex');
  const metrics = createRequestMetrics({ now: () => now, persistence });
  const doctorFeedback = createSetupDoctorFeedbackStore({
    now: () => now,
    maxEntries: 2,
    persistence
  });
  const pageFeedback = createPageFeedbackStore({
    now: () => now,
    maxEntries: 2,
    persistence
  });

  metrics.recordRequest({
    method: 'GET',
    routeTemplate: '/api/status',
    path: '/api/status?token=must-not-be-saved',
    statusCode: 200,
    durationMs: 12,
    clientIp: '203.0.113.10',
    userAgent: 'Private Browser'
  });
  const doctorPayload = {
    areaId: 'playback',
    area: 'Playback',
    platformId: 'android-tv',
    platform: 'Android TV',
    symptomId: 'buffering',
    symptom: 'Streams keep buffering',
    page: '/setup-doctor',
    answers: [{ id: 'vpn', label: 'Does it work without VPN?', value: 'No' }],
    results: [{ id: 'network-buffering', label: 'Check the connection' }]
  };
  doctorFeedback.record({ ...doctorPayload, helpful: true });
  pageFeedback.record({ helpful: false, page: '/faq?source=footer', title: 'FAQ' });

  persistence.close();
  persistence = createAdminDataStore({ file });
  assert.equal(persistence.anonymizationKey.toString('hex'), firstKey);

  const restoredMetrics = createRequestMetrics({ now: () => now, persistence });
  const restoredDoctorFeedback = createSetupDoctorFeedbackStore({
    now: () => now,
    maxEntries: 2,
    persistence
  });
  const restoredPageFeedback = createPageFeedbackStore({
    now: () => now,
    maxEntries: 2,
    persistence
  });

  assert.equal(restoredMetrics.snapshot().summary.requests, 1);
  assert.equal(restoredMetrics.snapshot().summary.uniqueClientsLast24Hours, 1);
  assert.equal(restoredDoctorFeedback.snapshot().summary.total, 1);
  assert.equal(restoredDoctorFeedback.snapshot().recent[0].symptom.id, 'buffering');
  assert.equal(restoredPageFeedback.snapshot().summary.total, 1);
  assert.equal(restoredPageFeedback.snapshot().byPage[0].page, '/faq');

  now += 1_000;
  restoredMetrics.recordRequest({
    method: 'GET',
    routeTemplate: '/api/status',
    path: '/api/status',
    statusCode: 200,
    durationMs: 8,
    clientIp: '203.0.113.10',
    userAgent: 'Private Browser'
  });
  const snapshot = restoredMetrics.snapshot();
  assert.equal(snapshot.summary.requests, 2);
  assert.equal(snapshot.summary.uniqueClientsLast24Hours, 1);
  const serialized = JSON.stringify({
    traffic: persistence.loadRequestMetrics(),
    doctor: persistence.loadSetupDoctorFeedback(2),
    pages: persistence.loadPageFeedback(2)
  });
  assert.equal(serialized.includes('203.0.113.10'), false);
  assert.equal(serialized.includes('Private Browser'), false);
  assert.equal(serialized.includes('must-not-be-saved'), false);
});

test('keeps feedback retention limits durable across restarts', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'nuvio-admin-retention-'));
  const file = join(directory, 'admin-data.sqlite');
  let persistence = createAdminDataStore({ file });
  t.after(() => {
    try {
      persistence?.close();
    } catch {
      // The store may already have been closed by the restart simulation.
    }
    rmSync(directory, { recursive: true, force: true });
  });

  let now = Date.parse('2026-07-15T13:00:00.000Z');
  const feedback = createPageFeedbackStore({ now: () => now, maxEntries: 2, persistence });
  feedback.record({ helpful: true, page: '/first' });
  now += 1_000;
  feedback.record({ helpful: false, page: '/second' });
  now += 1_000;
  feedback.record({ helpful: true, page: '/third' });

  persistence.close();
  persistence = createAdminDataStore({ file });
  const restored = createPageFeedbackStore({ now: () => now, maxEntries: 2, persistence });
  assert.deepEqual(
    restored.snapshot().recent.map((entry) => entry.page),
    ['/third', '/second']
  );
});

test('bounds the durable traffic history to the configured entry limit', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'nuvio-admin-traffic-retention-'));
  const file = join(directory, 'admin-data.sqlite');
  let persistence = createAdminDataStore({ file, maxTrafficEntries: 2 });
  t.after(() => {
    try {
      persistence?.close();
    } catch {
      // The store may already have been closed by the restart simulation.
    }
    rmSync(directory, { recursive: true, force: true });
  });

  let now = Date.parse('2026-07-15T14:00:00.000Z');
  const metrics = createRequestMetrics({ now: () => now, persistence });
  for (const route of ['/first', '/second', '/third']) {
    metrics.recordRequest({
      method: 'GET',
      routeTemplate: route,
      path: route,
      statusCode: 200,
      durationMs: 1
    });
    now += 1_000;
  }

  persistence.close();
  persistence = createAdminDataStore({ file, maxTrafficEntries: 2 });
  const restored = createRequestMetrics({ now: () => now, persistence }).snapshot();
  assert.equal(restored.summary.requests, 3);
  assert.deepEqual(
    restored.recentRequests.map((entry) => entry.endpoint),
    ['/second', '/third']
  );
});
