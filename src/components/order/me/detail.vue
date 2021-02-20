<template>
  <a-form-model ref="ruleForm" :model="form"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol">

    <template>
      <a-steps>
        <a-step status="finish" title="创建"></a-step>

        <a-step v-if="form.status === 'allow'" status="finish" title="审批"></a-step>
        <a-step v-else-if="form.status === 'deny'" status="error" title="审批"></a-step>
        <a-step v-else status="wait" title="审批"></a-step>

        <a-step v-if="form.status2 === 'allow'" status="finish" title="部署"></a-step>
        <a-step v-else-if="form.status2 === 'deny'" status="error" title="部署"></a-step>
        <a-step v-else status="wait" title="部署"></a-step>
      </a-steps>
    </template>

    <a-form-model-item label="应用标签" prop="app_label">
      <a-input v-model="form.app_label" readOnly/>
    </a-form-model-item>

    <a-form-model-item label="应用名" prop="app_name">
      <a-input v-model="form.app_name" readOnly/>
    </a-form-model-item>

    <a-form-model-item label="附件地址">
      <a-input v-model="form.annex"></a-input>
    </a-form-model-item>

    <a-form-model-item label="commit号" prop="commit">
      <a-input v-model="form.commit" readOnly/>
    </a-form-model-item>

    <a-form-model-item label="版本号" prop="version">
      <a-input v-model="form.version" readOnly/>
    </a-form-model-item>

    <a-form-model-item label="相关信息" prop="context">
      <a-input type="textarea"
               :auto-size="{minRows:10}" v-model="form.context" readOnly/>
    </a-form-model-item>

  </a-form-model>
</template>

<script>

export default {
  data: () => ({
    uploading: false,
    data: {},
    formItemLayout: {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    },
  }),
  props: {
    form: {},
  },
  mounted() {
  },
  methods: {},
};
</script>
<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>