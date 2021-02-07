const Koa = require('koa')
const Router = require('@koa/router')
const Websockets = require('koa-easy-ws')

const { Doors } = require('./lib/doors')
const { Leds } = require('./lib/leds')
const alarms = Leds(['general', 'co2', 'fire', 'engine', 'telegraph', 'bridge', 'watch'])
const doors = Doors(['ECR', 'ER'])

const service = new Koa()
const router = new Router()

const subscribers = new Set([])
doors.forEach(door => {
  door.on('opened', ev => {
    subscribers.forEach(ws => ws.send(JSON.stringify({ [door.label]: door.state })))
  })
  door.on('closed', ev => {
    subscribers.forEach(ws => ws.send(JSON.stringify({ [door.label]: door.state })))
  })
})
alarms.forEach(led => {
  led.on('switched', ev => {
    subscribers.forEach(ws => ws.send(JSON.stringify(ev)))
  })
})

function states () {
  return doors.concat(alarms).reduce((map, io) => {
    map[io.label] = io.state
    return map
  }, {})
}

const serve =  require('koa-static')('./app/dist')

router
  .get('/subscribe', async (ctx, next) => {
    if (ctx.ws) {
      const ws = await ctx.ws()
      ws.isAlive = true
      subscribers.add(ws)
      ws.pingpong = setInterval(() => {
        if (ws.isAlive) {
          ws.isAlive = false
          ws.ping()
        } else {
          console.log('websocket no longer alive, closing it!')
          ws.terminate()
        }}, 15*1000) // ping every 15 secs
      ws.on('pong', () => { 
        console.log('websocket still alive :)')
        ws.isAlive = true
      })
      ws.on('close', ev => {
        console.log('closing websocket')
        if (ws.pingpong) {
          clearInterval(ws.pingpong)
        }
        subscribers.delete(ws)
      })
      ws.send(JSON.stringify(states()))
    } else {
      ctx.body = 'To subsribe open a web socket'
    }
  })

  .get('/alarms', (ctx, next) => {
    // return state of the alarms
    ctx.body = alarms.reduce((map, name, idx) => {
      map[name] = Leds[idx].state
      return map
    }, {})
  })

  .put('/:signal', async (ctx, next) => {
    const signal = ctx.params.signal
    const idx = alarms.findIndex(name => name === signal)
    if (idx >= 0) {
      await Leds[idx].switchOn()
      ctx.body = {[signal]: Leds[idx].state}
    } else {
      ctx.status = 404
    }
  })

  .del('/:signal', async (ctx, next) => {
    const signal = ctx.params.signal
    const idx = alarms.findIndex(name => name === signal)
    if (idx >= 0) {
      await Leds[idx].switchOff()
      ctx.body = {[signal]: Leds[idx].state}
    } else {
      ctx.status = 404
    }
  })

  .get('/:p*', serve)

service
  .use(Websockets())
  .use(router.routes())

service.listen(process.env.HTTP_PORT || 8080)