'use strict';

/**
 * @file fp.js
 * @description Functional programming combinators.
 * @module react-component-kit/fp
 * @author idirdev
 */

/**
 * Composes functions right-to-left: compose(f, g)(x) === f(g(x)).
 *
 * @param {...Function} fns - Functions to compose.
 * @returns {Function}
 */
function compose(...fns) {
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

/**
 * Pipes functions left-to-right: pipe(f, g)(x) === g(f(x)).
 *
 * @param {...Function} fns - Functions to pipe.
 * @returns {Function}
 */
function pipe(...fns) {
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

module.exports = { compose, pipe };
