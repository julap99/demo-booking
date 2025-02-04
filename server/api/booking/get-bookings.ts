import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const bookings = await db("booking")
      .select("*")
      .orderBy("created_date", "desc");
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch bookings"
    });
  }
});
