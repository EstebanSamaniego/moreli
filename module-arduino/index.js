
const five = require('johnny-five')
const board = new five.Board()

const ModuleSlave = require('module-slave')

const slave = new ModuleSlave({
  name: 'garden',
  username: 'arduinoUno',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
})

board.on('ready', function () {
  let value = 0
  let led = new five.Led(13)

  slave.addMetric({ position: 'garden', type: 'lemon_tree' }, function () {
    console.log(value)
    return value
  })

  setInterval(function () {
    let random = Math.floor(Math.random() * (3 - 1)) + 1
    console.log('random:', random)
    if (random === 1) {
      value = 'on'
      led.on()
    } else {
      value = 'off'
      led.off()
    }
  }, 5000)

  slave.connect()
})
