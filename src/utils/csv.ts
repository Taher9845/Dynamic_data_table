import Papa from "papaparse"
import { saveAs } from "file-saver"
import type { Row, Column } from "../store/slices/tableSlice"

export const importCSV = async (
  file: File,
  existingColumns: Column[]
): Promise<{ rows: Row[]; newColumns: Column[]; error?: string }> => {
  return new Promise(resolve => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const data = results.data as Record<string, string>[]

        if (!data.length) {
          resolve({ rows: [], newColumns: [], error: "Empty CSV file" })
          return
        }
        const normalize = (s: string) => s.trim().toLowerCase()
        const csvHeaders = Object.keys(data[0]).map(normalize)
        const existingMap = Object.fromEntries(
          existingColumns.map(c => [normalize(c.label), c.id])
        )

        const newColumns = csvHeaders
          .filter(h => !Object.keys(existingMap).includes(h))
          .map(h => ({
            id: h.replace(/\s+/g, "_"),
            label: h.charAt(0).toUpperCase() + h.slice(1),
            visible: true
          }))

        const headerMap = {
          ...existingMap,
          ...Object.fromEntries(newColumns.map(c => [normalize(c.label), c.id]))
        }

        const rows = data
          .filter(row => Object.values(row).some(v => v.trim() !== ""))
          .map((item, i) => {
            const row: Row = { id: String(i + 1) }
            for (const key in item) {
              const mapped = headerMap[normalize(key)]
              if (mapped) row[mapped] = item[key]
            }
            return row
          })

        resolve({ rows, newColumns })
      },
      error: err => {
        resolve({ rows: [], newColumns: [], error: err.message })
      }
    })
  })
}
export const exportCSV = (rows: Row[], columns: Column[]) => {
  const visibleCols = columns.filter(c => c.visible)
  const headers = visibleCols.map(c => c.label)
  const data = rows.map(r => visibleCols.map(c => r[c.id] ?? ""))

  const csv = Papa.unparse({
    fields: headers,
    data
  })
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, "table_export.csv")
}
