import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY } from '@/core/constants';

interface FilterProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T extends Array<infer U> ? U : T }[];
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.XS,
  },
  label: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT.SECONDARY,
    marginBottom: SPACING.XS,
  },
  select: {
    display: 'flex',
    gap: SPACING.XS,
    flexWrap: 'wrap',
    padding: SPACING.SM,
    border: `1px solid ${COLORS.GREY[300]}`,
    borderRadius: '4px',
    backgroundColor: COLORS.BACKGROUND.PAPER,
    cursor: 'pointer',
    minHeight: '40px',
    '&:focus-within': {
      borderColor: COLORS.PRIMARY.MAIN,
      boxShadow: `0 0 0 2px ${COLORS.PRIMARY.LIGHT}40`,
    },
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    flex: 1,
    minWidth: '100px',
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    '&::placeholder': {
      color: COLORS.TEXT.SECONDARY,
    },
  },
  options: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: COLORS.BACKGROUND.PAPER,
    border: `1px solid ${COLORS.GREY[200]}`,
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  option: {
    padding: SPACING.SM,
    cursor: 'pointer',
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    '&:hover': {
      backgroundColor: COLORS.GREY[50],
    },
  },
  optionSelected: {
    backgroundColor: `${COLORS.PRIMARY.LIGHT}20`,
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: SPACING.XS,
    padding: `${SPACING.XS}px ${SPACING.SM}px`,
    backgroundColor: COLORS.PRIMARY.LIGHT,
    color: COLORS.PRIMARY.MAIN,
    borderRadius: '16px',
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
  },
  tagRemove: {
    cursor: 'pointer',
    color: COLORS.PRIMARY.MAIN,
    '&:hover': {
      opacity: 0.8,
    },
  },
  disabled: {
    opacity: 0.6,
    pointerEvents: 'none',
  },
};

export function Filter<T extends string | string[]>({
  value,
  onChange,
  options,
  label,
  multiple = false,
  searchable = false,
  disabled = false,
}: FilterProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValue as T);
    } else {
      onChange(optionValue as T);
      setIsOpen(false);
    }
  };

  const removeValue = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v !== optionValue) as T);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ ...styles.container, ...(disabled && styles.disabled) }}
    >
      {label && <label style={styles.label}>{label}</label>}
      <div
        style={styles.select}
        onClick={() => !disabled && setIsOpen(true)}
        tabIndex={0}
      >
        {multiple ? (
          <>
            {Array.isArray(value) &&
              value.map((v) => (
                <span key={v} style={styles.tag}>
                  {options.find((o) => o.value === v)?.label}
                  <span
                    style={styles.tagRemove}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(v);
                    }}
                  >
                    ×
                  </span>
                </span>
              ))}
          </>
        ) : (
          options.find((o) => o.value === value)?.label
        )}
        {searchable && isOpen && (
          <input
            style={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
      {isOpen && (
        <div style={styles.options}>
          {filteredOptions.map((option) => {
            const isSelected = Array.isArray(value)
              ? value.includes(option.value as string)
              : value === option.value;
            
            return (
              <div
                key={String(option.value)}
                style={{
                  ...styles.option,
                  ...(isSelected && styles.optionSelected),
                }}
                onClick={() => handleSelect(option.value as string)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}