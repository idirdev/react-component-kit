import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Tab definitions */
  tabs: TabItem[];
  /** Active tab key (controlled mode) */
  activeKey?: string;
  /** Default active tab key (uncontrolled mode) */
  defaultActiveKey?: string;
  /** Change handler */
  onChange?: (key: string) => void;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional class name */
  className?: string;
}

const Wrapper = styled.div<{ orientation: string }>`
  display: flex;
  flex-direction: ${({ orientation }) => (orientation === 'vertical' ? 'row' : 'column')};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const TabList = styled.div<{ orientation: string }>`
  display: flex;
  flex-direction: ${({ orientation }) => (orientation === 'vertical' ? 'column' : 'row')};
  border-bottom: ${({ orientation }) => (orientation === 'horizontal' ? '1px solid #E5E7EB' : 'none')};
  border-right: ${({ orientation }) => (orientation === 'vertical' ? '1px solid #E5E7EB' : 'none')};
  position: relative;
`;

const TabButton = styled.button<{ isActive: boolean; orientation: string }>`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 16px; border: none; background: transparent;
  font-size: 14px; font-weight: 500; color: ${({ isActive }) => (isActive ? '#3B82F6' : '#6B7280')};
  cursor: pointer; white-space: nowrap; position: relative; transition: color 0.15s;
  ${({ orientation }) => orientation === 'horizontal' && css`margin-bottom: -1px;`}
  ${({ orientation }) => orientation === 'vertical' && css`margin-right: -1px; text-align: left;`}
  &:hover:not(:disabled) { color: #3B82F6; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:focus { outline: none; }
  &::after {
    content: '';
    position: absolute;
    ${({ orientation, isActive }) => orientation === 'horizontal' ? css`
      bottom: 0; left: 0; right: 0; height: 2px;
      background: ${isActive ? '#3B82F6' : 'transparent'}; transition: background 0.2s;
    ` : css`
      right: 0; top: 0; bottom: 0; width: 2px;
      background: ${isActive ? '#3B82F6' : 'transparent'}; transition: background 0.2s;
    `}
  }
`;

const TabIcon = styled.span`display: inline-flex; align-items: center; font-size: 16px;`;

const TabPanel = styled.div<{ orientation: string }>`
  padding: ${({ orientation }) => (orientation === 'vertical' ? '0 20px' : '16px 0')};
  flex: 1; min-width: 0;
`;

export const Tabs: React.FC<TabsProps> = ({
  tabs, activeKey, defaultActiveKey, onChange, orientation = 'horizontal', className,
}) => {
  const isControlled = activeKey !== undefined;
  const [internalKey, setInternalKey] = useState(
    defaultActiveKey || (tabs.length > 0 ? tabs[0].key : '')
  );
  const currentKey = isControlled ? activeKey! : internalKey;
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((key: string) => {
    if (!isControlled) setInternalKey(key);
    if (onChange) onChange(key);
  }, [isControlled, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const idx = enabledTabs.findIndex(t => t.key === currentKey);
    const isHoriz = orientation === 'horizontal';
    const nextKey = isHoriz ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHoriz ? 'ArrowLeft' : 'ArrowUp';
    if (e.key === nextKey) {
      e.preventDefault();
      const next = enabledTabs[(idx + 1) % enabledTabs.length];
      handleSelect(next.key);
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prev = enabledTabs[(idx - 1 + enabledTabs.length) % enabledTabs.length];
      handleSelect(prev.key);
    }
  }, [tabs, currentKey, orientation, handleSelect]);

  const activeTab = tabs.find(t => t.key === currentKey);

  return (
    <Wrapper orientation={orientation} className={className}>
      <TabList ref={tabListRef} role="tablist" orientation={orientation} aria-orientation={orientation} onKeyDown={handleKeyDown}>
        {tabs.map(tab => (
          <TabButton
            key={tab.key} role="tab" isActive={tab.key === currentKey} orientation={orientation}
            disabled={tab.disabled} aria-selected={tab.key === currentKey}
            tabIndex={tab.key === currentKey ? 0 : -1}
            onClick={() => !tab.disabled && handleSelect(tab.key)}
          >
            {tab.icon && <TabIcon>{tab.icon}</TabIcon>}
            {tab.label}
          </TabButton>
        ))}
      </TabList>
      <TabPanel role="tabpanel" orientation={orientation}>
        {activeTab ? activeTab.content : null}
      </TabPanel>
    </Wrapper>
  );
};

Tabs.displayName = 'Tabs';
export default Tabs;
