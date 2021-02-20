<template>
  <div>
    <div v-highlight v-for="bash in this.code" :key="bash.id">
      <h1>{{ bash.name }}</h1>
      <pre><code v-html="bash.content.format(theformat)"></code></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: "bash_code_display",
  props: {
    code: Array,
    format: Object,
  },
  data() {
    return {
      data: {}
    }
  },
  computed: {
    theformat() {
      return this.format
    }
  },
}
</script>
