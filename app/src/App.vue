<template>
  <div class="layout">
    <div class="signal-column">
      <alarm-signal v-for="(state, name) in alarms" :key="name" :name="name" :state="state" />
    </div>
    <door class="door" v-for="(state, name) in doors" :key="name" :name="name" :state="state" :severity="severity(name)" />
  </div>
</template>

<script>
import AlarmSignal from './components/AlarmSignal.vue'
import Door from './components/Door.vue'

export default {
  name: 'App',
  components: {
    'alarm-signal': AlarmSignal,
    'door': Door
  },
  data() {
    return {
      alarms: {general: 'off', co2: 'on'},
      doors: {ER: 'closed', ECR: 'closed'}
    }
  },
  created () {
    const url = window.location
    const ws = new WebSocket(`ws://${url.host}:${url.poort}/subscribe`)
    ws.onmessage = ev => {
      try {
        const changes = JSON.parse(ev.data)
        for (const name in changes) {
          const state = changes[name]
          if (state === 'on' || state === 'off') {
            this.alarms[name] = state
          } else if (state === 'open' || state === 'closed') {
            console.log(`${name} is now ${state}`)
            this.doors[name] = state
          }
        }
      } catch (err) {
        console.warn(err)
      }
    }
  },
  methods: {
    severity (doorName) {
      console.log(`recomputing severity for ${doorName}..`)
      if (this.doors[doorName] === 'open') {
        return (Object.values(this.doors).filter(state => state === 'open').length > 1) ? 'danger' : 'warning'
      }
      return 'normal'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
div.layout {
  align-items: center;
  column-gap: 2em;
  display: flex
}
div.signal-column {
  background-color: black;
    width: 151px;
}
</style>