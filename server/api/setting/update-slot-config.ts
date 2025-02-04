import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const { start_time, end_time, start_break, end_break, duration, rest } =
      await readBody(event);

    await knex("slot_config").where("title", "Main Slot").update({
      start_time,
      end_time,
      start_break,
      end_break,
      duration,
      rest,
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Slot config updated successfully",
    };
  } catch (error) {
    console.error(error);

    throw createError({
      statusCode: 500,
      message: "Failed to update slot config",
    });
  }
});
