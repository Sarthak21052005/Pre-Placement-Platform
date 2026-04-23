import { useState, useRef, useCallback, useEffect } from "react";

/**
 * useStopwatch
 * ------------
 * Returns { time, isRunning, start, stop, reset, formatted }
 * `formatted` → "MM:SS.d"  e.g.  "01:23.4"
 *
 * FIX: accumulatedRef is now snapshotted inside the interval callback
 * so rapid start/stop cycles no longer drift.
 */
export function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startedAtRef = useRef(null);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    if (intervalRef.current) return; // already running
    startedAtRef.current = Date.now();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      // BUG FIX: read accumulatedRef.current inside callback (not closure capture)
      setTime(accumulatedRef.current + (Date.now() - startedAtRef.current));
    }, 100);
  }, []);

  const stop = useCallback(() => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    // BUG FIX: snapshot accumulated time before nulling startedAtRef
    accumulatedRef.current += Date.now() - startedAtRef.current;
    startedAtRef.current = null;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    accumulatedRef.current = 0;
    startedAtRef.current = null;
    setTime(0);
    setIsRunning(false);
  }, []);

  const formatted = (() => {
    const totalSec = Math.floor(time / 1000);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    const ds = String(Math.floor((time % 1000) / 100));
    return `${mm}:${ss}.${ds}`;
  })();

  return { time, isRunning, start, stop, reset, formatted };
}

/**
 * useTimer
 * --------
 * Countdown timer.
 * Returns { remaining, isRunning, isDone, start, stop, reset, setDuration, formatted }
 *
 * @param {number} initialMs - countdown duration in milliseconds (default 60000 = 1 min)
 */
export function useTimer(initialMs = 60000) {
  const [duration, setDuration] = useState(initialMs);
  const [remaining, setRemaining] = useState(initialMs);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const intervalRef = useRef(null);
  const startedAtRef = useRef(null);
  const remainingAtStartRef = useRef(initialMs);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    if (remaining <= 0) return; // already done
    startedAtRef.current = Date.now();
    remainingAtStartRef.current = remaining;
    setIsRunning(true);
    setIsDone(false);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      const newRemaining = Math.max(0, remainingAtStartRef.current - elapsed);
      setRemaining(newRemaining);
      if (newRemaining <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        setIsDone(true);
      }
    }, 100);
  }, [remaining]);

  const stop = useCallback(() => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    // Snapshot remaining time accurately
    const elapsed = Date.now() - startedAtRef.current;
    const snapped = Math.max(0, remainingAtStartRef.current - elapsed);
    remainingAtStartRef.current = snapped;
    setRemaining(snapped);
    startedAtRef.current = null;
    setIsRunning(false);
  }, []);

  const reset = useCallback((newDuration) => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    const ms = newDuration ?? duration;
    setDuration(ms);
    setRemaining(ms);
    remainingAtStartRef.current = ms;
    startedAtRef.current = null;
    setIsRunning(false);
    setIsDone(false);
  }, [duration]);

  const formatted = (() => {
    const totalSec = Math.ceil(remaining / 1000);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const ss = String(totalSec % 60).padStart(2, "0");
    const ds = String(Math.floor((remaining % 1000) / 100));
    return `${mm}:${ss}.${ds}`;
  })();

  return { remaining, isRunning, isDone, start, stop, reset, setDuration, formatted };
}