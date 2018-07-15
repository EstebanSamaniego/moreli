
const ModuleSlave = require('../')

const agent = new ModuleSlave({
  name: 'myapp',
  username: 'admin',
  interval: 2000
})

agent.addMetric({ position: 'garden', type: 'lemon_tree' }, function () {
  let random = Math.floor(Math.random() * (3 - 1)) + 1
  if (random === 1) {
    return 'on'
  }
  return 'off'
})

agent.addMetric({ position: 'garden', type: 'peach_tree' }, function () {
  let random = Math.floor(Math.random() * (3 - 1)) + 1
  if (random === 1) {
    return 'on'
  }
  return 'off'
})


agent.addMetric({ position: 'garden', type: 'rss' }, function getRss () {
  return process.memoryUsage().rss
})

agent.addMetric({ position: 'garden', type: 'promiseMetric' }, function getRandomPromise () {
  return Promise.resolve(Math.random())
})

agent.addMetric({ position: 'garden', type: 'callbackMetric' }, function getRandomCallback (callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// this agent only
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

// Other Agents
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', handler)

function handler (payload) {
  console.log(payload)
}

// setTimeout(() => agent.disconnect(), 10000)
