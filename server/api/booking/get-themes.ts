import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  const themes = await knex("theme").where("status", 1);
  return themes;
});
