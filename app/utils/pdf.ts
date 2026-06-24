import type { JobApplication } from '~/stores/applications'

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    applied: 'Postulé',
    interview: 'Entretien',
    rejected: 'Refusé',
    accepted: 'Accepté'
  }
  return labels[status] || status
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function exportToPDF(applications: JobApplication[]): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert("Impossible d'ouvrir la fenêtre d'impression. Veuillez autoriser les fenêtres contextuelles (pop-ups).")
    return
  }

  const rowsHtml = applications
    .map(
      app => `
    <tr>
      <td>
        <div style="font-weight: bold; font-size: 13px;">${app.company_name || '—'}</div>
        <div style="color: #71717a; font-size: 11px; margin-top: 2px;">${app.job_profile || '—'}</div>
      </td>
      <td>
        <span class="status-badge status-${app.status || 'draft'}">
          ${getStatusLabel(app.status)}
        </span>
      </td>
      <td style="white-space: nowrap;">
        ${app.proposed_salary ? app.proposed_salary : '—'}
      </td>
      <td style="white-space: nowrap;">
        ${formatDate(app.applied_at)}
      </td>
      <td style="max-width: 250px; font-size: 11px; line-height: 1.4;">
        ${app.main_missions ? app.main_missions.replace(/\n/g, '<br>') : '—'}
      </td>
      <td style="max-width: 200px; font-size: 11px; line-height: 1.4; color: #71717a;">
        ${app.company_feedback ? app.company_feedback.replace(/\n/g, '<br>') : '—'}
      </td>
    </tr>
  `
    )
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>JobTracker — Rapport de candidatures</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            padding: 30px;
            color: #09090b;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #09090b;
            padding-bottom: 12px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .meta {
            font-size: 11px;
            color: #71717a;
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: #f4f4f5;
            color: #71717a;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 10px 12px;
            border-bottom: 2px solid #e2e8f0;
          }
          td {
            padding: 12px;
            font-size: 12px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
          }
          tr:nth-child(even) td {
            background-color: #fafafa;
          }
          .status-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-draft { background-color: #e4e4e7 !important; color: #3f3f46 !important; }
          .status-applied { background-color: #dbeafe !important; color: #1e40af !important; }
          .status-interview { background-color: #ffedd5 !important; color: #9a3412 !important; }
          .status-rejected { background-color: #fee2e2 !important; color: #991b1b !important; }
          .status-accepted { background-color: #d1fae5 !important; color: #065f46 !important; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">📋 JobTracker</div>
            <div style="font-size: 12px; color: #71717a; margin-top: 4px;">Rapport d'activité des candidatures</div>
          </div>
          <div class="meta">
            <div>Généré le ${new Date().toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}</div>
            <div>Total : ${applications.length} candidatures</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Entreprise</th>
              <th style="width: 12%;">Statut</th>
              <th style="width: 13%;">Salaire</th>
              <th style="width: 12%;">Date cand.</th>
              <th style="width: 25%;">Missions principales</th>
              <th style="width: 18%;">Notes / Retours</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="6" style="text-align: center; color: #71717a; padding: 30px;">Aucune candidature enregistrée.</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.focus()

  // Wait for font load to ensure styling is complete before PDF printing
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 350)
}
