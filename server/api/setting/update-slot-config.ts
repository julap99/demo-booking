import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { start_time, end_time, duration, rest, start_break, end_break } = body;

    await db("slot_config")
      .where("title", "Main Slot")
      .update({
        start_time,
        end_time,
        duration,
        rest,
        start_break,
        end_break,
        updated_date: db.fn.now()
      });

    return {
      statusCode: 200,
      status: "success",
      message: "Slot configuration updated successfully"
    };
  } catch (error) {
    console.error("Error updating slot config:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update slot configuration"
    });
  }
});
