/* eslint-disable */
import React from 'react';
import './DataTable.css';

/**
 * Univerzální tabulka.
 *
 * columns: [{
 *   key,                 // klíč do row (povinné)
 *   label,               // text hlavičky (ReactNode)
 *   sortable,            // výchozí true; false = neklikatelná hlavička
 *   headerStyle, cellStyle,
 *   headerClassName,     // string | (row) => string   (navíc ke col-<key>)
 *   cellClassName,       // string | (row) => string   (navíc ke col-<key>)
 *   colClass,            // false = nepřidávat col-<key> třídu (chrání CSS typu .col-id)
 *   dataLabel,           // hodnota atributu data-label (mobilní layout)
 *   sortIcon,            // false = nezobrazovat ▲/▼
 *   onCellClick,         // (row) => void
 *   renderCell,          // (row, rowIndex) => ReactNode
 * }]
 *
 * data, sortConfig {key,direction}, onSort(key),
 * onToggleWrap()        – 🔁 přepínání zalamování (řadí se do selekční hlavičky,
 *                         jinak do prvního <th>; klik na něj neřadí)
 * selectedIds, onSelectRow(rowIndex, id, shiftKey)  – výběrový sloupec
 * renderSelectHeader(), renderSelectCell(row, rowIndex) – vlastní obsah výběrového sloupce
 * getRowKey(row, i)     – React key + identita checkboxu (výchozí row.id ?? i)
 * getRowId(row)         – atribut id na <tr>
 * rowClassName(row)     – třída na <tr>
 * caption,              – ReactNode do <caption> (např. <h3>Nadpis</h3>)
 * footer,               – obsah <tfoot> (obalen do <tr><td colSpan>)
 * extraRow,             – ReactNode s <td> připojený jako poslední řádek <tbody>
 * className,            – třídy na <table>
 * responsive,           – false = NEpřidávat třídu responsive-table
 *                         (tabulky, které ji původně neměly, zůstanou vizuálně stejné)
 * style                 – inline styl na <table>
 */
const DataTable = ({
  columns,
  data,
  sortConfig,
  onSort,
  onToggleWrap,
  selectedIds,
  onSelectRow,
  renderSelectHeader,
  renderSelectCell,
  getRowKey,
  getRowId,
  rowClassName,
  caption,
  footer,
  extraRow,
  className = '',
  responsive = true,
  style,
}) => {
  const keyOf = getRowKey || ((row, index) => row.id ?? index);

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const showSelect = Boolean(onSelectRow || renderSelectHeader || renderSelectCell);
  const totalCols = (showSelect ? 1 : 0) + columns.length;

  const handleSortClick = (event, key) => {
    if (!onSort) return;
    if (event.target.closest('button, a, input, select, textarea, label')) return;
    if (columns.find((c) => c.key === key)?.sortable === false) return;
    onSort(key);
  };

  const thClass = (col) =>
    [col.colClass === false ? '' : `col-${col.key}`,
      sortConfig?.key === col.key ? 'sorted-colm' : '',
      typeof col.headerClassName === 'function' ? '' : col.headerClassName]
      .filter(Boolean)
      .join(' ');

  const tdClass = (col, row) =>
    [col.colClass === false ? '' : `col-${col.key}`,
      sortConfig?.key === col.key ? 'sorted-colm' : '',
      typeof col.cellClassName === 'function' ? col.cellClassName(row) : col.cellClassName]
      .filter(Boolean)
      .join(' ');

  const wrapToggle = onToggleWrap ? (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onToggleWrap();
      }}
      style={{ cursor: 'pointer', fontSize: '1.2em' }}
      title="Přepnout zalamování textu"
    >
      🔁
    </span>
  ) : null;

  return (
    <div className="table-wrapper">
      <table
        className={`${responsive ? 'responsive-table' : ''} ${className}`.trim()}
        style={style}
      >
        {caption != null && <caption>{caption}</caption>}
        {!caption && data.length === 0 && <caption>0 záznamů</caption>}
        <thead>
          <tr>
            {showSelect && (
              <th>
                {renderSelectHeader
                  ? renderSelectHeader()
                  : (
                    <>
                      {wrapToggle}
                      {onSelectRow && <>&nbsp;Vybrat</>}
                    </>
                  )}
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                onClick={(e) => handleSortClick(e, col.key)}
                className={thClass(col)}
                style={col.headerStyle}
              >
                {!showSelect && index === 0 && wrapToggle && <>{wrapToggle}&nbsp;</>}
                {col.label} {col.sortable !== false && col.sortIcon !== false && getSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = keyOf(row, rowIndex);
            return (
              <tr
                key={rowKey}
                id={getRowId ? getRowId(row) : undefined}
                className={rowClassName ? rowClassName(row) : undefined}
              >
                {showSelect && (
                  <td key={`sel-${rowKey}`}>
                    {renderSelectCell
                      ? renderSelectCell(row, rowIndex)
                      : (
                        <input
                          type="checkbox"
                          checked={selectedIds?.has(rowKey)}
                          onChange={(e) => onSelectRow(rowIndex, rowKey, e.nativeEvent.shiftKey)}
                        />
                      )}
                  </td>
                )}
                {columns.map((col, index) => (
                  <td
                    key={col.key || index}
                    className={tdClass(col, row)}
                    onClick={col.onCellClick ? () => col.onCellClick(row) : undefined}
                    style={col.cellStyle}
                    data-label={col.dataLabel}
                  >
                    {col.renderCell ? col.renderCell(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
          {data.length === 0 && caption != null && (
            <tr className="empty-row">
              <td colSpan={totalCols}>0 záznamů</td>
            </tr>
          )}
          {extraRow && <tr key="__extra__">{extraRow}</tr>}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              <td colSpan={totalCols}>{footer}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default DataTable;
