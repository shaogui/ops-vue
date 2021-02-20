<template>
  <a-upload-dragger name="path" :multiple="true" @change="handleChange"
                    action="http://192.168.86.66:8000/apis/tools/files/upload/"
                    :headers="{Authorization:$store.state.Authorization}"
                    :data="data" :accept="accept" list-type="picture">
    <p class="ant-upload-drag-icon">
      <a-icon type="cloud-upload"/>
    </p>
    <p class="ant-upload-hint"> 点击或拖拽进行上传 </p>
  </a-upload-dragger>

</template>
<script>
export default {
  props: {
    data: Object,
    accept: String
  },
  methods: {
    handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }

      let fileList = [...info.fileList];
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileList;
    },
  },
};
</script>
