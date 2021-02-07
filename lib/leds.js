const EventEmitter = require('events')

let { Gpio } = require('onoff')

// A fake implementation of Gpio to test on non Raspberry system
if (Gpio.accessible === false) {
  console.warn('Raspberry Gpio not accessible, using fake implementation!')
  class FakeGpio extends Object {
    constructor (ch, mode) {
      super()
    }
    write (value) {
      return new Promise((resolve, reject) => {
        resolve(value)
      })
    }
    unexport () {
      return
    }
  }
  Gpio = FakeGpio
}

const Off = 'off'
const On = 'on'

class Led extends EventEmitter {
  constructor (pin, label='general') {
    super()
    this.io = new Gpio(pin, 'out')
    this.label = label
    this.state = Off
    this.switchOff(false)
  }

  switchOn (notify = true) {
    return this.io.write(0)
      .then(() => {
        this.state = On
        if (notify) this.emit('switched', { [this.label]: this.state })
        return this.state
      })
  }

  switchOff (notify = true) {
    return this.io.write(1)
      .then(() => {
        this.state = Off
        if (notify) this.emit('switched', { [this.label]: this.state })
        return this.state
      })
  }

  unexport () {
    return this.switchOff(false)
      .then(() => {
        console.log(`Unexporting led ${this.label}`)
        return this.io.unexport()
      })
      .catch(err => {
        console.warn(err)
      })
  }
}

const pins = [5, 6, 13, 16, 19, 20, 21, 26]
let Leds = []
function initLeds (labels = ['general']) {
  Leds.forEach(led => led.unexport())
  Leds = labels.slice(0, 8).map((label, idx) => new Led(pins[idx], label))
  return Leds
}

process.on('SIGINT', () => {
  console.log('Releasing leds...')
  Promise.all(Leds.map(led => led.unexport()))
  .then(() => process.exit(0))
})

module.exports = { Leds: initLeds, Off, On }
