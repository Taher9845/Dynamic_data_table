import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Column {
  id: string
  label: string
  visible: boolean
}
export interface Row {
  id: string
  name?: string
  email?: string
  age?: number
  role?: string
  [key: string]: string | number | undefined
}

interface TableState {
  columns: Column[]
  rows: Row[]
  search: string
  sortColumn: string | null
  sortOrder: "asc" | "desc"
  page: number
  rowsPerPage: number
}

const initialState: TableState = {
  columns: [
    { id: "name", label: "Name", visible: true },
    { id: "email", label: "Email", visible: true },
    { id: "age", label: "Age", visible: true },
    { id: "role", label: "Role", visible: true }
  ],
  rows: [
    { id: "1", name: "John Doe", email: "john@example.com", age: 28, role: "Developer" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", age: 32, role: "Designer" }
  ],
  search: "",
  sortColumn: null,
  sortOrder: "asc",
  page: 0,
  rowsPerPage: 10
}

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 0
    },

    addColumn(state, action: PayloadAction<{ id: string; label: string }>) {
      const { id, label } = action.payload
      const exists = state.columns.some(c => c.id === id)
      if (!exists) {
        state.columns.push({ id, label, visible: true })
        state.rows.forEach(r => (r[id] = ""))
      }
    },

    toggleColumnVisibility(state, action: PayloadAction<string>) {
      const col = state.columns.find(c => c.id === action.payload)
      if (col) col.visible = !col.visible
    },

    addRow(state, action: PayloadAction<Row>) {
      const exists = state.rows.find(r => r.id === action.payload.id)
      const newRow = exists ? { ...action.payload, id: crypto.randomUUID() } : action.payload
      state.rows.push(newRow)
    },
    updateRow(state, action: PayloadAction<Row>) {
      const index = state.rows.findIndex(r => r.id === action.payload.id)
      if (index !== -1) state.rows[index] = { ...state.rows[index], ...action.payload }
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter(r => r.id !== action.payload)
    },
    sortByColumn(state, action: PayloadAction<string>) {
      const col = action.payload
      if (state.sortColumn === col) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"
      } else {
        state.sortColumn = col
        state.sortOrder = "asc"
      }
      state.rows.sort((a, b) => {
        const aVal = a[col]
        const bVal = b[col]
        if (typeof aVal === "number" && typeof bVal === "number")
          return state.sortOrder === "asc" ? aVal - bVal : bVal - aVal

        const aStr = String(aVal ?? "").toLowerCase()
        const bStr = String(bVal ?? "").toLowerCase()
        return state.sortOrder === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr)
      })

      state.page = 0
    },

    resetToDefault(state) {
      Object.assign(state, initialState)
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload
      state.page = 0
    }
  }
})

export const {
  setSearch,
  addColumn,
  toggleColumnVisibility,
  addRow,
  updateRow,
  deleteRow,
  sortByColumn,
  resetToDefault,
  setPage,
  setRowsPerPage
} = tableSlice.actions

export default tableSlice.reducer
