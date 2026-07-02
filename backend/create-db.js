require('dotenv').config()
const { Client } = require('pg')

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:080605@localhost:5432/2403040052_db'
const url = new URL(connectionString)
const dbName = url.pathname.replace(/^\//, '') || '2403040052_db'
const adminUrl = new URL(connectionString)
adminUrl.pathname = '/postgres'

const client = new Client({ connectionString: adminUrl.toString() })

async function createDatabase() {
  try {
    await client.connect()
    const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])

    if (exists.rowCount > 0) {
      console.log(`Database '${dbName}' already exists.`)
    } else {
      await client.query(`CREATE DATABASE "${dbName}"`)
      console.log(`Database '${dbName}' created successfully.`)
    }
  } catch (error) {
    console.error('Failed to create database:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

createDatabase()