'use strict';

/**
 * @file store.js
 * @description Redux-like store and EventBus implementations.
 * @module react-component-kit/store
 * @author idirdev
 */

/**
 * A lightweight publish/subscribe event bus.
 */
class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }

  /**
   * Subscribes a listener to an event.
   * @param {string}   event    - Event name.
   * @param {Function} listener - Callback function.
   * @returns {this}
   */
  on(event, listener) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(listener);
    return this;
  }

  /**
   * Unsubscribes a listener from an event.
   * @param {string}   event    - Event name.
   * @param {Function} listener - Callback to remove.
   * @returns {this}
   */
  off(event, listener) {
    const set = this._listeners.get(event);
    if (set) set.delete(listener);
    return this;
  }

  /**
   * Emits an event, calling all registered listeners with the given data.
   * @param {string} event - Event name.
   * @param {any}    data  - Payload passed to each listener.
   * @returns {this}
   */
  emit(event, data) {
    const set = this._listeners.get(event);
    if (set) set.forEach(fn => fn(data));
    return this;
  }

  /**
   * Subscribes a one-time listener that auto-removes after first call.
   * @param {string}   event    - Event name.
   * @param {Function} listener - One-time callback.
   * @returns {this}
   */
  once(event, listener) {
    const wrapper = (data) => { listener(data); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
}

/**
 * Creates a Redux-like store with subscribe/dispatch/getState.
 *
 * @template S, A
 * @param {(state: S, action: A) => S} reducer - Pure reducer function.
 * @param {S} initialState - Initial state value.
 * @returns {{
 *   getState: () => S,
 *   dispatch: (action: A) => void,
 *   subscribe: (listener: () => void) => () => void
 * }}
 */
function createStore(reducer, initialState) {
  let state = initialState;
  const subscribers = new Set();

  return {
    /** Returns the current state. */
    getState: () => state,

    /**
     * Dispatches an action, updating state via the reducer.
     * @param {A} action
     */
    dispatch: (action) => {
      state = reducer(state, action);
      subscribers.forEach(fn => fn());
    },

    /**
     * Subscribes to state changes.
     * @param {Function} listener - Called after every dispatch.
     * @returns {Function} Unsubscribe function.
     */
    subscribe: (listener) => {
      subscribers.add(listener);
      return () => subscribers.delete(listener);
    },
  };
}

module.exports = { EventBus, createStore };
