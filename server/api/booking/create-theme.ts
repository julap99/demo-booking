import db from "../../utils/knex";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate required fields
    if (!body.title || !body.description || typeof body.price !== 'number' || typeof body.deposit !== 'number') {
      throw createError({
        statusCode: 400,
        message: "Missing required fields"
      });
    }

    // Insert new theme
    const [themeId] = await db("theme").insert({
      title: body.title,
      description: body.description,
      price: body.price,
      deposit: body.deposit,
      image: body.image || null,
      status: 1, // Active by default
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Theme created successfully",
    };
  } catch (error) {
    console.error("Error creating theme:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create theme"
    });
  }
}); 