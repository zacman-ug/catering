import { isNonEmptyString, isOptionalEmail, isOptionalString, trimString } from '../utils/guards.js';

export function parseContactInput(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid contact payload' };
  }

  const fullName = trimString(raw.fullName);
  if (!isNonEmptyString(fullName)) {
    return { ok: false, error: 'Full name is required' };
  }

  const message = trimString(raw.message);
  if (!isNonEmptyString(message)) {
    return { ok: false, error: 'Message is required' };
  }

  if (!isOptionalEmail(raw.email)) {
    return { ok: false, error: 'Invalid email address' };
  }

  if (!isOptionalString(raw.phone)) {
    return { ok: false, error: 'Invalid phone number' };
  }

  if (!isOptionalString(raw.subject)) {
    return { ok: false, error: 'Invalid subject' };
  }

  return {
    ok: true,
    value: {
      fullName,
      message,
      email: trimString(raw.email) || null,
      phone: trimString(raw.phone) || null,
      subject: trimString(raw.subject) || null,
    },
  };
}
