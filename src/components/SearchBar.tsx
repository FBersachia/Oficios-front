import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  type: 'service' | 'location' | 'provider' | 'recent';
  text: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
  loading?: boolean;
  disabled?: boolean;
  showRecentSearches?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  placeholder = 'Buscar proveedores, servicios o ubicaciones...',
  suggestions = [],
  recentSearches = [],
  onSearch,
  onChange,
  onSuggestionSelect,
  onClear,
  loading = false,
  disabled = false,
  showRecentSearches = true,
  className = '',
  size = 'md',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-13 text-lg',
  };

  // Combine suggestions with recent searches
  const allSuggestions: SearchSuggestion[] = [
    ...suggestions,
    ...(showRecentSearches && recentSearches.length > 0 && inputValue.trim() === ''
      ? recentSearches.map((search, index) => ({
          id: `recent-${index}`,
          type: 'recent' as const,
          text: search,
          icon: <Clock className="h-4 w-4 text-gray-400" />,
        }))
      : []),
  ];

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearch = (searchValue: string = inputValue) => {
    if (searchValue.trim()) {
      onSearch?.(searchValue.trim());
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    onClear?.();
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.text);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);

    // If it's a search suggestion, trigger search immediately
    if (suggestion.type !== 'recent') {
      handleSearch(suggestion.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || allSuggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(allSuggestions[highlightedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;

    switch (suggestion.type) {
      case 'service':
        return <Search className="h-4 w-4 text-blue-500" />;
      case 'location':
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'provider':
        return <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-purple-600">P</span>
        </div>;
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={cn(
            'text-gray-400',
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          )} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'block w-full pl-10 pr-12 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'placeholder-gray-500 transition-colors',
            sizeClasses[size],
            disabled && 'opacity-50 cursor-not-allowed',
            'bg-white'
          )}
        />

        {/* Clear Button */}
        {inputValue && !disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-full px-3 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Recent Searches Header */}
          {showRecentSearches && recentSearches.length > 0 && inputValue.trim() === '' && (
            <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
              Búsquedas recientes
            </div>
          )}

          {/* Suggestions List */}
          <div className="py-1">
            {allSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                  'flex items-center space-x-3 transition-colors',
                  index === highlightedIndex && 'bg-blue-50 text-blue-700'
                )}
              >
                <div className="flex-shrink-0">
                  {getSuggestionIcon(suggestion)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.text}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.subtitle}
                    </div>
                  )}
                </div>
                {suggestion.type === 'recent' && (
                  <div className="text-xs text-gray-400">
                    Reciente
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;