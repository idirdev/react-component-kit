'use strict';

/**
 * @file hooks.js
 * @description Pure-JS implementations of common React-like hook patterns.
 *   These are standalone utilities — no React dependency required.
 * @module react-component-kit/hooks
 * @author idirdev
 */

/**
 * Mimics React useState — returns a [getter, setter] pair backed by a closure.
 *
 * @template T
 * @param {T} initial - Initial state value.
 * @returns {[() => T, (v: T | ((prev: T) => T)) => void]}
 */
function useState(initial) {
  let state = initial;
  const get = () => state;
  const set = (v) => { state = typeof v === 'function' ? v(state) : v; };
  return [get, set];
}

/**
 * Mimics React useReducer.
 *
 * @template S, A
 * @param {(state: S, action: A) => S} reducer
 * @param {S} initial
 * @returns {[() => S, (action: A) => void]}
 */
function useReducer(reducer, initial) {
  let state = initial;
  const getState = () => state;
  const dispatch = (action) => { state = reducer(state, action); };
  return [getState, dispatch];
}

/**
 * Mimics React useRef — a stable mutable container.
 *
 * @template T
 * @param {T} initial - Initial ref value.
 * @returns {{ current: T }}
 */
function useRef(initial) {
  return { current: initial };
}

/**
 * Mimics React useMemo — caches fn() result and recomputes when deps change.
 *
 * @template T
 * @param {() => T} fn   - Factory function.
 * @param {any[]}   deps - Dependency array.
 * @returns {() => T} Accessor that returns the memoized value.
 */
function useMemo(fn, deps) {
  let cached;
  let prevDeps;
  let computed = false;

  return function get() {
    const depsChanged = !computed || !prevDeps ||
      deps.length !== prevDeps.length ||
      deps.some((d, i) => d !== prevDeps[i]);

    if (depsChanged) {
      cached = fn();
      prevDeps = deps.slice();
      computed = true;
    }
    return cached;
  };
}

/**
 * Creates a debounced version of fn that delays invocation by delay ms.
 * The returned function has a .cancel() method.
 *
 * @param {Function} fn    - Function to debounce.
 * @param {number}   delay - Delay in milliseconds.
 * @returns {Function & { cancel: () => void }}
 */
function useDebounce(fn, delay) {
  let timer = null;
  const debounced = function (...args) {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, delay);
  };
  debounced.cancel = () => { if (timer !== null) { clearTimeout(timer); timer = null; } };
  return debounced;
}

/**
 * Creates a throttled version of fn that fires at most once per limit ms.
 *
 * @param {Function} fn    - Function to throttle.
 * @param {number}   limit - Minimum ms between invocations.
 * @returns {Function}
 */
function useThrottle(fn, limit) {
  let lastRan = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRan >= limit) {
      lastRan = now;
      return fn(...args);
    }
  };
}

/**
 * Persists a value to localStorage with JSON serialization.
 *
 * @param {string} key     - localStorage key.
 * @param {any}    initial - Default value if key is absent.
 * @returns {{ get: () => any, set: (v: any) => void, remove: () => void }}
 */
function useLocalStorage(key, initial) {
  const get = () => {
    try {
      const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(key) : null;
      return raw !== null ? JSON.parse(raw) : initial;
    } catch { return initial; }
  };
  const set = (v) => {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, JSON.stringify(v)); } catch {}
  };
  const remove = () => {
    try { if (typeof localStorage !== 'undefined') localStorage.removeItem(key); } catch {}
  };
  return { get, set, remove };
}

/**
 * Tracks whether a toggle is on or off, with helper methods.
 *
 * @param {boolean} initial - Starting state.
 * @returns {{ value: () => boolean, toggle: () => void, set: (v: boolean) => void }}
 */
function useToggle(initial = false) {
  let state = initial;
  return {
    value:  () => state,
    toggle: () => { state = !state; },
    set:    (v) => { state = Boolean(v); },
  };
}

/**
 * Wraps an async function and returns {data, error, loading} on each call.
 *
 * @param {Function} asyncFn - Async function to wrap.
 * @returns {Function} Wrapped function returning a Promise<{data, error, loading}>.
 */
function useAsync(asyncFn) {
  return async function (...args) {
    try {
      const data = await asyncFn(...args);
      return { data, error: null, loading: false };
    } catch (error) {
      return { data: null, error, loading: false };
    }
  };
}

/**
 * Tracks the previous value of a variable across update calls.
 *
 * @param {any} initial - Starting value.
 * @returns {{ get: () => any, update: (v: any) => void }}
 */
function usePrevious(initial) {
  let current = initial;
  let previous;
  return {
    get:    () => previous,
    update: (v) => { previous = current; current = v; },
  };
}

/**
 * Wraps a setInterval in a controllable object.
 *
 * @param {Function} fn       - Callback to invoke on each tick.
 * @param {number}   interval - Tick interval in ms.
 * @returns {{ start: () => void, stop: () => void, running: () => boolean }}
 */
function useInterval(fn, interval) {
  let timer = null;
  return {
    start:   () => { if (!timer) timer = setInterval(fn, interval); },
    stop:    () => { if (timer) { clearInterval(timer); timer = null; } },
    running: () => timer !== null,
  };
}

/**
 * Minimal fetch wrapper returning {data, error, loading} state.
 * Call the returned function with a URL to trigger the fetch.
 *
 * @returns {Function} Async function(url, options?) -> {data, error, loading}
 */
function useFetch() {
  return async function (url, options = {}) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return { data, error: null, loading: false };
    } catch (error) {
      return { data: null, error, loading: false };
    }
  };
}

module.exports = {
  useState, useReducer, useRef, useMemo,
  useDebounce, useThrottle, useLocalStorage,
  useToggle, useAsync, usePrevious, useInterval, useFetch,
};
