let { Gpio } = require('onoff')

const osType = require('os').type()
if (osType !== 'Linux') {
  class FakeGpio extends Object {
    constructor (ch, mode) {
      super()
    }
    write (value) {
      return new Promise((resolve, reject) => {
        resolve(value)
      })
    }
  }
  Gpio = FakeGpio
}

const Off = 'off'
const On = 'on'

class Led extends Gpio {
  constructor (ch) {
    super(ch, 'out')
    this.state = Off
    this.switchOff()
  }

  switchOn () {
    return this.write(0)
      .then(() => this.state = On)
  }

  switchOff () {
    return this.write(1)
      .then(() => this.state = Off)
  }
}

const channels = [5, 6, 13, 16, 19, 20, 21, 26]
const Leds = channels.map(ch => new Led(ch))

process.on('SIGINT', () => {
  Leds.forEach(led => {
    led.switchOff()
    led.unexport()
  })
})

module.exports = { Leds, Off, On }
