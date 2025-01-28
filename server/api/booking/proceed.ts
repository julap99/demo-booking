import knex from "../../utils/knex";
import { sendWhatsAppNotification } from "../../utils/whatsapp";
import { createCalendarEvent } from "../../utils/calendar";

interface CustomError extends Error {
  statusCode?: number;
}

interface BookingFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  address: string;
  termsAccepted: boolean;
  // Session Details
  theme: string;
  theme_price: number;
  theme_deposit: number;
  date: string;
  time: string;
}

// Validate date format (YYYY-MM-DD)
function isValidDate(dateStr: string): boolean {
  console.log("Validating date:", dateStr);

  // Check if date string exists
  if (!dateStr) {
    console.log("Date string is empty");
    return false;
  }

  // First, try to format the date if it's in a different format
  let formattedDate = dateStr;
  if (dateStr.includes("T")) {
    formattedDate = dateStr.split("T")[0];
    console.log("Formatted date from ISO:", formattedDate);
  }

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(formattedDate)) {
    console.log("Date doesn't match YYYY-MM-DD format");
    return false;
  }

  const date = new Date(formattedDate);
  if (isNaN(date.getTime())) {
    console.log("Invalid date object");
    return false;
  }

  // Check if date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log("Date to validate:", date.toISOString());
  console.log("Today's date:", today.toISOString());

  return date >= today;
}

// Validate time format (HH:mm)
function isValidTime(timeStr: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
}

// Generate receipt number
function generateReceiptNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `R${timestamp}${random}`;
}

export default defineEventHandler(async (event) => {
  try {
    // Get body from request
    const body: BookingFormData = await readBody(event);
    console.log("Body:", body);
    const {
      name,
      email,
      phone,
      address,
      theme,
      theme_price,
      theme_deposit,
      date,
      time,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !theme || !date || !time) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        message: "Invalid email format",
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\d{10,12}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
      throw createError({
        statusCode: 400,
        message: "Invalid phone number format",
      });
    }

    // Validate date format and future date
    if (!isValidDate(date)) {
      throw createError({
        statusCode: 400,
        message: "Invalid date format or date must be in the future",
      });
    }

    // Validate time format
    if (!isValidTime(time)) {
      throw createError({
        statusCode: 400,
        message: "Invalid time format (use HH:mm)",
      });
    }

    // Validate terms acceptance
    if (!body.termsAccepted) {
      throw createError({
        statusCode: 400,
        message: "Terms and conditions must be accepted",
      });
    }

    // Renerate ref number
    const receiptNumber = generateReceiptNumber();

    // Use transaction to ensure data consistency
    const result = await knex.transaction(async (trx) => {
      // Create the booking
      const [bookingId] = await trx("booking").insert({
        user_fullname: name,
        user_email: email,
        user_phoneno: phone,
        user_address: address,
        theme: theme,
        theme_price: theme_price,
        theme_deposit: theme_deposit,
        session_date: date,
        session_time: time,
        payment_ref_number: receiptNumber,
        status: 2,
        session_status: 1,
        created_date: new Date(),
      });

      // Get the created booking with related data
      const booking = await trx("booking")
        .select("*")
        .where("booking.id", bookingId)
        .first();

      return booking;
    });

    // Send WhatsApp notification to admin
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
    if (adminPhoneNumber) {
      await sendWhatsAppNotification(adminPhoneNumber, result);
    }

    // Debug booking data
    console.log("Booking data for calendar:", {
      id: result.id,
      user_fullname: result.user_fullname,
      user_email: result.user_email,
      user_phoneno: result.user_phoneno,
      theme: result.theme,
      session_date: result.session_date,
      session_time: result.session_time,
      user_address: result.user_address,
    });

    // Create Google Calendar event
    const calendarResult = await createCalendarEvent(result);
    if (!calendarResult.success) {
      console.error("Failed to create calendar event:", calendarResult.error);
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Booking proceeded successfully",
      data: {
        ...result,
        calendarEvent: calendarResult.success
          ? {
              eventId: calendarResult.eventId,
              eventUrl: calendarResult.htmlLink,
            }
          : null,
      },
    };
  } catch (error: unknown) {
    console.error("Error proceeding booking:", error);

    // Handle specific errors
    const customError = error as CustomError;
    if (customError.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});
