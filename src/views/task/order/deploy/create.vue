<template>
  <a-form-model ref="ruleForm" :model="form.data" :rules="form.rules"
                v-bind="formItemLayout">

    <a-form-model-item label="应用标签">
      <a-select v-model="form.select.app_label" style="width: 100%" @change="handleChangelabel">
        <a-select-option v-for="label in Object.keys(data.apps)" :key="label">
          {{ label }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="应用名" prop="app" extra="选择多个则为以同一份信息建立多个工单,当前可用于storm-tdps"
                       :rules="{required: true, message: '请选择应用', trigger: 'blur'}">
      <a-select :value="form.select.app" style="width: 100%" mode="multiple"
                @change="handleChangeapp">
        <a-select-option v-for="(app,index) in filteredOptions()" :key="index" :value="`${app[0]}#${app[1]}`">
          {{ app[1] }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="程序" prop="annex"
                       :rules="{required: true, message: '请选择附件', trigger: 'blur'}">
      <a-upload v-model="form.data.annex" :file-list="fileList"
                :before-upload="beforeUpload">
        <a-button>
          <a-icon type="upload"/>
          Select File
        </a-button>
      </a-upload>
      <a-progress v-show="percent>0" :percent="percent"/>
    </a-form-model-item>

    <a-form-model-item label="Commit号" prop="commit"
                       :rules="{required: true, message: 'commit 号必写', trigger: 'blur'}">
      <a-input placeholder="Git Commit 号" v-model="form.data.commit"/>
    </a-form-model-item>

    <a-form-model-item label="部署原因" prop="why"
                       :rules="{required: true, message: '版本部署原因必写', trigger: 'blur'}">
      <a-input type="textarea" :auto-size="{minRows:5,maxRows:10}"
               v-model="form.data.why"/>
    </a-form-model-item>

    <a-form-model-item v-for="(item,index) in form.data.steps" :key="index" :label="'部署步骤'+(index+1)"
                       :rules="{required: false,message: '部署内容不可为空',trigger: 'blur',}">
      <a-input type="textarea" :auto-size="{minRows:5,maxRows:10}"
               placeholder="这里是用于说明项目的特殊部署步骤，一个步骤一个输入框，没有可不写"
               v-model="item.text" style="width: 95%;"/>
      <a-icon v-if="form.data.steps.length > 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="form.data.steps.length === 1"
              @click="removestep(item)"/>
    </a-form-model-item>

    <a-form-model-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 60%" @click="addstep">
        <a-icon type="plus"/>
        添加部署步骤
      </a-button>
    </a-form-model-item>


    <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">

      <a-button type="primary" @click="onSubmit" :loading="uploading">
        Create
      </a-button>
      <a-button style="margin-left: 10px;" @click="resetForm">
        Reset
      </a-button>

    </a-form-model-item>

  </a-form-model>
</template>

<script>

export default {
  data: () => ({
    uploading: false,
    percent: 0,
    form: {
      data: {
        app: [],
        annex: "",
        commit: "",
        why: "",
        steps: []
      },
      select: {
        app_label: "",
        app: [],
      },
    },
    data: {
      apps: {},
    },
    fileList: [],
    formItemLayout: {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    },
    formItemLayoutWithOutLabel: {
      wrapperCol: {
        xs: {span: 6, offset: 0},
        sm: {span: 6, offset: 10},
      },
    },
  }),
  mounted() {
    this.get_apps()
  },
  methods: {
    get_apps() {
      this.$http.get('/apis/assets/app/').then(res => {
        this.data.apps = res.data
        this.form.select.app_label = Object.keys(res.data)[0]
      })
    },
    handleChangelabel(value) {
      this.form.select.app_label = value
      this.form.select.app = []
    },
    handleChangeapp(value) {
      this.form.data.app = [];
      this.form.select.app = value;
      value.forEach(item => {
        this.form.data.app.push(parseInt(item.split('#')[0]))
      })
    },
    filteredOptions() {
      let apps = this.data.apps[this.form.select.app_label]
      if (apps) {
        return apps.filter(app => !this.form.select.app.includes(`${app[0]}#${app[1]}`));
      }
    },
    beforeUpload(file) {
      this.fileList = [file]
      this.form.data.annex = file
      return false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {

          this.uploading = true
          const formData = new FormData();
          this.form.data.app.forEach(item => {
            formData.append('app', item)
          })
          formData.append('annex', this.form.data.annex)
          formData.append('content', JSON.stringify({
            order: this.form.data.app,
            commit: this.form.data.commit,
            why: this.form.data.why,
            steps: this.form.data.steps
          }))

          this.$http.post('/apis/tasks/order/deploy/', formData, {
            onUploadProgress: (e => {
              if (e.lengthComputable) {
                this.percent = (e.loaded / e.total * 100)
              }
            })
          }).then(res => {
            console.log(res)
            this.$message.success("创建成功")
            this.$emit("submit")
          }).finally(() => {
            this.uploading = false
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.percent = 0
      this.fileList = []
      this.form.data.steps = []
      this.form.select.app = []
      this.$refs.ruleForm.resetFields();
    },
    addstep() {
      this.form.data.steps.push({name: (this.form.data.steps.length + 1).toString(), text: ""})
    },
    removestep(item) {
      let index = this.form.data.steps.indexOf(item);
      if (index !== -1) {
        this.form.data.steps.splice(index, 1);
      }
    }
  },
};
</script>
<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>