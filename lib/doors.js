const EventEmitter = require('events')

const { Gpio } = require('onoff')

const Open = 'OPEN'
const Closed = 'CLOSED'
const Doors = {}

// ignore quick changes, to avoid too many state changes. 
const debounceTimeout= 50 // in milliseconds

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
    this.emit(value ? 'opened' : 'closed', { label, state: this.state })
  }
}

// clean up on exit
process.on('SIGINT', _ => {
  Object.values(Doors).forEach(d => d.switch.unexport())
})

// Map doors to Raspberry Pi pins
Doors.A = new Door(17, 'A')
Doors.B = new Door(27, 'B')
Doors.C = new Door(22, 'C')

module.exports = { Doors, Open, Closed }
