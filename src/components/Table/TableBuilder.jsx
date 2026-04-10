import React, { useState } from 'react'
import styles from './TableBuilder.module.css'

const generateId = () => Math.random().toString(36).slice(2, 9)

const DEFAULT_COLUMNS = [
  { id: generateId(), name: 'Name' },
  { id: generateId(), name: 'Status' },
  { id: generateId(), name: 'Notes' },
]

export default function TableBuilder() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [rows, setRows] = useState([
    { id: generateId(), cells: Object.fromEntries(DEFAULT_COLUMNS.map((c) => [c.id, ''])) },
  ])
  const [editingColId, setEditingColId] = useState(null)
  const [newColName, setNewColName] = useState('')
  const [addingCol, setAddingCol] = useState(false)

  const addRow = () => {
    setRows((r) => [
      ...r,
      { id: generateId(), cells: Object.fromEntries(columns.map((c) => [c.id, ''])) },
    ])
  }

  const removeRow = (rowId) => {
    setRows((r) => r.filter((row) => row.id !== rowId))
  }

  const updateCell = (rowId, colId, value) => {
    setRows((r) =>
      r.map((row) =>
        row.id === rowId ? { ...row, cells: { ...row.cells, [colId]: value } } : row
      )
    )
  }

  const addColumn = () => {
    if (!newColName.trim()) return
    const col = { id: generateId(), name: newColName.trim() }
    setColumns((c) => [...c, col])
    setRows((r) =>
      r.map((row) => ({ ...row, cells: { ...row.cells, [col.id]: '' } }))
    )
    setNewColName('')
    setAddingCol(false)
  }

  const removeColumn = (colId) => {
    if (columns.length === 1) return
    setColumns((c) => c.filter((col) => col.id !== colId))
    setRows((r) =>
      r.map((row) => {
        const { [colId]: _, ...rest } = row.cells
        return { ...row, cells: rest }
      })
    )
  }

  const renameColumn = (colId, name) => {
    setColumns((c) => c.map((col) => (col.id === colId ? { ...col, name } : col)))
    setEditingColId(null)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button className={styles.btnSecondary} onClick={addRow}>
          + Add row
        </button>
        {!addingCol ? (
          <button className={styles.btnSecondary} onClick={() => setAddingCol(true)}>
            + Add column
          </button>
        ) : (
          <div className={styles.addColForm}>
            <input
              autoFocus
              placeholder="Column name"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addColumn()
                if (e.key === 'Escape') { setAddingCol(false); setNewColName('') }
              }}
            />
            <button className={styles.btnPrimary} onClick={addColumn}>Add</button>
            <button className={styles.btnGhost} onClick={() => { setAddingCol(false); setNewColName('') }}>Cancel</button>
          </div>
        )}
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id}>
                  {editingColId === col.id ? (
                    <input
                      autoFocus
                      className={styles.colInput}
                      defaultValue={col.name}
                      onBlur={(e) => renameColumn(col.id, e.target.value || col.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') renameColumn(col.id, e.target.value || col.name)
                        if (e.key === 'Escape') setEditingColId(null)
                      }}
                    />
                  ) : (
                    <div className={styles.colHeader}>
                      <span
                        className={styles.colName}
                        onClick={() => setEditingColId(col.id)}
                        title="Click to rename"
                      >
                        {col.name}
                      </span>
                      {columns.length > 1 && (
                        <button
                          className={styles.removeCol}
                          onClick={() => removeColumn(col.id)}
                          title="Remove column"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </th>
              ))}
              <th className={styles.actionCol}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.empty}>
                  No rows yet. Click "+ Add row" to get started.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.id}>
                      <input
                        className={styles.cellInput}
                        value={row.cells[col.id] ?? ''}
                        onChange={(e) => updateCell(row.id, col.id, e.target.value)}
                        placeholder="—"
                      />
                    </td>
                  ))}
                  <td className={styles.actionCol}>
                    <button
                      className={styles.removeRow}
                      onClick={() => removeRow(row.id)}
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
