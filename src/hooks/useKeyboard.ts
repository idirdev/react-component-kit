import { useEffect, useCallback } from 'react';

interface KeyboardOptions {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
}

export function useKeyboard(
  optionsOrKey: KeyboardOptions | string,
  handler: (event: KeyboardEvent) => void,
  deps: any[] = []
): void {
  const options: KeyboardOptions = typeof optionsOrKey === 'string'
    ? { key: optionsOrKey }
    : optionsOrKey;

  const memoizedHandler = useCallback(handler, deps);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key !== options.key) return;
      if (options.ctrlKey && !event.ctrlKey) return;
      if (options.shiftKey && !event.shiftKey) return;
      if (options.altKey && !event.altKey) return;
      if (options.metaKey && !event.metaKey) return;

      if (options.preventDefault) {
        event.preventDefault();
      }

      memoizedHandler(event);
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [memoizedHandler, options.key, options.ctrlKey, options.shiftKey, options.altKey, options.metaKey, options.preventDefault]);
}

export default useKeyboard;
