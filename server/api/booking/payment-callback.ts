import { H3Event } from "h3";
import crypto from "crypto";
import knex from "../../utils/knex";
import { sendWhatsAppNotification } from "../../utils/whatsapp";
import { createCalendarEvent } from "../../utils/calendar";

const CHIP_WEBHOOK_SECRET = process.env.CHIP_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", CHIP_WEBHOOK_SECRET!);
  const calculatedSignature = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const signature = event.headers.get("X-Signature");
    if (!signature) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing signature",
      });
    }

    const body = await readBody(event);
    const rawBody = JSON.stringify(body);

    // Verify webhook signature
    if (!verifySignature(rawBody, signature)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid signature",
      });
    }

    // Extract payment details
    const { id: chipPaymentId, reference, status } = body;
    const bookingId = reference.replace("BOOKING-", "");

    // Get the booking
    const booking = await knex("booking").where("id", bookingId).first();

    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: "Booking not found",
      });
    }

    // Map CHIP status to booking status
    let bookingStatus;
    switch (status) {
      case "paid":
        bookingStatus = booking.payment_type === 1 ? 3 : 2; // 3 = Paid, 2 = Deposit Paid
        break;
      case "failed":
        bookingStatus = 4; // Failed
        break;
      case "cancelled":
        bookingStatus = 5; // Cancelled
        break;
      default:
        bookingStatus = 1; // Pending
    }

    // Update booking status
    await knex("booking").where("id", bookingId).update({
      status: bookingStatus,
      chip_purchase_id: chipPaymentId,
    });

    // If payment is successful, send notifications
    if (status === "paid") {
      // Send WhatsApp notification
      const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
      if (adminPhoneNumber) {
        await sendWhatsAppNotification(adminPhoneNumber, booking);
      }

      // Create calendar event
      const calendarResult = await createCalendarEvent(booking);
      if (!calendarResult.success) {
        console.error("Failed to create calendar event:", calendarResult.error);
      }
    }

    return {
      status: "success",
      message: `Payment ${status}, booking updated successfully`,
      data: {
        booking_id: bookingId,
        payment_status: status,
        booking_status: bookingStatus,
      },
    };
  } catch (error: any) {
    console.error("Payment callback error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
