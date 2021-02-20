<template>
  <div :style="{height: `${clientHeight}px`}">
    <vfd/>
  </div>
</template>

<script>
import vfd from 'vfd'

export default {
  data() {
    return {
      clientWidth: 0,
      clientHeight: document.body.clientHeight * .829
    }

  },
  components: {
    vfd
  },
  methods: {},
}
</script>
<style scoped>
</style>