import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled, { css, keyframes } from 'styled-components';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal title rendered in the header */
  title?: React.ReactNode;
  /** Main body content */
  children: React.ReactNode;
  /** Footer content (typically action buttons) */
  footer?: React.ReactNode;
  /** Width variant */
  size?: ModalSize;
  /** Close when pressing Escape key */
  closeOnEscape?: boolean;
  /** Close when clicking the backdrop */
  closeOnBackdropClick?: boolean;
  /** Additional class on the modal container */
  className?: string;
}

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { opacity: 0; transform: translateY(-20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); }`;

const sizeMap: Record<ModalSize, string> = { sm: '400px', md: '560px', lg: '720px', xl: '960px' };

const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.5); animation: ${fadeIn} 0.2s ease-out;
`;

const Container = styled.div<{ modalSize: ModalSize }>`
  background: #FFFFFF; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  width: 90%; max-width: ${({ modalSize }) => sizeMap[modalSize]};
  max-height: 85vh; display: flex; flex-direction: column; animation: ${slideIn} 0.25s ease-out;
  position: relative;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #E5E7EB;
`;
const Title = styled.h2`margin: 0; font-size: 18px; font-weight: 600; color: #111827;`;
const CloseButton = styled.button`
  background: none; border: none; cursor: pointer; font-size: 20px; color: #6B7280;
  padding: 4px; line-height: 1; border-radius: 4px;
  &:hover { color: #111827; background: #F3F4F6; }
`;
const Body = styled.div`padding: 20px; overflow-y: auto; flex: 1; color: #374151; font-size: 14px; line-height: 1.6;`;
const Footer = styled.div`
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  padding: 12px 20px; border-top: 1px solid #E5E7EB;
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, footer,
  size = 'md', closeOnEscape = true, closeOnBackdropClick = true, className,
}) => {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) onClose();
  }, [onClose, closeOnEscape]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) onClose();
  };

  const modal = (
    <Backdrop onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <Container modalSize={size} className={className}>
        {title && (
          <Header>
            <Title id="modal-title">{title}</Title>
            <CloseButton onClick={onClose} aria-label="Close modal">&times;</CloseButton>
          </Header>
        )}
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Container>
    </Backdrop>
  );

  return ReactDOM.createPortal(modal, document.body);
};

Modal.displayName = 'Modal';
export default Modal;
