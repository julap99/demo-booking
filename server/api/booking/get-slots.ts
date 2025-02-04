import { defineEventHandler, getQuery } from "h3";
import knex from "~/server/utils/knex";
import type { Knex } from "knex";

interface SlotsResponse {
  [key: string]: number;
}

// Helper function to normalize date to YYYY-MM-DD format
function normalizeDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Helper function to create date
function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day);
}

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event);
    const { month, year } = query as { month?: string; year?: string };

    if (!month || !year) {
      throw new Error("Month and year are required parameters");
    }

    // Calculate start and end dates for the query
    const startDate = createDate(Number(year), Number(month), 1);
    const endDate = createDate(Number(year), Number(month) + 1, 0); // Last day of month

    // Initialize response object
    let response: SlotsResponse = {};

    // Initialize slots for each day in the month
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = normalizeDate(currentDate);
      const dayOfWeek = currentDate.getDay();

      // Only weekdays (Monday-Friday) have slots
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Get bookings for this specific date
        const bookings = await knex("booking")
          .count("* as count")
          .where("session_date", dateStr)
          .where("session_status", 1)
          .where("status", 3)
          .first();

        const bookingCount = Number(bookings?.count || 0);
        response[dateStr] = bookingCount;
      } else {
        response[dateStr] = 0; // No slots on weekends
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      status: "success",
      data: response,
    };
  } catch (error) {
    const err = error as Error;
    return {
      status: "error",
      message: err.message,
    };
  }
});
