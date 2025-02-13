import db from "../../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title || !body.description || typeof body.price !== 'number' || typeof body.deposit !== 'number') {
      throw createError({
        statusCode: 400,
        message: "Missing required fields"
      });
    }

    // Update theme
    await db("theme")
      .where({ id })
      .update({
        title: body.title,
        description: body.description,
        price: body.price,
        deposit: body.deposit,
        image: body.image || null,
      });

    return {
      statusCode: 200,
      status: "success",
      message: "Theme updated successfully"
    };
  } catch (error) {
    console.error("Error updating theme:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update theme"
    });
  }
}); 