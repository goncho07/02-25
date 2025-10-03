import React from 'react';
import { Search, X } from 'lucide-react';

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  activeFilters: Filter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="relative flex-1 min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Buscar..."
        />
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
            >
              {filter.label}: {filter.value}
              <button
                onClick={() => onRemoveFilter(filter.id)}
                className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100"
                aria-label={`Remover filtro ${filter.label}`}
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;