<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="操作">
        <submit></submit>
      </a-tab-pane>
      <a-tab-pane key="2" tab="历史记录">
        <history ref="history"></history>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import submit from '../../components/tools/cdn/submit'
import history from '../../components/tools/cdn/history'

export default {
  data() {
    return {};
  },
  components: {
    submit,
    history
  },
  methods: {
    callback(key) {
      console.log(key)
    },
  },
};
</script>
