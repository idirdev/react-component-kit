'use strict';

/**
 * @file index.js
 * @description Public API for react-component-kit.
 *   Pure JS utility functions — no React dependency required.
 * @module react-component-kit
 * @author idirdev
 */

const {
  useState, useReducer, useRef, useMemo,
  useDebounce, useThrottle, useLocalStorage,
  useToggle, useAsync, usePrevious, useInterval, useFetch,
} = require('./hooks');

const { withLoading, withAuth, withErrorBoundary } = require('./hoc');

const {
  cn, formatDate, formatNumber, truncateText, generateId,
  deepClone, deepMerge, isEqual, pick, omit, debounce, throttle, memoize,
} = require('./utils');

const { EventBus, createStore } = require('./store');
const { compose, pipe } = require('./fp');

module.exports = {
  // Hook-like state management
  useState, useReducer, useRef, useMemo,

  // Async / timing utilities
  useDebounce, useThrottle, useAsync, useInterval, useFetch,

  // Storage / UI helpers
  useLocalStorage, useToggle, usePrevious,

  // HOC patterns
  withLoading, withAuth, withErrorBoundary,

  // Class name + formatting
  cn, formatDate, formatNumber, truncateText, generateId,

  // Object utilities
  deepClone, deepMerge, isEqual, pick, omit,

  // Functional
  debounce, throttle, memoize, compose, pipe,

  // Reactive primitives
  EventBus, createStore,
};
