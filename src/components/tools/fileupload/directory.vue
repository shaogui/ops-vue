<template>
  <div class="gutter-example">
    <a-row :gutter="16">
      <a-col v-for="item in data" :key="item.id" class="gutter-row" :span="6">
        <a-upload-dragger name="path" :multiple="true" @change="handleChange"
                          action="http://192.168.86.66:8000/apis/tools/files/upload/"
                          :headers="{Authorization:$store.state.Authorization}"
                          :data="{root_path:item.id}" :accept="item.exts" list-type="picture">
          <p class="ant-upload-drag-icon">
            <a-icon type="folder-add" theme="twoTone"/>
          </p>
          <p class="ant-upload-text">
            {{ item.name }}
          </p>
          <p class="ant-upload-hint">
            创建于:{{ item.create_time }}
          </p>
        </a-upload-dragger>
      </a-col>
    </a-row>
  </div>
</template>
<script>

export default {
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    this.getpath()
  },
  methods: {
    getpath() {
      this.$http({
        url: '/apis/tools/files/root_path/',
        method: 'get',
        type: 'json',
      }).then(res => {
        this.data = res.data.results
        console.log(this.data)
      }).catch(res => {
        console.log('error', res)
      });
    },
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
