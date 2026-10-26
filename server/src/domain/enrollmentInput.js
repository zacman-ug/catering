import { isNonEmptyString, isOptionalEmail, isOptionalString, isOptionalUuid, trimString } from '../utils/guards.js';

export function parseEnrollmentInput(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid enrollment payload' };
  }

  const fullName = trimString(raw.fullName);
  if (!isNonEmptyString(fullName)) {
    return { ok: false, error: 'Full name is required' };
  }

  const phone = trimString(raw.phone);
  if (!isNonEmptyString(phone)) {
    return { ok: false, error: 'Phone number is required' };
  }

  if (!isOptionalEmail(raw.email)) {
    return { ok: false, error: 'Invalid email address' };
  }

  if (!isOptionalUuid(raw.courseId)) {
    return { ok: false, error: 'Invalid course ID' };
  }

  if (!isOptionalString(raw.message)) {
    return { ok: false, error: 'Invalid message' };
  }

  const courseId = trimString(raw.courseId);

  return {
    ok: true,
    value: {
      fullName,
      phone,
      email: trimString(raw.email) || null,
      courseId: courseId || null,
      message: trimString(raw.message) || null,
    },
  };
}
