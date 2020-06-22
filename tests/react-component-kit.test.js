'use strict';

/**
 * @file react-component-kit.test.js
 * @description Tests for react-component-kit hooks, HOCs, and utilities.
 * @module react-component-kit/tests
 * @author idirdev
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { useDebounce, useThrottle, useToggle, useAsync, usePrevious, useState, useReducer, useRef, useMemo } = require('../src/hooks');
const { withLoading, withAuth, withErrorBoundary } = require('../src/hoc');
const { cn, formatDate, formatNumber, truncateText, generateId, deepClone, deepMerge, isEqual, pick, omit, memoize } = require('../src/utils');
const { EventBus, createStore } = require('../src/store');
const { compose, pipe } = require('../src/fp');

describe('hooks', () => {
  it('useDebounce returns callable', () => {
    const fn = useDebounce(() => {}, 100);
    assert.equal(typeof fn, 'function');
    fn.cancel();
  });

  it('useThrottle returns callable', () => {
    assert.equal(typeof useThrottle(() => {}, 100), 'function');
  });

  it('useToggle', () => {
    const t = useToggle(false);
    assert.equal(t.value(), false);
    t.toggle();
    assert.equal(t.value(), true);
    t.set(false);
    assert.equal(t.value(), false);
  });

  it('useAsync', async () => {
    const fn = useAsync(async (x) => x * 2);
    const r = await fn(5);
    assert.equal(r.data, 10);
    assert.equal(r.loading, false);
  });

  it('useAsync error', async () => {
    const fn = useAsync(async () => { throw new Error('fail'); });
    const r = await fn();
    assert.ok(r.error);
    assert.equal(r.loading, false);
  });

  it('usePrevious', () => {
    const p = usePrevious('a');
    assert.equal(p.get(), undefined);
    p.update('b');
    assert.equal(p.get(), 'a');
  });

  it('useState getter and setter', () => {
    const [get, set] = useState(42);
    assert.equal(get(), 42);
    set(100);
    assert.equal(get(), 100);
    set(v => v + 1);
    assert.equal(get(), 101);
  });

  it('useReducer dispatches actions', () => {
    const reducer = (state, action) => {
      if (action.type === 'inc') return state + 1;
      return state;
    };
    const [getState, dispatch] = useReducer(reducer, 0);
    assert.equal(getState(), 0);
    dispatch({ type: 'inc' });
    assert.equal(getState(), 1);
  });

  it('useRef holds mutable current value', () => {
    const ref = useRef(0);
    assert.equal(ref.current, 0);
    ref.current = 99;
    assert.equal(ref.current, 99);
  });

  it('useMemo caches computed value', () => {
    let callCount = 0;
    const deps = [1, 2];
    const memo = useMemo(() => { callCount++; return deps[0] + deps[1]; }, deps);
    assert.equal(memo(), 3);
    assert.equal(memo(), 3);
    assert.equal(callCount, 1);
  });
});

describe('HOCs', () => {
  it('withLoading shows loading', () => {
    const C = withLoading(() => 'content', () => 'loading');
    assert.equal(C({ loading: true }), 'loading');
    assert.equal(C({ loading: false }), 'content');
  });

  it('withAuth blocks unauthenticated', () => {
    const C = withAuth(() => 'ok', { FallbackComponent: () => 'denied' });
    assert.equal(C({ user: null }), 'denied');
    assert.equal(C({ user: { id: 1 } }), 'ok');
  });

  it('withAuth checks roles', () => {
    const C = withAuth(() => 'ok', { roles: ['admin'], ForbiddenComponent: () => 'forbidden' });
    assert.equal(C({ user: { id: 1, role: 'viewer' } }), 'forbidden');
    assert.equal(C({ user: { id: 1, role: 'admin' } }), 'ok');
  });

  it('withErrorBoundary catches', () => {
    const C = withErrorBoundary(() => { throw new Error('x'); }, (p) => 'error:' + p.error.message);
    assert.equal(C({}), 'error:x');
  });
});

describe('utils', () => {
  it('cn', () => {
    assert.equal(cn('a', false, 'b', null, 'c'), 'a b c');
    assert.equal(cn(['x', 'y']), 'x y');
  });

  it('formatDate', () => {
    assert.equal(formatDate('2024-01-15', 'YYYY-MM-DD'), '2024-01-15');
  });

  it('formatNumber', () => {
    assert.ok(formatNumber(1234.5).includes('1'));
  });

  it('truncateText', () => {
    assert.equal(truncateText('hello world', 8), 'hello...');
    assert.equal(truncateText('short', 10), 'short');
  });

  it('generateId', () => {
    const id = generateId(8);
    assert.equal(id.length, 8);
    assert.notEqual(generateId(), generateId());
  });

  it('deepClone', () => {
    const o = { a: { b: 1 }, c: [2, 3] };
    const c = deepClone(o);
    assert.deepEqual(c, o);
    c.a.b = 99;
    assert.equal(o.a.b, 1);
  });

  it('deepMerge', () => {
    const r = deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
    assert.deepEqual(r, { a: 1, b: { c: 2, d: 3 }, e: 4 });
  });

  it('isEqual', () => {
    assert.ok(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));
    assert.ok(!isEqual({ a: 1 }, { a: 2 }));
    assert.ok(!isEqual({ a: 1 }, { a: 1, b: 2 }));
  });

  it('pick and omit', () => {
    assert.deepEqual(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 });
    assert.deepEqual(omit({ a: 1, b: 2, c: 3 }, ['b']), { a: 1, c: 3 });
  });

  it('memoize caches results', () => {
    let calls = 0;
    const fn = memoize((x) => { calls++; return x * 2; });
    assert.equal(fn(5), 10);
    assert.equal(fn(5), 10);
    assert.equal(calls, 1);
    assert.equal(fn(3), 6);
    assert.equal(calls, 2);
  });
});

describe('EventBus', () => {
  it('on/emit/off', () => {
    const bus = new EventBus();
    let received = null;
    const handler = (d) => { received = d; };
    bus.on('test', handler);
    bus.emit('test', 42);
    assert.equal(received, 42);
    bus.off('test', handler);
    bus.emit('test', 99);
    assert.equal(received, 42);
  });

  it('once fires only one time', () => {
    const bus = new EventBus();
    let count = 0;
    bus.once('ping', () => count++);
    bus.emit('ping');
    bus.emit('ping');
    assert.equal(count, 1);
  });
});

describe('createStore', () => {
  it('getState returns initial state', () => {
    const store = createStore((s) => s, { count: 0 });
    assert.deepEqual(store.getState(), { count: 0 });
  });

  it('dispatch updates state via reducer', () => {
    const reducer = (state, action) => {
      if (action.type === 'inc') return { ...state, count: state.count + 1 };
      return state;
    };
    const store = createStore(reducer, { count: 0 });
    store.dispatch({ type: 'inc' });
    assert.equal(store.getState().count, 1);
  });

  it('subscribe notifies listeners', () => {
    const store = createStore((s, a) => a.type === 'set' ? { v: a.v } : s, { v: 0 });
    let notified = 0;
    const unsub = store.subscribe(() => notified++);
    store.dispatch({ type: 'set', v: 5 });
    assert.equal(notified, 1);
    unsub();
    store.dispatch({ type: 'set', v: 10 });
    assert.equal(notified, 1);
  });
});

describe('compose and pipe', () => {
  it('compose applies right-to-left', () => {
    const add1 = x => x + 1;
    const double = x => x * 2;
    assert.equal(compose(add1, double)(3), 7);  // double(3)=6, add1(6)=7
  });

  it('pipe applies left-to-right', () => {
    const add1 = x => x + 1;
    const double = x => x * 2;
    assert.equal(pipe(add1, double)(3), 8);  // add1(3)=4, double(4)=8
  });
});
