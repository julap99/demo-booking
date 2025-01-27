import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is missing'
    })
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    return {
      message: 'Authorization successful! Copy this refresh token to your .env file:',
      refresh_token: tokens.refresh_token
    }
  } catch (error) {
    console.error('Error getting tokens:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get tokens'
    })
  }
}) 