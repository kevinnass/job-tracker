import type { JobApplication } from '~/stores/applications'

const escapeCsvField = (val: any): string => {
  if (val === null || val === undefined) return '""'
  const stringified = String(val)
  const escaped = stringified.replace(/"/g, '""')
  return `"${escaped}"`
}

export function generateCSV(applications: JobApplication[]): void {
  const headers = [
    'Entreprise',
    'Poste',
    'Statut',
    'Salaire',
    'Lien',
    'Date de candidature',
    'Infos entreprise',
    'Missions principales',
    'Notes / Retours'
  ]

  const rows = applications.map(app => [
    app.company_name || '',
    app.job_profile || '',
    app.status || '',
    app.proposed_salary || '',
    app.url || '',
    app.applied_at || '',
    app.company_info || '',
    app.main_missions || '',
    app.company_feedback || ''
  ])

  const csvContent = [
    headers.map(escapeCsvField).join(','),
    ...rows.map(row => row.map(escapeCsvField).join(','))
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `jobtracker-export-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  let i = 0
  while (i < text.length) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentField += '"'
        i += 2
      } else {
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField)
      currentField = ''
      i++
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      currentRow.push(currentField)
      currentField = ''
      if (currentRow.length > 0 && currentRow.some(f => f.trim() !== '')) {
        rows.push(currentRow)
      }
      currentRow = []
      if (char === '\r' && text[i + 1] === '\n') {
        i += 2
      } else {
        i++
      }
    } else {
      currentField += char
      i++
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField)
    if (currentRow.some(f => f.trim() !== '')) {
      rows.push(currentRow)
    }
  }

  if (rows.length < 2) return []

  // Nettoyage et normalisation des en-têtes
  const headers = rows[0].map(h => h.trim().toLowerCase())
  const dataRows = rows.slice(1)

  return dataRows.map(row => {
    const obj: Record<string, string> = {}
    headers.forEach((header, index) => {
      if (index < row.length) {
        obj[header] = row[index]
      } else {
        obj[header] = ''
      }
    })
    return obj
  })
}
