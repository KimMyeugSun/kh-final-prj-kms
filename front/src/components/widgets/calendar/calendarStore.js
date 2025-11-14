import { useContext } from 'react';
import { AuthContext } from '../../../auth/AuthContext';

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function nowIsoDateOnly(d) {
  const x = new Date(d || new Date());
  // toISOString 대신 yyyy-mm-dd 문자열 반환
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, '0');
  const dd = String(x.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`; // "2025-09-30"
}

const PER_USER = 'calendar.events';

export function useCurrentUserId() {
  const { getEmpNo } = useContext(AuthContext);
  return getEmpNo() ? String(getEmpNo()) : null;
}

export function keyForUser(uid) {
  return `${PER_USER}:${uid}`;
}

const listeners = new Set();

export function loadCalendarEvents(uid) {
  const raw = localStorage.getItem(keyForUser(uid));
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveCalendarEvents(list = [], uid) {
  localStorage.setItem(keyForUser(uid), JSON.stringify(list || []));
  const snap = clone(list || []);
  for (const fn of listeners) {
    try {
      fn(snap);
    } catch {}
  }
}

export function addCalendarEvent(evt, uid) {
  const id = evt?.id || crypto.randomUUID();
  const norm = {
    id,
    title: String(evt?.title ?? ''),
    // start/end는 Date 객체로 저장
    start: evt?.start ? new Date(evt.start) : new Date(),
    end: evt?.end ? new Date(evt.end) : new Date(),
    allDay: !!evt?.allDay,
    type: String(evt?.type ?? ''),
    meta: evt?.meta ? clone(evt.meta) : {},
  };

  const list = loadCalendarEvents(uid);
  list.push(norm);
  saveCalendarEvents(list, uid);
  return id;
}

export function updateCalendarEvent(id, patch = {}, uid) {
  const list = loadCalendarEvents(uid);
  const idx = list.findIndex((e) => e.id === id);
  if (idx < 0) return false;

  const next = { ...list[idx] };
  if ('title' in patch) next.title = String(patch.title ?? '');
  if ('start' in patch)
    next.start = patch.start ? new Date(patch.start).toISOString() : next.start;
  if ('end' in patch)
    next.end = patch.end ? new Date(patch.end).toISOString() : next.end;
  if ('allDay' in patch) next.allDay = !!patch.allDay;
  if ('type' in patch) next.type = String(patch.type ?? '');
  if ('meta' in patch)
    next.meta = { ...(next.meta || {}), ...(patch.meta || {}) };

  list[idx] = next;
  saveCalendarEvents(list, uid);
  return true;
}

export function removeCalendarEvent(id, uid) {
  const list = loadCalendarEvents(uid);
  const next = list.filter((e) => e.id !== id);
  saveCalendarEvents(next, uid);
}

export function removeEventsByDate(dateLike, typeFilter, uid) {
  const d = new Date(dateLike || new Date());
  const dayStart = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ).getTime();

  const sameDay = (iso) => {
    const x = new Date(iso);
    return (
      new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime() ===
      dayStart
    );
  };

  const list = loadCalendarEvents(uid);
  const next = list.filter((e) => {
    const same = sameDay(e.start);
    const typeOk = typeFilter
      ? String(e.type).toLowerCase() === String(typeFilter).toLowerCase()
      : true;
    return !(same && typeOk);
  });
  saveCalendarEvents(next, uid);
}

export function subscribeCalendar(callback, uid) {
  listeners.add(callback);
  try {
    callback(clone(loadCalendarEvents(uid)));
  } catch {}
  return () => listeners.delete(callback);
}

export function clearAllCalendarEventsForCurrentUser(uid) {
  localStorage.setItem(keyForUser(uid), JSON.stringify([]));
  for (const fn of listeners) {
    try {
      fn([]);
    } catch {}
  }
}

export function getTodayEvents(uid) {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  const events = loadCalendarEvents(uid);
  return events.filter((evt) => {
    const start = new Date(evt.start);
    return (
      start.getFullYear() === y &&
      start.getMonth() === m &&
      start.getDate() === d
    );
  });
}
