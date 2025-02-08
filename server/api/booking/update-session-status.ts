import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const { bookingId, status } = await readBody(event);

    console.log(bookingId, status);

    await db("booking")
      .where("id", bookingId)
      .update({ session_status: status });

    return {
      statusCode: 200,
      success: true,
      message: "Session status updated successfully",
    };
  } catch (error) {
    console.error("Error updating session status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update session status",
    });
  }
});
