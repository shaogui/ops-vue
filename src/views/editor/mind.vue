<template>
  <div>
    <mindmap v-model="data" :height="clientHeight" @updateNodeName="HandleupdateNodeName"/>
  </div>
</template>

<script>
// https://github.com/hellowuxin/mindmap
import mindmap from '@hellowuxin/mindmap'

export default {
  data() {
    return {
      data: [
        {
          "name": "开始",
          "children": []
        },
      ],
      clientHeight: document.body.clientHeight * .829
    }
  },
  components: {mindmap},
  methods: {
    HandleupdateNodeName(data, id) {
      console.log(data, id)
    }
  }
}
</script>

<style scoped>

</style>