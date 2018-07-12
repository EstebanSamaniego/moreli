'use strict'

const debug = require('debug')

const config = {
  db: {
    database: process.env.DB_NAME || 'moreli',
    username: process.env.DB_USER || 'dev',
    password: process.env.DB_PASS || 'dev',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }
}

function parsePayload (payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf8')
  }

  try {
    payload = JSON.parse(payload)
  } catch (e) {
    payload = null
  }
  return payload
}

module.exports = {
  config,
  parsePayload
}
