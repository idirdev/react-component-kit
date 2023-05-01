import React, { useState } from 'react';
import styled, { css } from 'styled-components';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Name used to generate initials when no image is available */
  name?: string;
  /** Size variant */
  size?: AvatarSize;
  /** Status indicator */
  status?: AvatarStatus;
  /** Additional class name */
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
const fontSizeMap: Record<AvatarSize, number> = { xs: 10, sm: 12, md: 14, lg: 20, xl: 28 };
const statusSizeMap: Record<AvatarSize, number> = { xs: 6, sm: 8, md: 10, lg: 14, xl: 18 };
const statusColors: Record<AvatarStatus, string> = { online: '#22C55E', offline: '#9CA3AF', away: '#F59E0B', busy: '#EF4444' };

const Wrapper = styled.div<{ avatarSize: AvatarSize }>`
  position: relative; display: inline-flex;
  width: ${({ avatarSize }) => sizeMap[avatarSize]}px;
  height: ${({ avatarSize }) => sizeMap[avatarSize]}px;
  flex-shrink: 0;
`;

const Img = styled.img`width: 100%; height: 100%; border-radius: 50%; object-fit: cover;`;

const Initials = styled.div<{ avatarSize: AvatarSize; bgColor: string }>`
  width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: ${({ bgColor }) => bgColor}; color: #FFFFFF; font-weight: 600;
  font-size: ${({ avatarSize }) => fontSizeMap[avatarSize]}px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const StatusDot = styled.span<{ avatarSize: AvatarSize; status: AvatarStatus }>`
  position: absolute; bottom: 0; right: 0; border-radius: 50%; border: 2px solid #FFFFFF;
  width: ${({ avatarSize }) => statusSizeMap[avatarSize]}px;
  height: ${({ avatarSize }) => statusSizeMap[avatarSize]}px;
  background: ${({ status }) => statusColors[status]};
`;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const palette = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'];
  return palette[Math.abs(hash) % palette.length];
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = 'md', status, className }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  return (
    <Wrapper avatarSize={size} className={className}>
      {showImage ? (
        <Img src={src} alt={alt || name || 'avatar'} onError={() => setImgError(true)} />
      ) : (
        <Initials avatarSize={size} bgColor={hashColor(name || 'U')}>
          {name ? getInitials(name) : '?'}
        </Initials>
      )}
      {status && <StatusDot avatarSize={size} status={status} />}
    </Wrapper>
  );
};

/** A group of overlapping avatars */
export interface AvatarGroupProps {
  children: React.ReactNode;
  /** Maximum avatars to display before showing +N */
  max?: number;
}

const GroupWrapper = styled.div`
  display: inline-flex; flex-direction: row-reverse;
  & > * { margin-left: -8px; border: 2px solid #FFFFFF; border-radius: 50%; }
  & > *:last-child { margin-left: 0; }
`;

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max }) => {
  const childArray = React.Children.toArray(children);
  const visible = max ? childArray.slice(0, max) : childArray;
  const remaining = max ? childArray.length - max : 0;

  return (
    <GroupWrapper>
      {remaining > 0 && (
        <Initials avatarSize="md" bgColor="#6B7280">+{remaining}</Initials>
      )}
      {visible.reverse()}
    </GroupWrapper>
  );
};

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';
export default Avatar;
