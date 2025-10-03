import React from 'react';
import { COLORS, SPACING, TYPOGRAPHY } from '@/core/constants';

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    title: string;
    render?: (value: any, record: T) => React.ReactNode;
    width?: number | string;
    sortable?: boolean;
  }[];
  onSort?: (key: keyof T, order: 'asc' | 'desc') => void;
  onRowClick?: (record: T) => void;
  selectedRows?: string[];
  loading?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: COLORS.BACKGROUND.PAPER,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: COLORS.GREY[50],
  },
  headerCell: {
    padding: SPACING.MD,
    textAlign: 'left',
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.TEXT.SECONDARY,
    borderBottom: `1px solid ${COLORS.GREY[200]}`,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  },
  row: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: COLORS.GREY[50],
    },
  },
  rowSelected: {
    backgroundColor: `${COLORS.PRIMARY.LIGHT}20`,
  },
  cell: {
    padding: SPACING.MD,
    borderBottom: `1px solid ${COLORS.GREY[100]}`,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT.PRIMARY,
  },
  sortIcon: {
    marginLeft: SPACING.XS,
    verticalAlign: 'middle',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onSort,
  onRowClick,
  selectedRows = [],
  loading,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | string;
    order: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof T | string) => {
    if (!onSort) return;

    const order =
      sortConfig?.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order });
    onSort(key as keyof T, order);
  };

  const renderSortIcon = (key: keyof T | string) => {
    if (sortConfig?.key !== key) return null;

    return (
      <span style={styles.sortIcon}>
        {sortConfig.order === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <table style={styles.table}>
        <thead style={styles.header}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                style={{
                  ...styles.headerCell,
                  width: column.width,
                  cursor: column.sortable ? 'pointer' : 'default',
                }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.title}
                {column.sortable && renderSortIcon(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr
              key={record.id}
              style={{
                ...styles.row,
                ...(selectedRows.includes(record.id) && styles.rowSelected),
              }}
              onClick={() => onRowClick?.(record)}
            >
              {columns.map((column) => (
                <td key={column.key.toString()} style={styles.cell}>
                  {column.render
                    ? column.render(record[column.key as keyof T], record)
                    : record[column.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div>Cargando...</div>
        </div>
      )}
    </div>
  );
}