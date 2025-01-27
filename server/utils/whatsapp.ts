import { H3Event } from "h3";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

interface BookingData {
  id: number;
  user_fullname: string;
  user_email: string;
  user_phoneno: string;
  theme: string;
  session_date: string;
  session_time: string;
}

export async function sendWhatsAppNotification(
  adminPhoneNumber: string,
  bookingData: BookingData
) {
  try {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.error("WhatsApp credentials not configured");
      return false;
    }

    const message =
      `🎉 New Booking Alert! 📸\n\n` +
      `*Booking Details:*\n` +
      `📝 Booking ID: #${bookingData.id}\n` +
      `👤 Client: ${bookingData.user_fullname}\n` +
      `📧 Email: ${bookingData.user_email}\n` +
      `📱 Phone: ${bookingData.user_phoneno}\n` +
      `🎨 Theme: ${bookingData.theme}\n` +
      `📅 Date: ${bookingData.session_date}\n` +
      `⏰ Time: ${bookingData.session_time}\n\n` +
      `Please review and confirm this booking.`;

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: adminPhoneNumber,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    console.log("Response:", response);
    console.log("Sent to:", adminPhoneNumber);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API Error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}
