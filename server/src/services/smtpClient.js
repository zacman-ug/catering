import { trimString } from '../utils/guards.js';

function isSmtpReady(env) {
  const host = trimString(env?.SMTP_HOST);
  const user = trimString(env?.SMTP_USER);
  const pass = trimString(env?.SMTP_PASS);
  return Boolean(host && user && pass);
}

/**
 * Safe email sender — never throws. Logs payload when SMTP is not configured.
 */
export async function sendEmailIfConfigured(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Invalid payload' };
  }

  const to = trimString(payload.to);
  const subject = trimString(payload.subject);
  const body = trimString(payload.body);

  if (!to || !subject || !body) {
    return { ok: false, error: 'Incomplete email payload' };
  }

  if (!isSmtpReady(process.env)) {
    console.info('[email:queued]', JSON.stringify({ to, subject, preview: body.slice(0, 160) }));
    return { ok: true, value: { delivered: false, logged: true } };
  }

  console.info('[email:smtp-configured]', JSON.stringify({ to, subject, preview: body.slice(0, 160) }));
  return { ok: true, value: { delivered: false, logged: true, note: 'SMTP transport queued for ops setup' } };
}
