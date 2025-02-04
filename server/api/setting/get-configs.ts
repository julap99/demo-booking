import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  // Get slot config
  const slotConfig = await knex("slot_config")
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
});
