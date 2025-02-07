import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const charge_per_pax = await db("config")
      .select("value")
      .where("code", "charge_per_pax")
      .first();

    const max_free_pax = await db("config")
      .select("value")
      .where("code", "max_free_pax")
      .first();

    const max_pax = await db("config")
      .select("value")
      .where("code", "max_pax")
      .first();

    return {
      charge_per_pax: charge_per_pax.value,
      max_free_pax: max_free_pax.value,
      max_pax: max_pax.value,
    };
  } catch (error) {
    console.error("Error fetching config:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch config",
    });
  }
});
