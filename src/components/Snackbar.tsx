'use client'

import { Snackbar, Alert } from '@mui/material'

type Props = {
  open: boolean
  message: string
  severity?: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
}

export default function SnackbarAlert({ open, message, severity = 'success', onClose }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
