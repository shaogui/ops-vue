<template>
  <a-modal title="文件覆盖" :visible="visible"
           :confirm-loading="confirmLoading"
           @ok="$emit('close')"
           @cancel="$emit('close')">
    <a-upload-dragger list-type="picture" :multiple="false" :fileList="fileList"
                      @change="HandleChange" :accept="parent.directory.exts"
                      :beforeUpload="BeforeUpload"
                      :customRequest="CustomRequestPut"
                      :action="`/apis/tools/files/upload/file/${parent.id}/`" name="tmp_path">
      <p class="ant-upload-drag-icon">
        <a-icon type="cloud-upload"/>
      </p>
      <p class="ant-upload-hint"> 点击或拖拽进行上传 </p>
    </a-upload-dragger>
  </a-modal>
</template>
<script>
import {BeforeUpload, CustomRequestPut, HandleChange} from '@/utils/upload'

export default {
  props: {
    parent: Object,
    visible: Boolean
  },
  data() {
    return {
      confirmLoading: false,
      fileList: []
    }
  },
  watch: {
    parent: {
      immediate: true,
      handler: function () {
        console.log("watch parent", this.visible)
        this.fileList = []
      }
    },
  },
  methods: {
    BeforeUpload,
    CustomRequestPut,
    HandleChange,
  },
};
</script>
