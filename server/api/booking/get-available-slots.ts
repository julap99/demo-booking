import db from "../../utils/knex";
import dayjs from "../../utils/date";

interface TimeSlot {
  slot: string;
  value: string;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { date } = query;

    if (!date || typeof date !== 'string') {
      throw createError({
        statusCode: 400,
        message: "Date parameter is required"
      });
    }

    const now = dayjs();
    const isToday = now.format('YYYY-MM-DD') === date;

    // Get slot configuration
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .first();

    if (!slotConfig) {
      throw createError({
        statusCode: 404,
        message: "Slot configuration not found"
      });
    }

    // Get existing bookings for the date
    const bookings = await db("booking")
      .where("session_date", date)
      .where("status", "!=", 0)
      .select("session_time");

    const slots: TimeSlot[] = [];
    
    // Convert times to dayjs objects
    const startTime = dayjs(`${date} ${slotConfig.start_time}`);
    const endTime = dayjs(`${date} ${slotConfig.end_time}`);
    const breakStart = dayjs(`${date} ${slotConfig.start_break}`);
    const breakEnd = dayjs(`${date} ${slotConfig.end_break}`);
    
    // Generate slots
    let currentSlot = startTime;
    while (currentSlot.isBefore(endTime)) {
      const slotEnd = currentSlot.add(slotConfig.duration, "minute");

      // Don't add slot if it extends beyond end time
      if (slotEnd.isAfter(endTime)) {
        break;
      }

      // Skip slots that overlap with break time
      const slotWithRest = slotEnd.add(slotConfig.rest, "minute");
      if (
        !(
          (currentSlot.isSameOrAfter(breakStart) && currentSlot.isBefore(breakEnd)) ||
          (slotWithRest.isAfter(breakStart) && slotWithRest.isSameOrBefore(breakEnd)) ||
          (currentSlot.isBefore(breakStart) && slotWithRest.isAfter(breakEnd))
        )
      ) {
        // For current date, only add future slots
        if (!isToday || currentSlot.isAfter(now)) {
          slots.push({
            slot: currentSlot.format("hh:mm A"),
            value: currentSlot.format("HH:mm")
          });
        }
      }

      // Move to next slot start time, including rest period
      currentSlot = slotEnd.add(slotConfig.rest, "minute");
    }

    // Filter out booked slots
    const availableSlots = slots.filter((slotItem) => {
      const slotTime = dayjs(`${date} ${slotItem.value}`);
      const slotEnd = slotTime.add(slotConfig.duration + slotConfig.rest, "minute");

      return !bookings.some((booking) => {
        const bookingStart = dayjs(`${date} ${booking.session_time}`);
        const bookingEnd = bookingStart.add(slotConfig.duration + slotConfig.rest, "minute");

        return (
          (slotTime.isSameOrAfter(bookingStart) && slotTime.isBefore(bookingEnd)) ||
          (slotEnd.isAfter(bookingStart) && slotEnd.isSameOrBefore(bookingEnd)) ||
          (slotTime.isBefore(bookingStart) && slotEnd.isAfter(bookingEnd))
        );
      });
    });

    return {
      statusCode: 200,
      status: "success",
      data: availableSlots,
      interval: slotConfig.duration,
      rest: slotConfig.rest
    };
  } catch (error: any) {
    console.error("Error fetching available slots:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch available slots"
    });
  }
});
