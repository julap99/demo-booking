import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  const bookings = await knex("booking")
    .select("*")
    .orderBy("created_date", "desc");
  return bookings;
});
