import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get from params
    const { receiptNumber } = getQuery(event);
    console.log("receiptNumber:", receiptNumber);

    // Check if receiptNumber is a valid booking number
    const booking = await knex("booking").where("id", receiptNumber).first();
    if (!booking) {
      throw createError({ statusCode: 404, message: "Booking not found" });
    }

    return {
      statusCode: 200,
      status: "success",
      message: "Booking detail fetched successfully",
      data: booking,
    };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
