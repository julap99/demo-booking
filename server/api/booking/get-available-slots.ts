import db from "../../utils/knex";
import dayjs from "../../utils/date";

interface TimeSlot {
  slot: string;
  value: string;
}

interface BreakTime {
  id: number;
  start_time: string;
  end_time: string;
}

interface CustomError extends Error {
  statusCode?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { date, theme_id } = query;

    if (!date || typeof date !== "string") {
      throw createError({
        statusCode: 400,
        message: "Date parameter is required",
      });
    }

    if (!theme_id) {
      throw createError({
        statusCode: 400,
        message: "Theme ID is required",
      });
    }

    const now = dayjs();
    const isToday = now.format("YYYY-MM-DD") === date;

    // Get slot configuration
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .first();

    if (!slotConfig) {
      throw createError({
        statusCode: 404,
        message: "Slot configuration not found",
      });
    }

    // Get break times
    const breakTimes = await db("break_time").select("*");

    // Get existing bookings for the date and theme
    const bookings = await db("booking")
      .where("session_date", date)
      .whereNot("status", 1)
      .where("theme", theme_id)
      .select("session_time");

    const slots: TimeSlot[] = [];

    // Convert times to dayjs objects
    const startTime = dayjs(`${date} ${slotConfig.start_time}`);
    const endTime = dayjs(`${date} ${slotConfig.end_time}`);

    // Convert break times to dayjs objects
    const breaks = breakTimes.map(breakTime => ({
      start: dayjs(`${date} ${breakTime.start_time}`),
      end: dayjs(`${date} ${breakTime.end_time}`)
    }));

    // Generate slots
    let currentSlot = startTime;
    while (currentSlot.isBefore(endTime)) {
      const slotEnd = currentSlot.add(slotConfig.duration, "minute");

      // Don't add slot if it extends beyond end time
      if (slotEnd.isAfter(endTime)) {
        break;
      }

      // Check if slot overlaps with any break time
      const slotWithRest = slotEnd.add(slotConfig.rest, "minute");
      const overlapsBreak = breaks.some(breakTime => 
        (currentSlot.isSameOrAfter(breakTime.start) && currentSlot.isBefore(breakTime.end)) ||
        (slotWithRest.isAfter(breakTime.start) && slotWithRest.isSameOrBefore(breakTime.end)) ||
        (currentSlot.isBefore(breakTime.start) && slotWithRest.isAfter(breakTime.end))
      );

      if (!overlapsBreak) {
        // For current date, only add future slots
        if (!isToday || currentSlot.isAfter(now)) {
          slots.push({
            slot: currentSlot.format("hh:mm A"),
            value: currentSlot.format("HH:mm"),
          });
        }
      }

      // Move to next slot start time, including rest period
      currentSlot = slotEnd.add(slotConfig.rest, "minute");
    }

    // Filter out booked slots
    const availableSlots = slots.filter((slotItem) => {
      const slotTime = dayjs(`${date} ${slotItem.value}`);
      const slotEnd = slotTime.add(
        slotConfig.duration + slotConfig.rest,
        "minute"
      );

      return !bookings.some((booking) => {
        const bookingStart = dayjs(`${date} ${booking.session_time}`);
        const bookingEnd = bookingStart.add(
          slotConfig.duration + slotConfig.rest,
          "minute"
        );

        return (
          (slotTime.isSameOrAfter(bookingStart) &&
            slotTime.isBefore(bookingEnd)) ||
          (slotEnd.isAfter(bookingStart) &&
            slotEnd.isSameOrBefore(bookingEnd)) ||
          (slotTime.isBefore(bookingStart) && slotEnd.isAfter(bookingEnd))
        );
      });
    });

    return {
      statusCode: 200,
      status: "success",
      data: availableSlots,
      interval: slotConfig.duration,
      rest: slotConfig.rest,
    };
  } catch (error) {
    const customError = error as CustomError;
    console.error("Error fetching available slots:", customError);
    throw createError({
      statusCode: customError.statusCode || 500,
      message: customError.message || "Failed to fetch available slots",
    });
  }
});
