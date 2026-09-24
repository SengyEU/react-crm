/* eslint-disable */
import React from 'react';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  sortConfig,
  onSort,
  onToggleWrap,
  selectedIds,
  onSelectRow,
  className = '',
  getRowId
}) => {
  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="table-wrapper">
      <table className={`responsive-table ${className}`}>
        {data.length === 0 && (
          <caption>0 záznamů</caption>
        )}
        <thead>
          <tr>
            {onSelectRow && (
              <th>
                {onToggleWrap && (
                  <span
                    onClick={onToggleWrap}
                    style={{ cursor: 'pointer', fontSize: '1.2em', paddingLeft: '1em' }}
                    title="Přepnout zalamování textu"
                  >
                    🔁
                  </span>
                )}
                &nbsp;Vybrat
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                onClick={() => col.sortable !== false && onSort && onSort(col.key)}
                className={`col-${col.key} ${sortConfig?.key === col.key ? 'sorted-colm' : ''}`}
                style={col.headerStyle}
              >
                {col.label} {col.sortable !== false && getSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} id={getRowId ? getRowId(row) : undefined}>
              {onSelectRow && (
                <td key={`sel-${row.id || rowIndex}`}>
                  <input
                    type="checkbox"
                    checked={selectedIds?.has(row.id)}
                    onChange={(e) => onSelectRow(rowIndex, row.id, false)}
                    onClick={(e) => onSelectRow(rowIndex, row.id, e.shiftKey)}
                  />
                </td>
              )}
              {columns.map((col, index) => (
                <td
                  key={col.key || index}
                  className={`col-${col.key} ${sortConfig?.key === col.key ? 'sorted-colm' : ''}`}
                  onClick={() => col.onCellClick && col.onCellClick(row)}
                  style={col.cellStyle}
                >
                  {col.renderCell ? col.renderCell(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
