<template>
  <div>
    <a-button type="primary" icon="edit" @click="drawer.visible = true">添加服务器</a-button>
    <p></p>
    <tableserver ref="tableserver"/>

    <a-drawer title="添加服务器" placement="right" :closable="false" width="50%"
              :visible="drawer.visible" @close="drawer.visible = false">
      <AddServer @submit="HandleSubmit" :render="drawer.render"/>
    </a-drawer>
  </div>
</template>
<script>
import tableserver from '@/components/assets/table-server'
import AddServer from './add-server'


export default {
  data() {
    return {
      drawer: {
        visible: false
      },
    };
  },
  components: {tableserver, AddServer},
  mounted() {
  },
  methods: {
    HandleSubmit() {
    }
  }
};
</script>
