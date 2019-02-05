import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Toast, ToastData, ToastType } from './Toast';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface ToastContextValue {
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const positionMap: Record<ToastPosition, string> = {
  'top-right': 'top: 16px; right: 16px;',
  'top-left': 'top: 16px; left: 16px;',
  'bottom-right': 'bottom: 16px; right: 16px;',
  'bottom-left': 'bottom: 16px; left: 16px;',
  'top-center': 'top: 16px; left: 50%; transform: translateX(-50%);',
  'bottom-center': 'bottom: 16px; left: 50%; transform: translateX(-50%);',
};

const Container = styled.div<{ pos: ToastPosition }>`
  position: fixed; z-index: 9999; display: flex; flex-direction: column; gap: 8px;
  ${({ pos }) => positionMap[pos]}
`;

interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts visible at once */
  maxToasts?: number;
  /** Position of the toast stack */
  position?: ToastPosition;
}

let toastCounter = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxToasts = 5, position = 'top-right' }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration: number = 5000) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    setToasts(prev => {
      const next = [...prev, { id, type, message, duration }];
      return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
    });
  }, [maxToasts]);

  const contextValue: ToastContextValue = {
    addToast,
    removeToast,
    success: useCallback((msg, dur) => addToast('success', msg, dur), [addToast]),
    error: useCallback((msg, dur) => addToast('error', msg, dur), [addToast]),
    warning: useCallback((msg, dur) => addToast('warning', msg, dur), [addToast]),
    info: useCallback((msg, dur) => addToast('info', msg, dur), [addToast]),
  };

  const portal = toasts.length > 0
    ? ReactDOM.createPortal(
        <Container pos={position}>
          {toasts.map(t => <Toast key={t.id} {...t} onDismiss={removeToast} />)}
        </Container>,
        document.body
      )
    : null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

ToastProvider.displayName = 'ToastProvider';
export default ToastProvider;
