
const ModuleSlave = require('../')

const agent = new ModuleSlave({
  name: 'garden',
  username: 'osvaldo hinojosa',
  interval: 6000,
})

let obj = {
  location: 'garden', 
  category: 'valve',
  type: 'water',
  board: 'arduino'
}

// let objCopy

agent.addMetric(obj, function () {
  let random = Math.floor(Math.random() * (3 - 1)) + 1
  if (random === 1) {
    return 'on'
  }
  return 'off'
})

// objCopy = Object.assign(obj, { location: 'garden', type: 'peach_tree' })
// agent.addMetric( objCopy, function () {
//   let random = Math.floor(Math.random() * (3 - 1)) + 1
//   if (random === 1) {
//     return 'on'
//   }
//   return 'off'
// })

// objCopy = Object.assign(objCopy, { location: 'garden', type: 'rss' })
// agent.addMetric(obj, function getRss () {
//   return process.memoryUsage().rss
// })

// objCopy = Object.assign(objCopy, { location: 'garden', type: 'promiseMetric' })
// agent.addMetric(obj, function getRandomPromise () {
//   return Promise.resolve(Math.random())
// })

// objCopy = Object.assign(objCopy, { location: 'garden', type: 'callbackMetric' })
// agent.addMetric(obj, function getRandomCallback (callback) {
//   setTimeout(() => {
//     callback(null, Math.random())
//   }, 1000)
// })

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
