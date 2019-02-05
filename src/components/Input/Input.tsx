import React, { useState, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  /** Label displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Helper text displayed below the input when no error */
  helperText?: string;
  /** Icon or element rendered before the input */
  prefix?: React.ReactNode;
  /** Icon or element rendered after the input */
  suffix?: React.ReactNode;
  /** Show a clear button when the input has a value */
  clearable?: boolean;
  /** Callback when the clear button is clicked */
  onClear?: () => void;
  /** Enable password visibility toggle for type="password" */
  passwordToggle?: boolean;
  /** Size variant */
  inputSize?: 'sm' | 'md' | 'lg';
}

const Wrapper = styled.div`margin-bottom: 16px;`;
const Label = styled.label`display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;`;
const HelperText = styled.span<{ isError?: boolean }>`
  display: block; font-size: 12px; margin-top: 4px;
  color: ${({ isError }) => (isError ? '#EF4444' : '#6B7280')};
`;
const InputWrapper = styled.div<{ hasError?: boolean; focused?: boolean; inputSize: string }>`
  display: flex; align-items: center; border: 1px solid ${({ hasError }) => (hasError ? '#EF4444' : '#D1D5DB')};
  border-radius: 6px; background: #FFFFFF; transition: border-color 0.15s, box-shadow 0.15s;
  ${({ focused, hasError }) => focused && css`
    border-color: ${hasError ? '#EF4444' : '#3B82F6'};
    box-shadow: 0 0 0 3px ${hasError ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)'};
  `}
  padding: ${({ inputSize }) => inputSize === 'sm' ? '4px 8px' : inputSize === 'lg' ? '10px 14px' : '6px 10px'};
`;
const StyledInput = styled.input`
  flex: 1; border: none; outline: none; font-size: 14px; font-family: inherit;
  background: transparent; color: #111827; min-width: 0;
  &::placeholder { color: #9CA3AF; }
  &:disabled { cursor: not-allowed; color: #9CA3AF; }
`;
const Adornment = styled.span`display: flex; align-items: center; color: #6B7280; flex-shrink: 0;`;
const ClearBtn = styled.button`
  background: none; border: none; cursor: pointer; color: #9CA3AF; padding: 0 2px; display: flex; align-items: center;
  &:hover { color: #374151; }
`;

export const Input: React.FC<InputProps> = ({
  label, error, helperText, prefix, suffix, clearable, onClear, passwordToggle,
  inputSize = 'md', type = 'text', value, disabled, className, id, ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-') || 'field'}`;
  const resolvedType = passwordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const handleClear = useCallback(() => {
    if (onClear) onClear();
    if (inputRef.current) { inputRef.current.value = ''; inputRef.current.focus(); }
  }, [onClear]);

  return (
    <Wrapper className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <InputWrapper hasError={!!error} focused={focused} inputSize={inputSize}>
        {prefix && <Adornment style={{ marginRight: '6px' }}>{prefix}</Adornment>}
        <StyledInput
          ref={inputRef} id={inputId} type={resolvedType} value={value} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {clearable && value && !disabled && <ClearBtn type="button" onClick={handleClear} aria-label="Clear input">&times;</ClearBtn>}
        {passwordToggle && type === 'password' && (
          <ClearBtn type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? '(hide)' : '(show)'}
          </ClearBtn>
        )}
        {suffix && <Adornment style={{ marginLeft: '6px' }}>{suffix}</Adornment>}
      </InputWrapper>
      {error && <HelperText id={`${inputId}-error`} isError role="alert">{error}</HelperText>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </Wrapper>
  );
};

Input.displayName = 'Input';
export default Input;
