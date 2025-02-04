import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  const addons = await knex("addon").where("status", 1);
  return addons;
});
