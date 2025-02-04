import knex from "../../utils/knex";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default defineEventHandler(async (event) => {
  const { date } = await getQuery(event);

  console.log("Date", date);

  // Set up slot config
  const config = await knex("slot_config").where("title", "Main Slot").first();
  console.log("Config", config);

  if (!config) {
    throw createError({
      statusCode: 404,
      message: "Slot configuration not found",
    });
  }

  const slots: Array<{ slot: string; value: string }> = [];

  // Convert start and end times to dayjs objects
  const startTime = dayjs(`${date} ${config.start_time}`);
  const endTime = dayjs(`${date} ${config.end_time}`);
  const breakStart = dayjs(`${date} ${config.start_break}`);
  const breakEnd = dayjs(`${date} ${config.end_break}`);
  const duration = config.duration; // Duration in minutes
  const rest = config.rest; // Rest time in minutes

  // Generate slots
  let currentSlot = startTime;
  while (currentSlot.isBefore(endTime)) {
    const slotEnd = currentSlot.add(duration, "minute");

    // Don't add slot if it extends beyond end time
    if (slotEnd.isAfter(endTime)) {
      break;
    }

    // Skip slots that overlap with break time
    const slotWithRest = slotEnd.add(rest, "minute");
    if (
      !(
        (currentSlot.isSameOrAfter(breakStart) && currentSlot.isBefore(breakEnd)) ||
        (slotWithRest.isAfter(breakStart) && slotWithRest.isSameOrBefore(breakEnd)) ||
        (currentSlot.isBefore(breakStart) && slotWithRest.isAfter(breakEnd))
      )
    ) {
      slots.push({
        slot: currentSlot.format("hh:mm A"),
        value: currentSlot.format("HH:mm")
      });
    }

    // Move to the next slot start time, including rest period
    currentSlot = slotEnd.add(rest, "minute");
  }

  // Get existing bookings for the date
  const bookings = await knex("booking")
    .where("session_date", date)
    .whereNot("status", 1)
    .select("session_time");

  console.log("Bookings:", bookings);

  // Filter out booked slots
  const availableSlots = slots.filter((slotItem) => {
    const slotTime = dayjs(`${date} ${slotItem.value}`);
    const slotEnd = slotTime.add(duration + rest, "minute"); // Include rest time in the slot end

    return !bookings.some((booking) => {
      const bookingStart = dayjs(`${date} ${booking.session_time}`);
      const bookingEnd = bookingStart.add(duration + rest, "minute"); // Include rest time in the booking end

      return (
        (slotTime.isSameOrAfter(bookingStart) &&
          slotTime.isBefore(bookingEnd)) ||
        (slotEnd.isAfter(bookingStart) && slotEnd.isSameOrBefore(bookingEnd)) ||
        (slotTime.isBefore(bookingStart) && slotEnd.isAfter(bookingEnd))
      );
    });
  });

  return {
    statusCode: 200,
    status: "success",
    message: "Slots fetched successfully",
    data: availableSlots,
    interval: duration,
    rest: rest,
  };
});
