<template>
  <a-form-model ref="ruleForm" :model="data" v-bind="formItemLayout">

    <a-form-model-item label="服务器区域">
      <!--      <a-select v-model="select.app_label" style="width: 100%" @change="handleChangelabel">-->
      <!--        <a-select-option v-for="label in Object.keys(data.apps)" :key="label">-->
      <!--          {{ label }}-->
      <!--        </a-select-option>-->
      <!--      </a-select>-->
    </a-form-model-item>

    <a-form-model-item label="实例ID" prop="instance_id"
                       :rules="{required: true, message: '不可为空', trigger: 'blur'}">
      <a-input v-model="data.instance_id"/>
    </a-form-model-item>

    <a-form-model-item label="实例名称" prop="instance_name"
                       :rules="{required: true, message: '不可为空', trigger: 'blur'}">
      <a-input v-model="data.instance_name"/>
    </a-form-model-item>

    <a-form-model-item label="远程端口" prop="remote_port"
                       :rules="{required: true, message: '不可为空', trigger: 'blur'}">
      <a-input-number v-model="data.remote_port" :min="1" :max="65535"/>
    </a-form-model-item>
    <a-form-model-item label="私有IPV4地址" prop="ipaddress"
                       :rules="{required: true, message: '不可为空', trigger: 'change',validator:RuleIpV4}">
      <a-input v-model="data.ipaddress"/>
    </a-form-model-item>
    <a-form-model-item label="EIPV4" prop="eipaddress"
                       :rules="{required: false, message: '不可为空', trigger: 'change',validator:RuleIpV4}">
      <a-input v-model="data.eipaddress"/>
    </a-form-model-item>

    <a-form-model-item label="CPU核心数" prop="cpus"
                       :rules="{required: true, message: '不可为空', trigger: 'blur'}">
      <a-input-number v-model="data.cpus" :min="1" :max="65535"/>
    </a-form-model-item>
    <a-form-model-item label="内存大小(GB)" prop="memory"
                       :rules="{required: true, message: '不可为空', trigger: 'blur'}">
      <a-input-number v-model="data.memory" :min="1" :max="65535"/>
    </a-form-model-item>

    <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }">

      <a-button type="primary" @click="onSubmit">
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
  props: {
    render: Number
  },
  data() {
    return {
      data: {
        remote_port: 22,
        cpus: 0,
        memory: 0
      },
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

    }
  },
  watch: {
    render: function () {
      this.get_apps()
      this.resetForm()
    }
  },
  mounted() {
  },
  methods: {
    getServerArea() {
      this.$http.get('/apis/assets/server/area/').then(res => {
        this.data.apps = res.data
        this.form.select.app_label = Object.keys(res.data)[0]
      })
    },
    onSubmit() {
      this.$refs.rulevalidate(valid => {
        if (valid) {

          this.uploading = true
          const formData = new FormData();
          this.data.app.forEach(item => {
            formData.append('app', item)
          })
          formData.append('annex', this.data.annex)
          formData.append('content', JSON.stringify({
            order: this.data.app,
            commit: this.data.commit,
            why: this.data.why,
            steps: this.data.steps
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
      this.data.steps = []
      this.select.app = []
      this.$refs.ruleForm.resetFields();
    },
    addstep() {
      this.data.steps.push({name: (this.data.steps.length + 1).toString(), text: ""})
    },
    removestep(item) {
      let index = this.data.steps.indexOf(item);
      if (index !== -1) {
        this.data.steps.splice(index, 1);
      }
    },
    RuleIpV4(rule, value, callback) {
      if (!value) {
        return callback()
      }
      let regxp = new RegExp("^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!.$).)){4}$");
      if (!regxp.test(value)) {
        rule.message = "地址不合法"
        return callback(new Error);
      } else {
        return callback()
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