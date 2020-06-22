'use strict';

/**
 * @file utils.js
 * @description General-purpose utility functions for JS/Node applications.
 * @module react-component-kit/utils
 * @author idirdev
 */

/**
 * Merges class name arguments into a single string.
 * Accepts strings, arrays, or falsy values (skipped).
 *
 * @param {...(string|string[]|null|undefined|false)} args - Class name inputs.
 * @returns {string}
 */
function cn(...args) {
  return args
    .flat()
    .filter(v => v && typeof v === 'string')
    .join(' ');
}

/**
 * Formats a date string or Date object according to a simple pattern.
 * Supports: YYYY, MM, DD, HH, mm, ss tokens.
 *
 * @param {string|Date} date    - Input date.
 * @param {string}      [format='YYYY-MM-DD'] - Output format pattern.
 * @returns {string}
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  const pad2 = n => String(n).padStart(2, '0');
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM',   pad2(d.getMonth() + 1))
    .replace('DD',   pad2(d.getDate()))
    .replace('HH',   pad2(d.getHours()))
    .replace('mm',   pad2(d.getMinutes()))
    .replace('ss',   pad2(d.getSeconds()));
}

/**
 * Formats a number using the host locale's number formatting.
 *
 * @param {number} n          - Number to format.
 * @param {string} [locale]   - BCP 47 locale tag (optional).
 * @param {object} [options]  - Intl.NumberFormat options (optional).
 * @returns {string}
 */
function formatNumber(n, locale, options) {
  return new Intl.NumberFormat(locale, options).format(n);
}

/**
 * Truncates a string to maxLen characters, appending ellipsis if needed.
 *
 * @param {string} str    - Input string.
 * @param {number} maxLen - Maximum output length (including ellipsis).
 * @param {string} [ellipsis='...'] - Suffix when truncated.
 * @returns {string}
 */
function truncateText(str, maxLen, ellipsis = '...') {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - ellipsis.length) + ellipsis;
}

/**
 * Generates a random alphanumeric ID of the given length.
 *
 * @param {number} [length=16] - Desired ID length.
 * @returns {string}
 */
function generateId(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * Performs a deep clone of a plain object or array using JSON round-trip.
 * Does not support functions, symbols, or circular references.
 *
 * @param {any} obj - Value to clone.
 * @returns {any}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Recursively merges two plain objects. Arrays in src overwrite those in target.
 *
 * @param {object} target - Base object.
 * @param {object} src    - Object to merge into target.
 * @returns {object} A new merged object (does not mutate inputs).
 */
function deepMerge(target, src) {
  const out = Object.assign({}, target);
  for (const key of Object.keys(src)) {
    const tv = target[key];
    const sv = src[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      out[key] = deepMerge(tv, sv);
    } else {
      out[key] = sv;
    }
  }
  return out;
}

/**
 * Deep equality comparison for plain objects, arrays, and primitives.
 *
 * @param {any} a - First value.
 * @param {any} b - Second value.
 * @returns {boolean}
 */
function isEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!isEqual(a[k], b[k])) return false;
  }
  return true;
}

/**
 * Returns a new object with only the specified keys.
 *
 * @param {object}   obj  - Source object.
 * @param {string[]} keys - Keys to include.
 * @returns {object}
 */
function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
  }
  return out;
}

/**
 * Returns a new object with the specified keys excluded.
 *
 * @param {object}   obj  - Source object.
 * @param {string[]} keys - Keys to remove.
 * @returns {object}
 */
function omit(obj, keys) {
  const out = Object.assign({}, obj);
  for (const k of keys) delete out[k];
  return out;
}

/**
 * Returns a debounced version of fn.
 *
 * @param {Function} fn    - Function to debounce.
 * @param {number}   ms    - Debounce delay in milliseconds.
 * @returns {Function & { cancel: () => void }}
 */
function debounce(fn, ms) {
  let timer = null;
  const debounced = function (...args) {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, ms);
  };
  debounced.cancel = () => { if (timer !== null) { clearTimeout(timer); timer = null; } };
  return debounced;
}

/**
 * Returns a throttled version of fn.
 *
 * @param {Function} fn    - Function to throttle.
 * @param {number}   ms    - Minimum ms between invocations.
 * @returns {Function}
 */
function throttle(fn, ms) {
  let lastRan = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRan >= ms) {
      lastRan = now;
      return fn(...args);
    }
  };
}

/**
 * Memoizes a pure function. Caches results by a JSON-serialized key of args.
 *
 * @param {Function} fn - Pure function to memoize.
 * @returns {Function}
 */
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

module.exports = {
  cn, formatDate, formatNumber, truncateText, generateId,
  deepClone, deepMerge, isEqual, pick, omit, debounce, throttle, memoize,
};
