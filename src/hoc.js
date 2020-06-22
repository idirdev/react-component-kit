'use strict';

/**
 * @file hoc.js
 * @description Higher-Order Component pattern helpers (framework-agnostic).
 *   Each HOC wraps a component function (props) => output and returns a new one.
 * @module react-component-kit/hoc
 * @author idirdev
 */

/**
 * Wraps a component with a loading guard.
 * When props.loading is truthy, renders LoadingComponent instead.
 *
 * @param {Function} Component        - Component to wrap.
 * @param {Function} LoadingComponent - Component to render while loading.
 * @returns {Function}
 */
function withLoading(Component, LoadingComponent) {
  return function WrappedWithLoading(props) {
    return props.loading ? LoadingComponent(props) : Component(props);
  };
}

/**
 * Wraps a component with authentication checks.
 * If props.user is falsy, renders FallbackComponent.
 * If opts.roles is set and user.role is not in the list, renders ForbiddenComponent.
 *
 * @param {Function} Component - Component to wrap.
 * @param {object}   [opts]
 * @param {Function} [opts.FallbackComponent]  - Rendered when unauthenticated.
 * @param {Function} [opts.ForbiddenComponent] - Rendered when unauthorized (wrong role).
 * @param {string[]} [opts.roles]              - Allowed role values.
 * @returns {Function}
 */
function withAuth(Component, opts = {}) {
  const {
    FallbackComponent  = () => null,
    ForbiddenComponent = () => null,
    roles              = [],
  } = opts;

  return function WrappedWithAuth(props) {
    if (!props.user) return FallbackComponent(props);
    if (roles.length > 0 && !roles.includes(props.user.role)) {
      return ForbiddenComponent(props);
    }
    return Component(props);
  };
}

/**
 * Wraps a component with an error boundary.
 * If Component throws synchronously, renders ErrorComponent with the error.
 *
 * @param {Function} Component      - Component to wrap.
 * @param {Function} ErrorComponent - Rendered with { error } prop on failure.
 * @returns {Function}
 */
function withErrorBoundary(Component, ErrorComponent) {
  return function WrappedWithErrorBoundary(props) {
    try {
      return Component(props);
    } catch (error) {
      return ErrorComponent({ ...props, error });
    }
  };
}

module.exports = { withLoading, withAuth, withErrorBoundary };
