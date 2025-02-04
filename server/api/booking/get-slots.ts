import { defineEventHandler, getQuery } from "h3";
import knex from "~/server/utils/knex";
import type { Knex } from "knex";
import db from "~/server/utils/knex";
import { createError } from "h3";

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
    const slots = await db("slot_config").select("*");
    return slots;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch slots"
    });
  }
});
