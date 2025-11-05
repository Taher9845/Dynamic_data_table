'use client'
import { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import ManageColumnsDialog from './manageColumn'
import { Edit, Delete } from '@mui/icons-material'
import {
  setSearch,
  sortByColumn,
  resetToDefault,
  addRow,
  updateRow,
  deleteRow
} from '../store/slices/tableSlice'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  TablePagination
} from '@mui/material'
import { exportCSV } from '../utils/csv'

type Inputs = Record<string, string | number>

export default function TableManager() {
  const dispatch = useAppDispatch()
  const table = useAppSelector(s => s.table)
  const { register, handleSubmit, reset } = useForm<Inputs>()
  const [colsDialog, setColsDialog] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const rows = useMemo(() => table.rows || [], [table.rows])
  const cols = useMemo(() => table.columns || [], [table.columns])
  const { search, sortColumn, sortOrder } = table

  useEffect(() => {
    if (!cols.length || !rows.length) dispatch(resetToDefault())
  }, [cols.length, rows.length, dispatch])
const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  dispatch(setSearch(e.target.value))
}

  const handleOpen = (id?: string) => {
    if (id) {
      const row = rows.find(r => r.id === id)
      if (row) reset(row)
      setEditing(id)
    } else {
      const blank: Inputs = {}
      cols.forEach(c => c.id !== 'id' && (blank[c.id] = ''))
      reset(blank)
      setEditing(null)
    }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const onSubmit = (data: Inputs) => {
    if (editing) dispatch(updateRow({ id: editing, ...data }))
    else dispatch(addRow({ id: uuidv4(), ...data }))
    setOpen(false)
  }

  const delRow = (id: string) => {
    if (confirm('Delete this row?')) dispatch(deleteRow(id))
  }
  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }
  const selectAll = (checked: boolean) => {
    setSelected(checked ? sorted.map(r => r.id) : [])
  }
  const visible = cols.filter(c => c.visible)
  const filtered = rows.filter(r =>
    Object.values(r).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  )
  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = a[sortColumn] ?? ''
    const bVal = b[sortColumn] ?? ''
    if (typeof aVal === 'number' && typeof bVal === 'number')
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  const data = sorted.slice(page * limit, page * limit + limit)
  useEffect(() => setPage(0), [search, sortColumn, sortOrder])
  return (
    <Box sx={t => ({
      backgroundColor: t.palette.background.default,
      minHeight: '100vh',
      py: 4,
      px: { xs: 2, md: 8 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    })}>
      <Paper sx={t => ({
        width: '100%',
        maxWidth: 950,
        borderRadius: 3,
        p: 3,
        backgroundColor: t.palette.background.paper,
        color: t.palette.text.primary,
        boxShadow:
          t.palette.mode === 'light'
            ? '0px 3px 10px rgba(0,0,0,0.1)'
            : '0px 2px 8px rgba(0,0,0,0.5)',
        transition: 'all .3s ease'
      })}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Data Table Manager
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1.5} mb={2.5}>
          <TextField
            placeholder="Search..."
            size="small"
            value={search}
            onChange={handleSearch}
            sx={{ width: { xs: '100%', sm: '50%' } }}
          />
          <Button variant="outlined" onClick={() => setColsDialog(true)}>Manage Columns</Button>
          <Button variant="outlined" component="label">
            Import CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={async e => {
                const f = e.target.files?.[0]
                if (!f) return
                const { importCSV } = await import('../utils/csv')
                const { rows, newColumns, error } = await importCSV(f, cols)
                if (error) alert('Import failed: ' + error)
                else {
                  newColumns.forEach(c => dispatch({ type: 'table/addColumn', payload: c }))
                  rows.forEach(r => dispatch(addRow({ ...r, id: uuidv4() })))
                }
                e.target.value = ''
              }}
            />
          </Button>
          <Button variant="outlined" onClick={() => exportCSV(rows, cols)}>Export CSV</Button>
        </Box>
        <TableContainer component={Paper} sx={t => ({
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: t.palette.background.paper,
          boxShadow:
            t.palette.mode === 'light'
              ? '0px 2px 8px rgba(0,0,0,0.08)'
              : '0px 2px 8px rgba(0,0,0,0.6)'
        })}>
          <Table>
            <TableHead>
              <TableRow sx={t => ({
                backgroundColor:
                  t.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : '#f3f4f6'
              })}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === sorted.length && sorted.length > 0}
                    indeterminate={selected.length > 0 && selected.length < sorted.length}
                    onChange={e => selectAll(e.target.checked)}
                  />
                </TableCell>
                {visible.map(c => (
                  <TableCell
                    key={c.id}
                    onClick={() => dispatch(sortByColumn(c.id))}
                    sx={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    {c.label}
                    {sortColumn === c.id ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((r, i) => (
                <TableRow key={`${r.id}-${i}`} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                    />
                  </TableCell>
                  {visible.map(c => (
                    <TableCell key={c.id}>{r[c.id]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(r.id)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => delRow(r.id)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={visible.length + 2} align="center" sx={{ py: 3, color: 'gray' }}>
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sorted.length}
          page={page}
          onPageChange={(_, n) => setPage(n)}
          rowsPerPage={limit}
          onRowsPerPageChange={e => {
            setLimit(parseInt(e.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <ManageColumnsDialog open={colsDialog} onClose={() => setColsDialog(false)} />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Row' : 'Add Row'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cols.filter(c => c.id !== 'id').map(c => (
              <TextField
                key={c.id}
                label={c.label}
                type={
                  typeof rows[0]?.[c.id] === 'number' || c.id === 'age'
                    ? 'number'
                    : 'text'
                }
                {...register(c.id)}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editing ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
