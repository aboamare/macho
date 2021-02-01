const Koa = require('koa')
const Router = require('@koa/router')

const { Leds } = require('./lib/leds')
const signals = ['general', 'co2', 'fire', 'engine', 'telegraph', 'bridge', 'watch']

const app = new Koa()
const router = new Router()

router
  .get('/signals', (ctx, next) => {
    // return state of the signals
    ctx.body = signals.reduce((map, name, idx) => {
      map[name] = Leds[idx].state
      return map
    }, {})
  })

  .put('/:signal', async (ctx, next) => {
    const signal = ctx.params.signal
    const idx = signals.findIndex(name => name === signal)
    if (idx >= 0) {
      await Leds[idx].switchOn()
      ctx.body = {[signal]: Leds[idx].state}
    } else {
      ctx.status = 404
    }
  })

  .del('/:signal', async (ctx, next) => {
    const signal = ctx.params.signal
    const idx = signals.findIndex(name => name === signal)
    if (idx >= 0) {
      await Leds[idx].switchOff()
      ctx.body = {[signal]: Leds[idx].state}
    } else {
      ctx.status = 404
    }
  })

app
  .use(router.routes())
//  .use(require('koa-static')('./app/dist'))

app.listen(process.env.HTTP_PORT || 8080)