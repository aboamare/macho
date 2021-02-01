const { Doors } = require('./lib/doors')

Object.values(Doors).forEach(door => {
  door.on('opened', d => console.log(`Door ${d.label} is now ${d.state}!`))
  door.on('closed', d => console.log(`Door ${d.label} was ${d.state}`))
})