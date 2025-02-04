import knex from 'knex'
import { dbConfig } from './db.config'

// Optimize connection settings for serverless environment
const knexConfig = {
  client: 'mysql2',
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectTimeout: 10000, // Reduced to 10 seconds for faster failure
    ssl: {
      rejectUnauthorized: false // Add this if your DB uses SSL
    }
  },
  pool: {
    min: 0, // Important for serverless: start with 0 connections
    max: 7, // Reduced pool size for serverless
    acquireTimeoutMillis: 15000, // Reduced timeout
    createTimeoutMillis: 15000,
    idleTimeoutMillis: 15000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 2000
  },
  acquireConnectionTimeout: 15000
}

// Create knex instance with connection handling
let knexInstance: any = null

function getKnex() {
  if (!knexInstance) {
    knexInstance = knex(knexConfig)
    
    // Add error handling
    knexInstance.on('error', (err: any) => {
      console.error('Database connection error:', {
        message: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user
      })
      
      // Destroy the instance on fatal errors
      if (err.fatal) {
        knexInstance.destroy(() => {
          knexInstance = null
        })
      }
    })
  }
  return knexInstance
}

// Export a function that ensures connection
export default function getConnection() {
  const instance = getKnex()
  
  // Test the connection
  return instance.raw('SELECT 1')
    .then(() => {
      console.log('Database connection established successfully')
      return instance
    })
    .catch((err: any) => {
      console.error('Failed to establish database connection:', {
        message: err.message,
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user
      })
      
      // Reset the instance if connection fails
      knexInstance = null
      throw err
    })
} 