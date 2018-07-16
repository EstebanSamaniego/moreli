'use strict'

const debug = require('debug')('moreli:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('module-db')
const utils = require('module-utils')
const five = require('johnny-five')

const board = new five.Board()

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const config = Object.assign(utils.config.db, {setup: false})

let Agent, Metric
const server = new mosca.Server(settings)
const clients = new Map()

board.on('ready', () => {
  let relay = new five.Relay({
    pin: 10, 
    type: "NC"
  })
  let led = new five.Led(13)

  server.on('published', async (packet, client) => {
    debug(`Received: ${packet.topic}`)

    switch (packet.topic) {
      case 'agent/connected':
      case 'agent/disconnected':
        debug(`Payload: ${packet.payload}`)
        break
      case 'agent/message':
        debug(`Payload: ${packet.payload}`)
        const payload = utils.parsePayload(packet.payload)

        if (payload) {
          payload.agent.connected = true
          let agent
          try {
            agent = await Agent.createOrUpdate(payload.agent)
          } catch (e) {
            return handleError(e)
          }

          debug(`Agent ${agent.uuid} saved`)

          // notify agent is connected
          if (!clients.get(client.id)) {
            clients.set(client.id, agent)
            server.publish({
              topic: 'agent/connected',
              payload: JSON.stringify({
                agent: {
                  uuid: agent.uuid,
                  name: agent.name,
                  hostname: agent.hostname,
                  pid: agent.pid,
                  connected: agent.connected
                }
              })
            })
          }

          // store metrics - for save metrics in paralelo
          for (let metric of payload.metrics) {
            Metric.create(agent.uuid, metric)
              .then(m => {
                debug(`Metric ${m.id} saved on agent ${agent.uuid}`)

                // on/off the water valve
                if (m.category === 'valve' && m.value === 'on') {
                  relay.open()
                  led.on()
                } else {
                  relay.close()
                  led.off()
                }
              })
              .catch(e => {
                return handleError(e)
              })
          }
        }
        break
    }
  })
})

server.on('clientConnected', client => {
  debug(`Client Connected ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async (client) => {
  debug(`Client Disconnected ${client.id}`)

  const agent = clients.get(client.id)
  if (agent) {
    // mark agent as disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      handleError(e)
    }

    // delete agent from clients list
    clients.delete(client.id)

    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Client ${client.id} associated to agent (${agent.uuid}) marked as disconnected`)
  }
})

server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError)

  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.green('[module-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[FATAL ERROR]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`${chalk.red('[ERROR]')} ${err.message}`)
  console.error(err.stack)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
