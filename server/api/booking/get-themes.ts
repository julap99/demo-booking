import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const themes = await db("theme").where("status", 1);
    return themes;
  } catch (error) {
    console.error("Error fetching themes:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch themes"
    });
  }
});
