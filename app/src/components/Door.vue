<template>
  <div class="door" :class="css">
    <span v-show="state==='closed'"><v-icon class="icon" icon="door-closed"/></span>
    <span v-show="state==='open'"><v-icon class="icon" icon="door-open"/></span>
    <br/>
    {{name}}: {{state}}
  </div>
</template>

<style scoped>
  div.door {
    color: darkgreen;
  }
  div.door.warning {
    color: orange
  }
  div.door.danger {
    color: orangered
  }
  div.door .icon {
    font-size: 10em;
  }
</style>

<script>
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons'
FontAwesomeIcon.appIcons = { faDoorOpen, faDoorClosed }
library.add(Object.values(FontAwesomeIcon.appIcons))
dom.watch()

export default {
  name: 'Door',
  components: {
    'v-icon': FontAwesomeIcon
  },
  props: {
    name: String,
    state: String,
    severity: String
  },
  computed: {
    css() {
      console.log(`${this.name} is now ${this.severity}`)
      return { [this.severity || 'normal']: true }
    },
    iconObj() {
      console.log(`${this.name} should show door-${this.state}`)
      return ['fas', this.state === 'open' ? 'door-open' : 'door-closed']
    }
  }
}
</script>