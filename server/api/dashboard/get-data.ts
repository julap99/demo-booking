import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const data = await knex("booking")
      .select("booking.*", "theme.title as theme")
      .leftJoin("theme", "booking.theme", "theme.id");

    let stats = {};

    // Get Total Bookings
    const totalBookings = data.length;

    // Get unique customers
    const uniqueCustomers = data
      .map((booking) => booking.user_email)
      .filter((email, index, self) => self.indexOf(email) === index).length;

    // Get total pending sessions
    const totalPending = data.filter(
      (booking) => booking.session_status === 1
    ).length;

    // Get recent bookings (sorted by latest created_date)
    const recentBookings = [...data]
      .sort(
        (a, b) =>
          new Date(b.created_date).getTime() -
          new Date(a.created_date).getTime()
      )
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,
        name: booking.user_name || booking.user_email,
        theme: booking.theme,
        latest_booking: booking.created_date,
        payment_status: booking.status,
      }));

    // Get upcoming sessions (sorted by nearest session_date)
    const currentDate = new Date();
    const upcomingSessions = [...data]
      .filter((booking) => new Date(booking.session_date) >= currentDate)
      .sort(
        (a, b) =>
          new Date(a.session_date).getTime() -
          new Date(b.session_date).getTime()
      )
      .slice(0, 5)
      .map((session) => ({
        id: session.id,
        name: session.user_name || session.user_email,
        theme: session.theme,
        booking_date: session.session_date,
        number_of_pax: session.number_of_pax,
        status: session.session_status,
      }));

    // Get theme distribution
    const themeDistribution = data.reduce((acc, booking) => {
      acc[booking.theme] = (acc[booking.theme] || 0) + 1;
      return acc;
    }, {});

    return {
      statusCode: 200,
      status: "success",
      message: "Dashboard data fetched successfully",
      data: {
        stats: {
          totalBookings,
          uniqueCustomers,
          totalPending,
          themeDistribution,
        },
        recentBookings,
        upcomingSessions,
      },
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
