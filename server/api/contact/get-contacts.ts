import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get bookings grouped by email with statistics
    const bookingsByEmail = await knex("booking")
      .select([
        "user_email as email",
        "user_fullname as name",
        "user_phoneno as phone",
        knex.raw("COUNT(*) as total_bookings"),
        knex.raw("GROUP_CONCAT(DISTINCT theme) as themes"),
        knex.raw("SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as paid_bookings"),
        knex.raw("SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as pending_bookings"),
        knex.raw("MAX(created_date) as latest_booking"),
        knex.raw("MIN(created_date) as first_booking")
      ])
      .groupBy("user_email", "user_fullname", "user_phoneno")
      .orderBy("latest_booking", "desc");

    return bookingsByEmail;
  } catch (error) {
    console.error("Error fetching bookings by email:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch bookings by email",
    });
  }
});
