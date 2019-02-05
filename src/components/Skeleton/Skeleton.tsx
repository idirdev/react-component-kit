import React from 'react';
import styled, { css, keyframes } from 'styled-components';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps {
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Custom width (CSS value) */
  width?: string | number;
  /** Custom height (CSS value) */
  height?: string | number;
  /** Enable shimmer animation */
  animate?: boolean;
  /** Number of text lines to render (only for variant="text") */
  lines?: number;
  /** Border radius override (CSS value) */
  borderRadius?: string;
  /** Additional class name */
  className?: string;
}

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Bone = styled.div<{
  variant: SkeletonVariant;
  customWidth?: string | number;
  customHeight?: string | number;
  animate: boolean;
  customRadius?: string;
}>`
  background: #E5E7EB;
  display: block;

  ${({ variant, customWidth, customHeight, customRadius }) => {
    switch (variant) {
      case 'circle':
        const circleSize = customWidth || customHeight || 40;
        return css`
          width: ${typeof circleSize === 'number' ? `${circleSize}px` : circleSize};
          height: ${typeof circleSize === 'number' ? `${circleSize}px` : circleSize};
          border-radius: 50%;
        `;
      case 'rect':
        return css`
          width: ${customWidth ? (typeof customWidth === 'number' ? `${customWidth}px` : customWidth) : '100%'};
          height: ${customHeight ? (typeof customHeight === 'number' ? `${customHeight}px` : customHeight) : '120px'};
          border-radius: ${customRadius || '6px'};
        `;
      case 'text':
      default:
        return css`
          width: ${customWidth ? (typeof customWidth === 'number' ? `${customWidth}px` : customWidth) : '100%'};
          height: ${customHeight ? (typeof customHeight === 'number' ? `${customHeight}px` : customHeight) : '14px'};
          border-radius: ${customRadius || '4px'};
        `;
    }
  }}

  ${({ animate }) => animate && css`
    background: linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%);
    background-size: 800px 100%;
    animation: ${shimmer} 1.5s infinite linear;
  `}
`;

const TextGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px; width: 100%;
`;

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text', width, height, animate = true,
  lines = 1, borderRadius, className,
}) => {
  if (variant === 'text' && lines > 1) {
    return (
      <TextGroup className={className}>
        {Array.from({ length: lines }).map((_, i) => (
          <Bone
            key={i}
            variant="text"
            customWidth={i === lines - 1 ? '75%' : width}
            customHeight={height}
            animate={animate}
            customRadius={borderRadius}
          />
        ))}
      </TextGroup>
    );
  }

  return (
    <Bone
      variant={variant}
      customWidth={width}
      customHeight={height}
      animate={animate}
      customRadius={borderRadius}
      className={className}
    />
  );
};

Skeleton.displayName = 'Skeleton';
export default Skeleton;
