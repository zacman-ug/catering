function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function bookingsToCsv(rows) {
  if (!Array.isArray(rows)) {
    return { ok: false, error: 'Rows must be an array' };
  }

  const headers = [
    'id', 'full_name', 'phone', 'email', 'event_type', 'event_date', 'guest_count',
    'venue', 'service_style', 'budget_range', 'status', 'invoice_status', 'deposit_status',
    'quoted_amount_ugx', 'deposit_amount_ugx', 'staff_count', 'created_at',
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((key) => escapeCsv(row[key])).join(','));
  }

  return { ok: true, value: lines.join('\n') };
}
