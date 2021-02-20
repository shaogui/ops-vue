<template>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="类型">
      <a-select v-model="form.type" placeholder="请选择需要刷新的url类型">
        <a-select-option value="file"> 文件</a-select-option>
        <a-select-option value="dir"> 目录</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="内容">
      <a-input v-model="form.url" type="textarea" placeholder="请输入需要刷新的url" :auto-size="{minRows:10}"/>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit" :loading="$store.getters.iconLoading('cdn')">
        提交
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import eventBus from "@/utils/eventBus";

export default {
  data() {
    return {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      form: {
        type: 'file',
        url: '',
      },
    };
  },
  mounted() {
    eventBus.$on("cdn-Refresh", (text) => {
      this.form.url = text.url
      this.form.type = text.type
      this.onSubmit()
    })
  },
  methods: {
    onSubmit() {
      this.$store.commit('changeiconLoading', {
        path: "cdn", bool: true
      })
      console.log('submit!', this.form);
      const message = this.$message
      this.$http({
        method: 'post',
        url: '/apis/tools/cdn/',
        data: this.form,
        type: 'json',
      }).then(res => {
        console.log(res)
        message.success("刷新成功")
      }).catch(res => {
        switch (res.status) {
          case 400:
            message.error(JSON.stringify(res.data));
            break;
          default:
            message.error("请求异常")
            console.log()
        }
      }).finally(() => {
        eventBus.$emit("cdn-reload")
        this.$store.commit('changeiconLoading', {
          path: "cdn", bool: false
        })
      });
    },
  },
};
</script>
