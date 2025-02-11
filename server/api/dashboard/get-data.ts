import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const data = await knex("booking")
      .select("booking.*", "theme.title as theme")
      .leftJoin("theme", "booking.theme", "theme.id");

    console.log(data);

    let stats = {};

    // Get Total Bookings
    const totalBookings = data.length;

    // Get top addons
    let addonQuantities: { [key: number]: number } = {};
    for (const booking of data) {
      if (booking.addon) {
        const addons = booking.addon;
        if (Array.isArray(addons)) {
          addons.forEach((addon) => {
            if (addon.id && addon.qty) {
              addonQuantities[addon.id] =
                (addonQuantities[addon.id] || 0) + addon.qty;
            }
          });
        }
      }
    }

    // Find the addon with the highest quantity
    type TopAddon = { id: number; qty: number; title?: string };
    let topAddon = Object.entries(addonQuantities).reduce((max, [id, qty]) => {
      return !max || qty > max.qty ? { id: parseInt(id), qty } : max;
    }, null as TopAddon | null);

    // Get addon details from database
    if (topAddon) {
      const addonDetails = await knex("addon").where("id", topAddon.id).first() as { id: number; title: string };
      topAddon = addonDetails ? { ...topAddon, title: addonDetails.title } : null;
    }

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

    // Get revenue (Full payment vs Deposit)
    let fullPayment = 0;
    let deposit = 0;

    for (const booking of data) {
      if (booking.status === 2) {
        // Deposit
        deposit += booking.payment_amount;
      }

      if (booking.status === 3) {
        // Full Payment
        fullPayment += booking.payment_amount;
      }
    }

    const revenue = {
      fullPayment,
      deposit,
    };

    // Calculate chart data
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date(currentDate);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const yearAgo = new Date(currentDate);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    // Helper function to group bookings by date
    const groupBookingsByDate = (
      startDate: Date,
      interval: "day" | "month"
    ) => {
      const filteredData = data.filter(
        (booking) => new Date(booking.created_date) >= startDate
      );

      const groupedData = filteredData.reduce((acc, booking) => {
        const date = new Date(booking.created_date);
        const key =
          interval === "day"
            ? date.toISOString().split("T")[0]
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}`;

        if (!acc[key]) {
          acc[key] = {
            bookings: 0,
            unique_customers: new Set(),
          };
        }

        acc[key].bookings++;
        acc[key].unique_customers.add(booking.user_email);

        return acc;
      }, {} as Record<string, { bookings: number; unique_customers: Set<string> }>);

      return groupedData;
    };

    // Generate date ranges
    const generateDateRange = (startDate: Date, days: number) => {
      const dates = [];
      const start = new Date(startDate);
      for (let i = 0; i < days; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    };

    // Generate month range
    const generateMonthRange = () => {
      const months = [];
      const start = new Date(yearAgo);
      for (let i = 0; i < 12; i++) {
        const date = new Date(start);
        date.setMonth(date.getMonth() + i);
        months.push(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`
        );
      }
      return months;
    };

    // Calculate 30 days data
    const thirtyDaysData = groupBookingsByDate(thirtyDaysAgo, "day");
    const thirtyDaysDates = generateDateRange(thirtyDaysAgo, 30);
    const thirtyDays = thirtyDaysDates.map((date) => ({
      date,
      bookings: thirtyDaysData[date]?.bookings || 0,
      unique_customers: thirtyDaysData[date]?.unique_customers.size || 0,
    }));

    // Calculate 90 days data
    const ninetyDaysData = groupBookingsByDate(ninetyDaysAgo, "day");
    const ninetyDaysDates = generateDateRange(ninetyDaysAgo, 90);
    const ninetyDays = ninetyDaysDates.map((date) => ({
      date,
      bookings: ninetyDaysData[date]?.bookings || 0,
      unique_customers: ninetyDaysData[date]?.unique_customers.size || 0,
    }));

    // Calculate yearly data
    const yearlyData = groupBookingsByDate(yearAgo, "month");
    const monthRange = generateMonthRange();
    const yearly = monthRange.map((month) => ({
      month: new Date(month + "-01").toLocaleString("default", {
        month: "long",
      }),
      bookings: yearlyData[month]?.bookings || 0,
      unique_customers: yearlyData[month]?.unique_customers.size || 0,
    }));

    return {
      statusCode: 200,
      status: "success",
      message: "Dashboard data fetched successfully",
      data: {
        stats: {
          totalBookings,
          topAddon: topAddon?.title || "No Addon",
          totalPending,
          revenue,
        },
        chartData: {
          thirtyDays,
          ninetyDays,
          yearly,
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
