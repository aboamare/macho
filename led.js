const {Gpio} = require('onoff')

function Led(ch=1) {
  const channels = [5, 6, 13, 16, 19, 20, 21, 26]
  return new Gpio(channels[ch-1], 'out')
}

const leds = process.argv.slice(2).map(arg => Led(parseInt(arg)))
leds.forEach(led => led.write(0))
setTimeout(() => leds.forEach(led => led.write(1)), 2000)

process.on('SIGINT', () => {
  leds.forEach(led => led.unexport())
})
