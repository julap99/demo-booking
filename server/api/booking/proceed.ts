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
  source: string;
  termsAccepted: boolean;

  // Session Details
  theme: number;
  theme_price: number;
  theme_deposit: number;
  date: string;
  time: string;
  number_of_pax: number;
  add_ons: { id: number; quantity: number }[];

  // Payment Details
  payment_type: number; // 1 = full, 2 = deposit
  payment_method: number; // 1 = fpx, 2 = cc
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
      source,
      theme,
      theme_price,
      theme_deposit,
      date,
      time,
      number_of_pax,
      add_ons,
      payment_type,
      payment_method,
    } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !theme ||
      !date ||
      !time ||
      !number_of_pax
    ) {
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

    // Validate number of pax
    if (number_of_pax < 2 || number_of_pax > 30) {
      throw createError({
        statusCode: 400,
        message: "Number of persons must be between 2 and 30",
      });
    }

    // Validate payment type
    if (![1, 2].includes(payment_type)) {
      throw createError({
        statusCode: 400,
        message: "Invalid payment type",
      });
    }

    // Validate payment method
    if (![1, 2].includes(payment_method)) {
      throw createError({
        statusCode: 400,
        message: "Invalid payment method",
      });
    }

    // Validate terms acceptance
    if (!body.termsAccepted) {
      throw createError({
        statusCode: 400,
        message: "Terms and conditions must be accepted",
      });
    }

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();
    console.log("Receipt Number:", receiptNumber);

    // Check if the theme is valid
    const themeData = await knex("theme").where("id", theme).first();
    if (!themeData) {
      throw createError({
        statusCode: 400,
        message: "Invalid theme",
      });
    }

    // Check if the add-ons are selected and are valid
    let addons = [];

    if (add_ons.length > 0) {
      for (const addon_ of add_ons) {
        const addOn = await knex("addon").where("id", addon_.id).first();
        if (!addOn) {
          throw createError({
            statusCode: 400,
            message: "Invalid add-ons",
          });
        }

        addons.push({
          id: addOn.id,
          qty: addon_.quantity,
          price: addOn.price * addon_.quantity,
        });
      }
    }

    // return {
    //   statusCode: 200,
    //   status: "success",
    //   message: "Booking proceeded successfully",
    // };

    console.log("Theme Data:", themeData);

    // Calculate payment amount
    const paymentAmount =
      payment_type === 2
        ? themeData.deposit
        : themeData.deposit +
          themeData.price +
          addons.reduce((acc, addon) => acc + addon.price * addon.qty, 0);

    console.log("Payment Amount:", paymentAmount);

    // Calculate extra pax
    const chargePerPax = await knex("config")
      .select("value")
      .where("code", "charge_per_pax")
      .first();
    console.log("Charge Per Pax:", chargePerPax);

    const maxFreePax = await knex("config")
      .select("value")
      .where("code", "max_free_pax")
      .first();

    console.log("Max Free Pax:", maxFreePax);

    const maxPax = await knex("config")
      .select("value")
      .where("code", "max_pax")
      .first();

    console.log("Max Pax:", maxPax);

    let paymentExtraPax = 0;
    if (number_of_pax > parseInt(maxFreePax.value)) {
      paymentExtraPax =
        (number_of_pax - parseInt(maxFreePax.value)) *
        parseInt(chargePerPax.value);
    }

    console.log("Payment Extra Pax:", paymentExtraPax);

    // Calculate payment addon
    const paymentAddon = addons.reduce(
      (acc, addon) => acc + addon.price * addon.qty,
      0
    );

    console.log("Payment Addon:", paymentAddon);

    // Calculate payment total
    let paymentTotal = themeData.price + paymentAddon + paymentExtraPax;

    console.log("Payment Total:", paymentTotal);

    // Use transaction to ensure data consistency
    const result = await knex.transaction(async (trx) => {
      // Create the booking
      const [bookingId] = await trx("booking").insert({
        user_fullname: name,
        user_email: email,
        user_phoneno: phone,
        user_source: source,
        session_date: date,
        session_time: time,
        theme: theme,
        number_of_pax: number_of_pax,
        number_of_extra_pax: number_of_pax - parseInt(maxFreePax.value),
        addon: addons.length > 0 ? JSON.stringify(addons) : null,
        payment_ref_number: receiptNumber,
        payment_type: payment_type,
        payment_method: payment_method,
        payment_amount: paymentAmount,
        payment_addon_total: paymentAddon,
        payment_total: paymentTotal,
        payment_extra_pax: paymentExtraPax,
        status: 1, // Pending
        session_status: 1, // Pending
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
      number_of_pax: result.number_of_pax,
      payment_type: result.payment_type,
      payment_method: result.payment_method,
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
      data: result.payment_ref_number,
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
