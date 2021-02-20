<template>

  <a-form-model ref="ruleForm" :model="form.data" :rules="form.rules"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol">
    <a-form-model-item label="应用标签" prop="app_label">
      <a-select v-model="form.data.app_label" style="width: 100%" @change="handleChangelabel">
        <a-select-option v-for="label in labels" :key="label">
          {{ label }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="应用名" prop="app_name" extra="选择多个则为以同一份信息建立多个工单,当前可用于storm-tdps">
      <a-select :value="selectedItems" style="width: 100%" mode="multiple"
                v-model="form.data.app_name"
                @change="handleChangeapp">
        <a-select-option v-for="app in filteredOptions()" :key="app" :value="app">
          {{ app }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="commit号" prop="commit">
      <a-input placeholder="gitlab commit 号" v-model="form.data.commit"/>
    </a-form-model-item>

    <a-form-model-item label="版本号" prop="version">
      <a-input placeholder="可不写" v-model="form.data.version"/>
    </a-form-model-item>

    <a-form-model-item label="相关信息" prop="context">
      <a-input type="textarea" :auto-size="{minRows:10}"
               placeholder="请以markdown 形式填写：部署原因、测试情况、潜在风险、服务器资源、启动方式等等，包括但不限于以上，可不全写"
               v-model="form.data.context"
      />
    </a-form-model-item>

    <a-form-model-item label="程序">
      <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" v-model="form.data.annex">
        <a-button>
          <a-icon type="upload"/>
          Select File
        </a-button>
      </a-upload>
    </a-form-model-item>

    <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">

      <a-button type="primary" @click="onSubmit" :loading="uploading"
                :disabled="fileList.length === 0 || fileList.length > 1">
        Create
      </a-button>
      <a-button style="margin-left: 10px;" @click="resetForm">
        Reset
      </a-button>

    </a-form-model-item>

  </a-form-model>
</template>

<script>
import eventBus from "@/utils/eventBus";

export default {
  data: () => ({
    uploading: false,
    form: {
      data: {
        app_label: "",
        app_name: "",
        commit: "",
        version: "",
        context: {},
        annex: ""
      },
      rules: {
        commit: [{required: true, message: '请输入commit号', trigger: 'blur'}],
        context: [{required: true, message: '请输入版本修改原因', trigger: 'blur'}],
      },
    },
    data: {},
    labels: [],
    apps: [],
    fileList: [],
    current_label_apps: [],
    selectedItems: [],
    formItemLayout: {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    },
  }),
  beforeCreate() {
    // this.form = this.$form.createForm(this, {name: 'validate_other'});
  },
  mounted() {
    this.get_apps()
  },
  methods: {
    get_apps() {
      this.$http({
        url: '/apis/assets/app/',
        method: "get"
      }).then(res => {
        for (let label in res.data) {
          this.labels.push(label)
        }
        this.apps = res.data
        this.form.data.app_label = this.labels[0]
        this.current_label_apps = this.apps[this.form.data.app_label]
        this.form.data.app_name = this.current_label_apps[0]
      })
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file]
      this.form.data.annex = this.fileList[0]
      // this.fileList = [...this.fileList, file];
      return false;
    },
    handleChangelabel(value) {
      this.form.data.app_label = value
      this.form.data.app_name = this.apps[value][0]
      this.current_label_apps = this.apps[value]
    },
    handleChangeapp(value) {
      this.selectedItems = value;
    },
    filteredOptions() {
      return this.current_label_apps.filter(o => !this.selectedItems.includes(o));
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.uploading = true
          const formData = new FormData();
          for (let key in this.form.data) {
            formData.append(key, this.form.data[key]);
          }
          const message = this.$message
          this.$http({
            method: 'post',
            url: '/apis/order/deploy/',
            data: formData,
            type: 'json',
          }).then(res => {
            console.log(res)
            this.$emit("create", 'visible1');
            this.resetForm()
            message.success("创建成功")
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
            this.uploading = false
            eventBus.$emit("cdn-reload")
            this.$store.commit('changeiconLoading', {
              path: "cdn", bool: false
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>
<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>