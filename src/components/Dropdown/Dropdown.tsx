import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface DropdownProps {
  /** Available options */
  options: DropdownOption[];
  /** Currently selected value(s) */
  value?: string | string[];
  /** Change handler */
  onChange: (value: string | string[]) => void;
  /** Placeholder when nothing is selected */
  placeholder?: string;
  /** Enable search filtering */
  searchable?: boolean;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom renderer for options */
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  /** Additional class name */
  className?: string;
}

const Wrapper = styled.div`position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`;
const Trigger = styled.button<{ isOpen: boolean; disabled?: boolean }>`
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; border: 1px solid ${({ isOpen }) => (isOpen ? '#3B82F6' : '#D1D5DB')};
  border-radius: 6px; background: #FFFFFF; font-size: 14px; color: #111827; cursor: pointer;
  ${({ isOpen }) => isOpen && css`box-shadow: 0 0 0 3px rgba(59,130,246,0.2);`}
  ${({ disabled }) => disabled && css`opacity: 0.5; cursor: not-allowed; background: #F9FAFB;`}
  &:focus { outline: none; border-color: #3B82F6; }
`;
const Arrow = styled.span<{ isOpen: boolean }>`
  border: solid #6B7280; border-width: 0 2px 2px 0; padding: 3px; display: inline-block;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(-135deg)' : 'rotate(45deg)')};
  transition: transform 0.15s; margin-left: 8px;
`;
const Menu = styled.div`
  position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 50;
  background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-height: 260px; overflow-y: auto;
`;
const SearchInput = styled.input`
  width: 100%; padding: 8px 12px; border: none; border-bottom: 1px solid #E5E7EB;
  font-size: 14px; outline: none; box-sizing: border-box;
  &::placeholder { color: #9CA3AF; }
`;
const GroupLabel = styled.div`padding: 6px 12px; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px;`;
const OptionItem = styled.div<{ isSelected: boolean; isHighlighted: boolean; disabled?: boolean }>`
  padding: 8px 12px; font-size: 14px; cursor: pointer; display: flex; align-items: center;
  background: ${({ isHighlighted }) => (isHighlighted ? '#F3F4F6' : 'transparent')};
  color: ${({ disabled }) => (disabled ? '#9CA3AF' : '#111827')};
  ${({ disabled }) => disabled && css`cursor: not-allowed;`}
  ${({ isSelected }) => isSelected && css`background: #EFF6FF; color: #2563EB; font-weight: 500;`}
  &:hover { background: ${({ disabled }) => (disabled ? 'transparent' : '#F3F4F6')}; }
`;
const Placeholder = styled.span`color: #9CA3AF;`;

export const Dropdown: React.FC<DropdownProps> = ({
  options, value, onChange, placeholder = 'Select...', searchable = false,
  multiple = false, disabled = false, renderOption, className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const filtered = useMemo(() => {
    if (!search) return options;
    return options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const groups = useMemo(() => {
    const map = new Map<string, DropdownOption[]>();
    filtered.forEach(o => {
      const key = o.group || '__ungrouped__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });
    return map;
  }, [filtered]);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) searchRef.current.focus();
  }, [isOpen, searchable]);

  const handleSelect = useCallback((opt: DropdownOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const next = selectedValues.includes(opt.value)
        ? selectedValues.filter(v => v !== opt.value)
        : [...selectedValues, opt.value];
      onChange(next);
    } else {
      onChange(opt.value);
      setIsOpen(false);
    }
    setSearch('');
  }, [multiple, selectedValues, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && isOpen && filtered[highlightIndex]) { handleSelect(filtered[highlightIndex]); }
    else if (e.key === 'Escape') { setIsOpen(false); }
  };

  const displayText = selectedValues.length === 0
    ? null
    : options.filter(o => selectedValues.includes(o.value)).map(o => o.label).join(', ');

  let flatIndex = -1;

  return (
    <Wrapper ref={wrapperRef} className={className} onKeyDown={handleKeyDown}>
      <Trigger type="button" isOpen={isOpen} disabled={disabled} onClick={() => !disabled && setIsOpen(!isOpen)} aria-haspopup="listbox" aria-expanded={isOpen}>
        {displayText ? <span>{displayText}</span> : <Placeholder>{placeholder}</Placeholder>}
        <Arrow isOpen={isOpen} />
      </Trigger>
      {isOpen && (
        <Menu role="listbox" aria-multiselectable={multiple}>
          {searchable && <SearchInput ref={searchRef} value={search} onChange={e => { setSearch(e.target.value); setHighlightIndex(0); }} placeholder="Search..." />}
          {Array.from(groups.entries()).map(([group, opts]) => (
            <React.Fragment key={group}>
              {group !== '__ungrouped__' && <GroupLabel>{group}</GroupLabel>}
              {opts.map(opt => {
                flatIndex++;
                const idx = flatIndex;
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <OptionItem key={opt.value} isSelected={isSelected} isHighlighted={idx === highlightIndex}
                    disabled={opt.disabled} role="option" aria-selected={isSelected}
                    onClick={() => handleSelect(opt)} onMouseEnter={() => setHighlightIndex(idx)}>
                    {renderOption ? renderOption(opt, isSelected) : opt.label}
                  </OptionItem>
                );
              })}
            </React.Fragment>
          ))}
          {filtered.length === 0 && <OptionItem isSelected={false} isHighlighted={false}>No results found</OptionItem>}
        </Menu>
      )}
    </Wrapper>
  );
};

Dropdown.displayName = 'Dropdown';
export default Dropdown;
