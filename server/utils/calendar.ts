import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import fs from 'fs'
import path from 'path'

interface BookingData {
  id: number
  user_fullname: string
  user_email: string
  user_phoneno: string
  theme: string
  session_date: string | Date
  session_time: string
  user_address: string
}

const SCOPES = ['https://www.googleapis.com/auth/calendar']
const CREDENTIALS = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI
}

// Path to store tokens
const TOKEN_PATH = path.join(process.cwd(), 'server/tokens.json')

let oauth2Client: OAuth2Client | null = null

async function saveTokens(tokens: any) {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
    console.log('Tokens stored to', TOKEN_PATH)
  } catch (err) {
    console.error('Error saving tokens:', err)
  }
}

async function loadTokens() {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'))
      return tokens
    }
  } catch (err) {
    console.error('Error loading tokens:', err)
  }
  return null
}

async function getAuthClient() {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(
      CREDENTIALS.client_id,
      CREDENTIALS.client_secret,
      CREDENTIALS.redirect_uri
    )

    // Load saved tokens
    const savedTokens = await loadTokens()
    if (savedTokens) {
      oauth2Client.setCredentials(savedTokens)
    } else {
      // Fall back to refresh token from env if no saved tokens
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      })
    }

    // Set up token refresh handler
    oauth2Client.on('tokens', (tokens) => {
      const newTokens = { ...savedTokens, ...tokens }
      saveTokens(newTokens)
      oauth2Client?.setCredentials(newTokens)
    })
  }
  return oauth2Client
}

function parseDate(date: string | Date): { year: number; month: number; day: number } {
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else {
    // Handle ISO string or other string formats
    if (date.includes('T')) {
      // Handle ISO string
      dateObj = new Date(date);
    } else if (date.includes('-')) {
      // Handle YYYY-MM-DD format
      const [year, month, day] = date.split('-').map(Number);
      dateObj = new Date(year, month - 1, day);
    } else {
      // Try to parse as is
      dateObj = new Date(date);
    }
  }

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate()
  };
}

export async function createCalendarEvent(bookingData: BookingData) {
  try {
    const auth = await getAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    console.log('Processing date:', bookingData.session_date);
    
    // Parse date
    const { year, month, day } = parseDate(bookingData.session_date);
    console.log('Parsed date:', { year, month, day });
    
    // Parse time
    const [hours, minutes] = bookingData.session_time.split(':').map(Number)
    
    // Create start and end times (assuming 2-hour sessions)
    const startDateTime = new Date(year, month - 1, day, hours, minutes)
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours

    console.log('Event times:', {
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    });

    const event = {
      summary: `Photography Session - ${bookingData.theme}`,
      description: `Client: ${bookingData.user_fullname}\n` +
        `Email: ${bookingData.user_email}\n` +
        `Phone: ${bookingData.user_phoneno}\n` +
        `Address: ${bookingData.user_address}\n` +
        `Theme: ${bookingData.theme}\n` +
        `Booking ID: ${bookingData.id}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kuala_Lumpur',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kuala_Lumpur',
      },
      attendees: [
        { email: bookingData.user_email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 60 } // 1 hour before
        ]
      }
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all' // Send emails to attendees
    })

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink
    }
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return {
      success: false,
      error: 'Failed to create calendar event'
    }
  }
} 