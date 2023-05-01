import React from 'react';
import { StyledButton, Spinner } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Icon element to render before children */
  iconLeft?: React.ReactNode;
  /** Icon element to render after children */
  iconRight?: React.ReactNode;
  /** Make the button fill its container width */
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  children,
  type = 'button',
  onClick,
  className,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={loading}
      disabled={disabled || loading}
      type={type}
      onClick={handleClick}
      className={className}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner aria-hidden="true" />}
      {!loading && iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
      {children && <span className="btn-label">{children}</span>}
      {!loading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </StyledButton>
  );
};

Button.displayName = 'Button';
export default Button;
