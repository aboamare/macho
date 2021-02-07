<template>
  <div class="signal" :class="css" @click="toggle">
  </div>
</template>

<style scoped>
  div.signal {
    background-color: white;
    background-image: url("/src/assets/alarms.png");
    background-size: 1057px 130px;
    height: 130px;
    margin-top: 1px;
    opacity: 66%;
    width: 151px;
  }
  div.on {
    opacity: 100%;
  }
  div.general {
    background-position: 0 0;
  }
  div.co2 {
    background-position: -302px 0;
  }
  div.fire {
    background-position: -453px 0;
  }
  div.engine {
    background-position: -604px 0;
  }
  div.telegraph {
    background-position: -151px 0;
  }
  div.bridge {
    background-position: -904px 0;
  }
  div.watch {
    background-position: -755px 0;
  }
</style>

<script>
export default {
  name: 'AlarmSignal',
  props: {
    name: String,
    state: String
  },
  computed: {
    css() {
      return {
        [this.name]: true,
        on: this.state === 'on',
      }
    }
  },
  methods: {
    toggle () {
      const url = new URL(window.location.href)
      url.pathname = `/${this.name}`
      if (url.origin === 'http://localhost:3000') {
        url.port = '8080'
      }
      fetch(url, { method: this.state === 'on' ? 'DELETE' : 'PUT' })
    }
  }
}
</script>