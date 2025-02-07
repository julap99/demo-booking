import knex from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    // Get from params
    const { receiptNumber } = getQuery(event);
    console.log("receiptNumber:", receiptNumber);

    // Check if receiptNumber is a valid booking number
    const booking = await knex("booking")
      .leftJoin("theme", "booking.theme", "theme.id")
      .where("payment_ref_number", receiptNumber)
      .first();
    if (!booking) {
      throw createError({ statusCode: 404, message: "Booking not found" });
    }

    console.log("Booking:", booking);

    let result = null;
    let addons = [];

    // Get addon detail
    for (const addon of booking.addon) {
      const addonDetail = await knex("addon").where("id", addon.id).first();
      addons.push({
        name: addonDetail.title,
        desc: addonDetail.description,
        quantity: addon.quantity,
        price: addonDetail.price,
      });
    }

    console.log("Addons:", addons);

    result = {
      ...booking,
      addons: addons,
    };

    return {
      statusCode: 200,
      status: "success",
      message: "Booking detail fetched successfully",
      data: result,
    };
  } catch (error) {
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});
