'use client';

import * as React from 'react';
import { cn } from '@lib/utils';
import { Input } from './input';
import { Popover, PopoverAnchor, PopoverContent } from './popover';

export interface AutocompleteOption {
  value: string | number;
  label: string;
}

interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (option: T) => void;
  onFocus?: (value: string) => void;
  options: T[];
  placeholder?: string;
  renderOption?: (option: T) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  dataTour?: string;
}

const Autocomplete = <T extends AutocompleteOption = AutocompleteOption>({
  value,
  onChange,
  onSelect,
  onFocus,
  options,
  placeholder,
  renderOption,
  isLoading = false,
  emptyMessage = 'No results found',
  className,
  disabled,
  dataTour,
}: AutocompleteProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const [inputWidth, setInputWidth] = React.useState<number>(0);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [value, open]);

  React.useEffect(() => {
    if (options.length === 0) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex((currentIndex) => {
      if (currentIndex < 0) {
        return 0;
      }

      return Math.min(currentIndex, options.length - 1);
    });
  }, [options]);

  const handleSelect = (option: T) => {
    onChange(option.label);
    onSelect?.(option);
    setHighlightedIndex(-1);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setHighlightedIndex(0);
    if (!open) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(0);
        return;
      }

      setHighlightedIndex((currentIndex) => Math.min(currentIndex + 1, options.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(Math.max(options.length - 1, 0));
        return;
      }

      setHighlightedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }

    if (e.key === 'Enter' && open && highlightedIndex >= 0 && options[highlightedIndex]) {
      e.preventDefault();
      handleSelect(options[highlightedIndex]);
    }
  };

  const handleFocus = () => {
    if (!disabled) {
      setOpen(true);
      if (options.length > 0 && highlightedIndex < 0) {
        setHighlightedIndex(0);
      }
    }

    onFocus?.(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          ref={inputRef}
          data-tour={dataTour}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
      </PopoverAnchor>
      <PopoverContent
        className="p-1"
        style={{ width: inputWidth > 0 ? `${inputWidth}px` : 'auto' }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <div className="text-muted-foreground px-2 py-4 text-center text-sm">Loading...</div>
        ) : options.length === 0 ? (
          <div className="text-muted-foreground px-2 py-4 text-center text-sm">{emptyMessage}</div>
        ) : (
          <ul className="max-h-60 overflow-y-auto" role="listbox">
            {options.map((option, index) => (
              <li
                key={option.value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={highlightedIndex === index}
                className={cn(
                  'cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none',
                  highlightedIndex === index
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {renderOption ? renderOption(option) : option.label}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { Autocomplete };
