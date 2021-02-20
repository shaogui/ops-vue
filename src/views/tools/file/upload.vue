<template>
  <a-upload-dragger v-if="parent.category === 'file'" list-type="picture" :multiple="true" :fileList="fileList"
                    :action="`/apis/tools/files/upload/file/`"
                    @change="HandleChange" :accept="parent.exts"
                    name="tmp_path" :data='{directory:parent.id}'
                    :beforeUpload="BeforeUpload"
                    :customRequest="CustomRequest">
    <p class="ant-upload-drag-icon">
      <a-icon type="cloud-upload"/>
    </p>
    <p class="ant-upload-hint"> 点击或拖拽进行上传 </p>
  </a-upload-dragger>
  <a-upload-dragger v-else directory list-type="picture" :fileList="fileList"
                    :action="`/apis/tools/files/upload/file/`"
                    @change="HandleChange" :accept="parent.exts"
                    name="tmp_path" :data='{directory:parent.id}'
                    :beforeUpload="BeforeUpload"
                    :customRequest="CustomRequest">
    <p class="ant-upload-drag-icon">
      <a-icon type="cloud-upload"/>
    </p>
    <p class="ant-upload-hint"> 点击或拖拽进行上传 </p>
  </a-upload-dragger>

</template>
<script>
import {BeforeUpload, HandleChange, CustomRequest} from '@/utils/upload'

export default {
  props: {
    parent: Object,
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {},
  watch: {
    parent: {
      immediate: true,
      handler: function () {
        this.fileList = []
      }
    },
  },
  methods: {
    BeforeUpload, HandleChange, CustomRequest
  },
};
</script>
