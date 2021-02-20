<template>
  <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">

    <a-form-model-item label="用户ID">
      <a-row :gutter="24">
        <a-col :span="5">
          <a-input v-model="form.id" disabled="" :span="1"/>
        </a-col>
      </a-row>
    </a-form-model-item>

    <a-form-model-item label="姓名">
      <a-input v-model="form.name" disabled=""/>
    </a-form-model-item>

<!--    <a-form-model-item label="当前状态?">-->
    <!--      <a-input v-model="form.name"/>-->
    <!--    </a-form-model-item>-->

    <a-form-model-item label="邮箱">
      <a-input v-model="form.email"/>
    </a-form-model-item>

    <a-form-model-item label="电话">
      <a-input v-model="form.telephone"/>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  data() {
    return {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
  },
  props: {
    form: Object
  },
  methods: {
    onSubmit() {
      console.log('submit!', this.form);
    },
  },
};
</script>
