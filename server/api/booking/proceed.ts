import knex from "../../utils/knex";
import { sendWhatsAppNotification } from "../../utils/whatsapp";
import { createCalendarEvent } from "../../utils/calendar";
import { H3Event } from "h3";
import axios from "axios";

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

const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY;
const CHIP_BRAND_ID = process.env.CHIP_BRAND_ID;

interface BookingRequest {
  date: string;
  time: string;
  theme: number;
  number_of_pax: number;
  add_ons: Array<{
    id: number;
    quantity: number;
  }>;
  name: string;
  email: string;
  phone: string;
  source: string;
  payment_type: number; // 1 = full, 2 = deposit
  payment_method: number; // 1 = fpx
  payment_amount: number;
  termsAccepted: boolean;
}

// Add CHIP transaction fee constants
const CHIP_FPX_PERCENTAGE = 0.02; // 2%
const CHIP_FPX_FIXED_FEE = 1.0; // RM1.00
const CHIP_CARD_PERCENTAGE = 0.03; // 3%
const CHIP_CARD_FIXED_FEE = 0.5; // RM0.50

// Calculate CHIP transaction fee
function calculateTransactionFee(
  amount: number,
  paymentMethod: number
): number {
  // paymentMethod: 1 = FPX, 2 = Credit Card
  if (paymentMethod === 1) {
    return amount * CHIP_FPX_PERCENTAGE + CHIP_FPX_FIXED_FEE;
  } else if (paymentMethod === 2) {
    return amount * CHIP_CARD_PERCENTAGE + CHIP_CARD_FIXED_FEE;
  }
  return 0;
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
function generateReceiptNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `RCP${timestamp}${random}`;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<BookingRequest>(event);

    // Validate the request
    if (
      !body.date ||
      !body.time ||
      !body.theme ||
      !body.name ||
      !body.email ||
      !body.phone
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    // Check if the theme is valid
    const themeData = await knex("theme").where("id", body.theme).first();
    if (!themeData) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid theme",
      });
    }

    // Get configuration values
    const [chargePerPax, maxFreePax] = await Promise.all([
      knex("config").select("value").where("code", "charge_per_pax").first(),
      knex("config").select("value").where("code", "max_free_pax").first(),
    ]);

    // Calculate extra pax charges
    let paymentExtraPax = 0;
    if (body.number_of_pax > parseInt(maxFreePax.value)) {
      paymentExtraPax =
        (body.number_of_pax - parseInt(maxFreePax.value)) *
        parseInt(chargePerPax.value);
    }

    // Process add-ons
    let addons = [];
    let paymentAddon = 0;
    if (body.add_ons?.length > 0) {
      for (const addon of body.add_ons) {
        const addonData = await knex("addon").where("id", addon.id).first();
        if (!addonData) {
          throw createError({
            statusCode: 400,
            statusMessage: "Invalid add-on",
          });
        }
        addons.push({
          id: addonData.id,
          qty: addon.quantity,
          price: addonData.price,
        });
        paymentAddon += addonData.price * addon.quantity;
      }
    }

    // Calculate total payment
    const paymentTotal = themeData.price + paymentAddon + paymentExtraPax;

    // Calculate transaction fee
    const transactionFee = calculateTransactionFee(
      body.payment_amount,
      body.payment_method
    );
    const totalWithFee = body.payment_amount + transactionFee;

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();
    console.log("Receipt Number:", receiptNumber);

    // Create the booking with pending status
    const [bookingId] = await knex("booking").insert({
      user_fullname: body.name,
      user_email: body.email,
      user_phoneno: body.phone,
      user_source: body.source,
      session_date: body.date,
      session_time: body.time,
      theme: body.theme,
      number_of_pax: body.number_of_pax,
      number_of_extra_pax:
        body.number_of_pax > parseInt(maxFreePax.value)
          ? body.number_of_pax - parseInt(maxFreePax.value)
          : 0,
      addon: addons.length > 0 ? JSON.stringify(addons) : null,
      frame_status: addons.length > 0 ? 1 : 0,
      payment_ref_number: receiptNumber,
      payment_type: body.payment_type,
      payment_method: body.payment_method,
      payment_amount: totalWithFee, // Include transaction fee
      payment_addon_total: paymentAddon,
      payment_total: paymentTotal + transactionFee,
      payment_extra_pax: paymentExtraPax,
      payment_transaction_fee: transactionFee, // Store transaction fee
      status: 1, // Pending
      session_status: 1, // Pending
      created_date: new Date(),
    });
    console.log("Booking ID:", bookingId);

    console.log("CHIP Secret Key:", CHIP_SECRET_KEY);
    console.log("CHIP Brand ID:", CHIP_BRAND_ID);

    // Initialize CHIP payment
    try {
      console.log("Preparing CHIP API request...");
      const chipRequestBody = {
        brand_id: CHIP_BRAND_ID,
        reference: `BOOKING-${bookingId}`,
        platform: "web",
        purchase: {
          products: [
            {
              name: `Booking Session${
                body.payment_type === 2 ? " (Deposit)" : ""
              }`,
              price: Math.round(body.payment_amount * 100),
            },
          ],
          currency: "MYR",
        },
        client: {
          email: body.email,
        },
        success_callback: `${process.env.PUBLIC_API_URL}/api/booking/payment-callback`,
        success_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking=${receiptNumber}&status=success`,
        failure_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking=${receiptNumber}&status=failed`,
        cancel_redirect: `${process.env.PUBLIC_URL}/book-a-session/receipt?booking=${receiptNumber}&status=cancelled`,
        send_receipt: true,
        // product: {
        //   name: `Booking Session${body.payment_type === 2 ? " (Deposit)" : ""}`,
        //   description: `Transaction fee: RM${transactionFee.toFixed(2)}`,
        // },
        skip_capture: false,
      };

      console.log(
        "CHIP Request Body:",
        JSON.stringify(chipRequestBody, null, 2)
      );

      const chipResponse = await fetch(
        "https://gate.chip-in.asia/api/v1/purchases/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CHIP_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chipRequestBody),
        }
      );

      console.log("CHIP Response:", chipResponse);
      console.log("CHIP Response Status:", chipResponse.status);
      console.log("CHIP Response Status Text:", chipResponse.statusText);

      // const textResponse = await chipResponse.text();
      // console.log("CHIP Response Text:", textResponse);

      const chipData = await chipResponse.json();
      console.log("CHIP Data:", chipData);

      if (chipResponse.status !== 201) {
        // If CHIP payment initialization fails, update booking status to failed
        await knex("booking").where("id", bookingId).update({ status: 4 }); // 4 = Failed

        throw createError({
          statusCode: chipResponse.status,
          statusMessage: chipData.message || "Failed to initialize payment",
        });
      }

      // Update booking with CHIP purchase ID
      // await knex("booking")
      //   .where("id", bookingId)
      //   .update({ chip_purchase_id: chipData.id });

      return {
        status: "success",
        message: "Booking created and payment initialized successfully",
        data: {
          booking_id: bookingId,
          receipt_number: receiptNumber,
          checkout_url: chipData.checkout_url,
          purchase_id: chipData.id,
        },
      };
    } catch (error: any) {
      console.error("CHIP payment error:", error);
      // Update booking status to failed
      await knex("booking").where("id", bookingId).update({ status: 4 });
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: "Failed to process CHIP payment",
      });
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
