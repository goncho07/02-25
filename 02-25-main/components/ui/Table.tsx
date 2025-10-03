import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  onSort?: (config: SortConfig | null) => void;
  sortConfig: SortConfig | null;
  selectable?: boolean;
  selectedRowIds?: Set<string | number>;
  onSelect?: (id: string | number) => void;
  onSelectAll?: (ids: Array<string | number>) => void;
  className?: string;
}

const Table = <T extends {}>({
  columns,
  rows,
  getRowId,
  onSort,
  sortConfig,
  selectable = false,
  selectedRowIds = new Set(),
  onSelect,
  onSelectAll,
  className = ''
}: TableProps<T>) => {
  const handleHeaderClick = (key: string) => {
    if (!onSort) return;
    
    if (!sortConfig || sortConfig.key !== key) {
      onSort({ key, direction: 'asc' });
    } else {
      onSort(
        sortConfig.direction === 'asc'
          ? { key, direction: 'desc' }
          : null
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {selectable && (
              <th className="px-6 py-3 w-4">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (onSelectAll) {
                      onSelectAll(
                        e.target.checked
                          ? rows.map(row => getRowId(row))
                          : []
                      );
                    }
                  }}
                  checked={selectedRowIds.size === rows.length}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleHeaderClick(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${onSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {sortConfig?.key === column.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row) => {
            const id = getRowId(row);
            return (
              <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {selectable && (
                  <td className="px-6 py-4 w-4">
                    <input
                      type="checkbox"
                      onChange={() => onSelect?.(id)}
                      checked={selectedRowIds.has(id)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={`${id}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;