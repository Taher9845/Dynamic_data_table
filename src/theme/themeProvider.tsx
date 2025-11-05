'use client'
import React, { useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Button } from '@mui/material'

const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeMode') as 'light' | 'dark'
      return saved || 'light'
    }
    return 'light'
  })

  const toggleTheme = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light'
    setMode(nextMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', nextMode)
    }
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: {
                  default: '#121212',
                  paper: '#1E1E1E'
                },
                text: {
                  primary: '#fff',
                  secondary: '#bbb'
                }
              }
            : {
                background: {
                  default: '#f7f8fa',
                  paper: '#fff'
                },
                text: {
                  primary: '#000',
                  secondary: '#444'
                }
              })
        },
        shape: { borderRadius: 10 },
        typography: {
          fontFamily: "'Inter', 'Roboto', sans-serif"
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s ease'
              }
            }
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s ease'
              }
            }
          }
        }
      }),
    [mode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ position: 'fixed', top: 12, left: 12, zIndex: 2000 }}>
        <Button
          onClick={toggleTheme}
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            fontWeight: 500,
            borderColor: mode === 'dark' ? '#666' : '#ccc',
            backgroundColor: mode === 'dark' ? '#2b2b2b' : '#fff',
            color: mode === 'dark' ? '#fff' : '#333',
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#3a3a3a' : '#f5f5f5'
            }
          }}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
      {children}
    </ThemeProvider>
  )
}

export default ThemeProviderWrapper
