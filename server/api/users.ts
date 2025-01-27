import knex from '../utils/knex'

export default defineEventHandler(async (event) => {
  try {
    const users = await knex('user')
      .select('*')
      .limit(10)
    
    return { users }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error'
    })
  }
})
