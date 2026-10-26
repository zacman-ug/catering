import { buildBookingNotification } from '../domain/emailNotification.js';
import { buildClientConfirmationEmail } from '../domain/clientConfirmation.js';
import { buildBookingWhatsAppMessage, buildWhatsAppUrl } from '../domain/whatsapp.js';
import { config } from '../config/index.js';
import { sendEmailIfConfigured } from './smtpClient.js';

export async function notifyBookingCreated({ booking, businessName, chefWhatsApp }) {
  if (!booking || typeof booking !== 'object') {
    return { ok: false, error: 'Booking is required' };
  }

  const adminBuilt = buildBookingNotification({
    booking,
    notifyEmail: config.bookingNotifyEmail,
    businessName,
  });

  if (adminBuilt.ok) {
    await sendEmailIfConfigured(adminBuilt.value);
  }

  const clientBuilt = buildClientConfirmationEmail({ booking, businessName });
  if (clientBuilt.ok) {
    await sendEmailIfConfigured(clientBuilt.value);
  }

  const waMessage = buildBookingWhatsAppMessage(booking);
  if (waMessage.ok && chefWhatsApp) {
    const waUrl = buildWhatsAppUrl({ phone: chefWhatsApp, message: waMessage.value });
    if (waUrl.ok) {
      console.info('[notify:chef-whatsapp]', waUrl.value);
    }
  }

  return {
    ok: true,
    value: {
      adminNotified: adminBuilt.ok,
      clientConfirmationAttempted: clientBuilt.ok,
    },
  };
}
