import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const variantStyles = {
  primary: css`
    background-color: #3B82F6;
    color: #FFFFFF;
    border: 1px solid #3B82F6;
    &:hover:not(:disabled) { background-color: #2563EB; border-color: #2563EB; }
    &:active:not(:disabled) { background-color: #1D4ED8; }
  `,
  secondary: css`
    background-color: #FFFFFF;
    color: #374151;
    border: 1px solid #D1D5DB;
    &:hover:not(:disabled) { background-color: #F3F4F6; border-color: #9CA3AF; }
    &:active:not(:disabled) { background-color: #E5E7EB; }
  `,
  danger: css`
    background-color: #EF4444;
    color: #FFFFFF;
    border: 1px solid #EF4444;
    &:hover:not(:disabled) { background-color: #DC2626; border-color: #DC2626; }
    &:active:not(:disabled) { background-color: #B91C1C; }
  `,
  ghost: css`
    background-color: transparent;
    color: #374151;
    border: 1px solid transparent;
    &:hover:not(:disabled) { background-color: #F3F4F6; }
    &:active:not(:disabled) { background-color: #E5E7EB; }
  `,
};

const sizeStyles = {
  sm: css`padding: 6px 12px; font-size: 12px; border-radius: 4px;`,
  md: css`padding: 8px 16px; font-size: 14px; border-radius: 6px;`,
  lg: css`padding: 12px 24px; font-size: 16px; border-radius: 8px;`,
};

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  outline: none;
  ${({ variant }) => variantStyles[variant]}
  ${({ size }) => sizeStyles[size]}
  ${({ fullWidth }) => fullWidth && css`width: 100%; `}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  ${({ isLoading }) => isLoading && css`pointer-events: none; opacity: 0.75;`}
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;
