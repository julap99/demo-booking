import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get total bookings
    const totalBookings = await db("booking")
      .count("* as count")
      .first();

    // Get total revenue
    const totalRevenue = await db("booking")
      .sum("total_price as total")
      .where("status", 1)
      .first();

    // Get recent bookings
    const recentBookings = await db("booking")
      .select("*")
      .orderBy("created_date", "desc")
      .limit(5);

    return {
      statusCode: 200,
      status: "success",
      data: {
        totalBookings: totalBookings?.count || 0,
        totalRevenue: totalRevenue?.total || 0,
        recentBookings
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch dashboard data"
    });
  }
}); 