import knex from 'knex'
import { dbConfig } from './db.config'

// Create knex instance
const knexInstance = knex({
  client: 'mysql2',
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  },
  pool: {
    min: 2,
    max: 10
  }
})

export default knexInstance 