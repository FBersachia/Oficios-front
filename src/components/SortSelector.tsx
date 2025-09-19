import React from 'react';
import { ChevronDown, ArrowUpDown, Star, Clock, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type SortOption =
  | 'relevance'
  | 'rating'
  | 'recent'
  | 'distance'
  | 'popularity'
  | 'name_asc'
  | 'name_desc';

interface SortConfig {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface SortSelectorProps {
  value?: SortOption;
  onChange?: (sort: SortOption) => void;
  options?: SortOption[];
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
  showIcon?: boolean;
}

const sortConfigs: Record<SortOption, SortConfig> = {
  relevance: {
    value: 'relevance',
    label: 'Relevancia',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Los más relevantes para tu búsqueda',
  },
  rating: {
    value: 'rating',
    label: 'Mejor calificados',
    icon: <Star className="h-4 w-4" />,
    description: 'Ordenado por calificación promedio',
  },
  recent: {
    value: 'recent',
    label: 'Más recientes',
    icon: <Clock className="h-4 w-4" />,
    description: 'Proveedores registrados recientemente',
  },
  distance: {
    value: 'distance',
    label: 'Más cercanos',
    icon: <MapPin className="h-4 w-4" />,
    description: 'Ordenado por proximidad a tu ubicación',
  },
  popularity: {
    value: 'popularity',
    label: 'Más populares',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Los que más reseñas tienen',
  },
  name_asc: {
    value: 'name_asc',
    label: 'Nombre A-Z',
    icon: <ArrowUpDown className="h-4 w-4" />,
    description: 'Ordenado alfabéticamente',
  },
  name_desc: {
    value: 'name_desc',
    label: 'Nombre Z-A',
    icon: <ArrowUpDown className="h-4 w-4" />,
    description: 'Ordenado alfabéticamente descendente',
  },
};

const defaultOptions: SortOption[] = [
  'relevance',
  'rating',
  'recent',
  'distance',
  'popularity',
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  value = 'relevance',
  onChange,
  options = defaultOptions,
  disabled = false,
  className = '',
  variant = 'default',
  showIcon = true,
}) => {
  const currentSort = sortConfigs[value];
  const availableOptions = options.map(option => sortConfigs[option]);

  const handleSortChange = (sortOption: SortOption) => {
    if (onChange && !disabled) {
      onChange(sortOption);
    }
  };

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className={cn(
              'inline-flex items-center space-x-2 min-w-0',
              className
            )}
          >
            {showIcon && currentSort.icon}
            <span className="truncate">{currentSort.label}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                'flex items-center space-x-3 cursor-pointer',
                value === option.value && 'bg-blue-50 text-blue-700'
              )}
            >
              {option.icon}
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn('inline-block text-left', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="inline-flex items-center space-x-2 px-4 py-2"
          >
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Ordenar por:</span>
            <span className="text-sm text-gray-700">{currentSort.label}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {availableOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                'flex items-start space-x-3 p-3 cursor-pointer',
                value === option.value && 'bg-blue-50 text-blue-700'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {option.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{option.label}</span>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                {option.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Simple sort selector without dropdown (for mobile or inline use)
interface SimpleSortSelectorProps {
  value?: SortOption;
  onChange?: (sort: SortOption) => void;
  options?: SortOption[];
  disabled?: boolean;
  className?: string;
}

export const SimpleSortSelector: React.FC<SimpleSortSelectorProps> = ({
  value = 'relevance',
  onChange,
  options = defaultOptions,
  disabled = false,
  className = '',
}) => {
  const availableOptions = options.map(option => sortConfigs[option]);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {availableOptions.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange?.(option.value)}
          disabled={disabled}
          className={cn(
            'inline-flex items-center space-x-1 text-xs',
            value === option.value && 'bg-blue-600 text-white'
          )}
        >
          {option.icon}
          <span>{option.label}</span>
        </Button>
      ))}
    </div>
  );
};

// Hook for managing sort state
export const useSortState = (initialSort: SortOption = 'relevance') => {
  const [sortBy, setSortBy] = React.useState<SortOption>(initialSort);

  const handleSortChange = React.useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, []);

  return {
    sortBy,
    setSortBy,
    handleSortChange,
  };
};

export default SortSelector;