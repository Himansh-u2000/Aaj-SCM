import { memo } from 'react';
import Checkbox from '../Checkbox/Checkbox';

/**
 * Reusable DataTable component with sortable headers, selection, and responsive columns.
 *
 * @param {Array} columns - Column definitions: { key, label, sortable, align, hideOn, render }
 * @param {Array} data - Row data array
 * @param {string} sortBy - Current sort column key
 * @param {string} sortOrder - 'asc' | 'desc'
 * @param {function} onSort - (columnKey) => void
 * @param {Set} selectedIds - Set of selected row IDs
 * @param {function} onSelect - (id) => void
 * @param {function} onSelectAll - () => void
 * @param {string} rowIdKey - Key to use as row identifier (default: 'id')
 * @param {function} renderActions - (row) => JSX for action buttons
 * @param {function} onRowClick - (row) => void
 * @param {string} selectedRowClass - Class applied to selected rows
 */
const SortIcon = ({ active, direction }) => {
  if (!active) return (
    <svg className="w-3 h-3 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
  return direction === 'asc'
    ? <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
    : <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
};

const DataTable = ({
  columns = [],
  data = [],
  sortBy,
  sortOrder,
  onSort,
  selectedIds,
  onSelect,
  onSelectAll,
  rowIdKey = 'id',
  renderActions,
  selectedRowClass = 'bg-primary-50/30',
}) => {
  const selectable = !!onSelect && !!onSelectAll && !!selectedIds;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-secondary-100 bg-secondary-50/50">
            {selectable && (
              <th className="pl-4 pr-2 py-3 w-10">
                <Checkbox
                  checked={selectedIds.size === data.length && data.length > 0}
                  indeterminate={selectedIds.size > 0 && selectedIds.size < data.length}
                  onChange={onSelectAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.hideOn || ''}`}
              >
                {col.sortable && onSort ? (
                  <button
                    onClick={() => onSort(col.key)}
                    className={`flex items-center gap-1 text-xs font-semibold text-secondary-600 uppercase tracking-wider hover:text-secondary-800 ${col.align === 'right' ? 'ml-auto' : ''}`}
                  >
                    {col.label} <SortIcon active={sortBy === col.key} direction={sortOrder} />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">{col.label}</span>
                )}
              </th>
            ))}
            {renderActions && (
              <th className="px-3 py-3 text-right pr-4">
                <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-50">
          {data.map((row) => (
            <tr
              key={row[rowIdKey]}
              className={`hover:bg-secondary-50/50 transition-colors ${selectable && selectedIds.has(row[rowIdKey]) ? selectedRowClass : ''}`}
            >
              {selectable && (
                <td className="pl-4 pr-2 py-3">
                  <Checkbox checked={selectedIds.has(row[rowIdKey])} onChange={() => onSelect(row[rowIdKey])} />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={`px-3 py-3 ${col.cellClass || ''} ${col.hideOn || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {renderActions && (
                <td className="px-3 py-3 pr-4">
                  <div className="flex items-center justify-end gap-1">
                    {renderActions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(DataTable);
