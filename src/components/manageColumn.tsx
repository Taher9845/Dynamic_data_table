'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store'
import { toggleColumnVisibility, addColumn } from '../store/slices/tableSlice'

export default function ManageColumnsDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const dispatch = useAppDispatch()
  const columns = useAppSelector(state => state.table.columns)
  const [newCol, setNewCol] = useState('')

  const addNewColumn = () => {
    const val = newCol.trim()
    if (!val) return
    const id = val.toLowerCase().replace(/\s+/g, '_')
    dispatch(addColumn({ id, label: val }))
    setNewCol('')
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Manage Columns</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
          Show or Hide Columns
        </Typography>

        <FormGroup>
          {columns.map(col => (
            <FormControlLabel
              key={col.id}
              control={
                <Checkbox
                  checked={col.visible}
                  onChange={() => dispatch(toggleColumnVisibility(col.id))}
                />
              }
              label={col.label}
            />
          ))}
        </FormGroup>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Add New Column
        </Typography>

        <Box display="flex" gap={1} mt={1}>
          <TextField
            label="Column name"
            size="small"
            fullWidth
            value={newCol}
            onChange={e => setNewCol(e.target.value)}
          />
          <Button variant="contained" onClick={addNewColumn}>
            Add
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
