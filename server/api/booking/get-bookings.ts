import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const bookings = await db("booking")
      .select("booking.*", "theme.title as theme_title")
      .leftJoin("theme", "theme.id", "booking.theme")
      .orderBy("booking.created_date", "desc");
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch bookings",
    });
  }
});
