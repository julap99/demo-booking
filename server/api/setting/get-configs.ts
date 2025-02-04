import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get slot config
    const slotConfig = await db("slot_config")
      .where("title", "Main Slot")
      .select(
        "start_time",
        "end_time",
        "duration",
        "rest",
        "start_break",
        "end_break"
      )
      .first();

    return {
      statusCode: 200,
      status: "success",
      data: {
        slotConfig,
      },
    };
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch configurations"
    });
  }
});
