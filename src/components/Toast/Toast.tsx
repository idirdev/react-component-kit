import React, { useEffect, useState, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const slideIn = keyframes`from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`;
const slideOut = keyframes`from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; }`;

const colorMap: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#F0FDF4', border: '#22C55E', icon: '\u2713' },
  error:   { bg: '#FEF2F2', border: '#EF4444', icon: '\u2717' },
  warning: { bg: '#FFFBEB', border: '#F59E0B', icon: '\u26A0' },
  info:    { bg: '#EFF6FF', border: '#3B82F6', icon: '\u2139' },
};

const Wrapper = styled.div<{ toastType: ToastType; isExiting: boolean }>`
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 16px; border-radius: 8px; min-width: 300px; max-width: 420px;
  background: ${({ toastType }) => colorMap[toastType].bg};
  border-left: 4px solid ${({ toastType }) => colorMap[toastType].border};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  animation: ${({ isExiting }) => (isExiting ? slideOut : slideIn)} 0.3s ease forwards;
  position: relative; overflow: hidden;
`;

const Icon = styled.span<{ toastType: ToastType }>`
  font-size: 16px; flex-shrink: 0; margin-top: 1px;
  color: ${({ toastType }) => colorMap[toastType].border};
`;

const Message = styled.span`font-size: 14px; color: #374151; line-height: 1.4; flex: 1;`;

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer; color: #9CA3AF; font-size: 16px;
  padding: 0; line-height: 1; flex-shrink: 0;
  &:hover { color: #374151; }
`;

const progressShrink = keyframes`from { width: 100%; } to { width: 0%; }`;

const ProgressBar = styled.div<{ duration: number; toastType: ToastType }>`
  position: absolute; bottom: 0; left: 0; height: 3px;
  background: ${({ toastType }) => colorMap[toastType].border};
  animation: ${progressShrink} ${({ duration }) => duration}ms linear forwards;
`;

export const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  }, [id, onDismiss]);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  return (
    <Wrapper toastType={type} isExiting={isExiting} role="alert">
      <Icon toastType={type}>{colorMap[type].icon}</Icon>
      <Message>{message}</Message>
      <CloseBtn onClick={dismiss} aria-label="Dismiss notification">&times;</CloseBtn>
      {duration > 0 && <ProgressBar duration={duration} toastType={type} />}
    </Wrapper>
  );
};

Toast.displayName = 'Toast';
export default Toast;
