import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get bookings with statistics
    const bookingsData = await knex("booking")
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

    // Get chart data for different time ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    const yearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

    // Get daily bookings for last 30 days
    const thirtyDaysData = await knex("booking")
      .select([
        knex.raw("DATE(created_date) as date"),
        knex.raw("COUNT(*) as bookings"),
        knex.raw("COUNT(DISTINCT user_email) as unique_customers")
      ])
      .where("created_date", ">=", thirtyDaysAgo)
      .groupBy(knex.raw("DATE(created_date)"))
      .orderBy("date");

    // Get monthly bookings for last 90 days
    const ninetyDaysData = await knex("booking")
      .select([
        knex.raw("DATE_FORMAT(created_date, '%Y-%m') as month"),
        knex.raw("COUNT(*) as bookings"),
        knex.raw("COUNT(DISTINCT user_email) as unique_customers")
      ])
      .where("created_date", ">=", ninetyDaysAgo)
      .groupBy(knex.raw("DATE_FORMAT(created_date, '%Y-%m')"))
      .orderBy("month");

    // Get monthly bookings for last year
    const yearlyData = await knex("booking")
      .select([
        knex.raw("DATE_FORMAT(created_date, '%Y-%m') as month"),
        knex.raw("COUNT(*) as bookings"),
        knex.raw("COUNT(DISTINCT user_email) as unique_customers")
      ])
      .where("created_date", ">=", yearAgo)
      .groupBy(knex.raw("DATE_FORMAT(created_date, '%Y-%m')"))
      .orderBy("month");

    // Calculate overall statistics
    const totalBookings = bookingsData.reduce((sum, contact) => sum + parseInt(contact.total_bookings), 0);
    const totalPending = bookingsData.reduce((sum, contact) => sum + parseInt(contact.pending_bookings), 0);
    const uniqueCustomers = bookingsData.length;

    // Calculate theme distribution
    const themeDistribution = bookingsData.reduce((acc, contact) => {
      const themes = contact.themes?.split(',') || [];
      themes.forEach((theme: string) => {
        acc[theme.trim()] = (acc[theme.trim()] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      stats: {
        totalBookings,
        uniqueCustomers,
        totalPending,
        themeDistribution
      },
      recentBookings: bookingsData.slice(0, 5),
      topCustomers: bookingsData
        .sort((a, b) => b.total_bookings - a.total_bookings)
        .slice(0, 5),
      chartData: {
        thirtyDays: thirtyDaysData,
        ninetyDays: ninetyDaysData,
        yearly: yearlyData
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch dashboard data",
    });
  }
}); 