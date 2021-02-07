const EventEmitter = require('events')

let { Gpio } = require('onoff')

const Open = 'open'
const Closed = 'closed'
const pins = [17, 27 , 22]
let Doors = []

// ignore quick changes, to avoid too many state changes. 
const debounceTimeout= 50 // in milliseconds

// A fake implementation of Gpio to test on non Raspberry system
if (Gpio.accessible === false) {
  console.warn('Raspberry Gpio not accessible, using fake implementation!')

  const intervals = []
  class FakeGpio extends Object {
    
    constructor (ch, mode) {
      super()
    }
    
    read (callback) {
      return (new Promise((resolve, reject) => {
        resolve(0)
      })
      .then(value => {
        if (typeof callback === 'function') {
          callback(null, value)
        }
        return value
      }))
    }
    
    watch (callback) {
      intervals.push(
        setInterval(() => {
          const value = Math.round(Math.random())
          if (callback) {
            callback(null, value)
          }
        }, 5000)
      )
    }

    unexport () {
      return null
    }
  }

  Gpio = FakeGpio
  Gpio.intervals = intervals
}

class Door extends EventEmitter {
  constructor (pin=17, label='A') {
    super()
    this.label = label 
    this.state = undefined
    this.switch = new Gpio(pin, 'in', 'both', { debounceTimeout })

    this.switch.read((err, value) => {
      this.update(err, value)
    }) 
    this.switch.watch((err, value) => {
      this.update(err, value)
    })
  }

  update (err, value) {
    if (err) {
      console.error(err)
      throw err
    }
    this.state = value ? Open : Closed
    this.emit(value ? 'opened' : 'closed', { [this.label]: this.state })
  }
}

// clean up on exit
process.on('SIGINT', _ => {
  console.log('Releasing switches...')
  if (Gpio.intervals) {
    Gpio.intervals.forEach(interval => clearInterval(interval))
  }
  Doors.forEach(d => d.switch.unexport())
})

// Map doors to Raspberry Pi pins
function initDoors (labels = ['A', 'B', 'C']) {
  Doors.forEach(d => d.switch.unexport())
  Doors = labels.slice(0, 3).map((label, idx) => new Door(pins[idx], label))
  return Doors
}

module.exports = { Doors: initDoors, Open, Closed }
