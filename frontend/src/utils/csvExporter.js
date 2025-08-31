// Utility to export analysis data as CSV files
// Accepts meta info and multiple datasets and triggers a single CSV download

function toCsvRow(values) {
  return values
    .map((v) => {
      if (v == null) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    })
    .join(',');
}

function downloadBlob(content, filename, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCSV({ meta = {}, datasets = {} }) {
  const lines = [];
  // Meta header
  lines.push('Section,Key,Value');
  lines.push(toCsvRow(['Meta', 'Location', meta.locationName || '']));
  lines.push(toCsvRow(['Meta', 'Coordinates', meta.coords || '']));
  lines.push(toCsvRow(['Meta', 'Viability Score', meta.overallScore ?? '']));
  lines.push(toCsvRow(['Meta', 'Risk Level', meta.riskLevel || '']));
  lines.push('');

  // Resource Allocation
  if (Array.isArray(datasets.resourceAllocation)) {
    lines.push('Resource Allocation');
    lines.push('Name,Percent,Amount (Cr)');
    datasets.resourceAllocation.forEach((row) => {
      lines.push(toCsvRow([row.name, row.value, row.amount]));
    });
    lines.push('');
  }

  // Cost Projections
  if (Array.isArray(datasets.costProjection)) {
    lines.push('Cost Projections Over Time');
    lines.push('Year,Production Cost (₹/kg),Cumulative Savings (₹/kg)');
    datasets.costProjection.forEach((row) => {
      lines.push(toCsvRow([row.year, row.cost, row.cumulativeSavings]));
    });
    lines.push('');
  }

  // ROI Chart
  if (Array.isArray(datasets.roi)) {
    lines.push('ROI Projections');
    lines.push('Year,Cumulative ROI (%)');
    datasets.roi.forEach((row) => {
      lines.push(toCsvRow([row.year, row.roi]));
    });
    lines.push('');
  }

  // Financial Projections
  if (Array.isArray(datasets.financial)) {
    lines.push('20-Year Financial Projections');
    lines.push('Year,Revenue (Cr),OPEX (Cr),Profit (Cr),Cumulative Cash Flow (Cr)');
    datasets.financial.forEach((row) => {
      lines.push(toCsvRow([row.year, row.revenue, row.opex, row.profit, row.cumulativeCashFlow]));
    });
    lines.push('');
  }

  const content = lines.join('\n');
  const filename = `H2-Optimize-Analysis-${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(content, filename);
}

export default exportCSV;
