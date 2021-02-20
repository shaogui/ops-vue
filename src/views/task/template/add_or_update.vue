<template>
  <div>
    <a-form-model ref="Form" :model="form.data"
                  :label-col="{span: 3}"
                  :wrapper-col="{span: 21}">

      <a-form-model-item label="指令名" prop="name" :rules="{required: true, message: '必须填写', trigger: 'blur'}">
        <a-input placeholder="请命名" v-model="form.data.name"/>
      </a-form-model-item>

      <a-form-model-item label="类型" prop="type">
        <a-radio-group v-model="form.data.type">
          <a-radio :style="radioStyle" value="bash">
            命令
          </a-radio>
          <a-radio :style="radioStyle" value="shell">
            shell 脚本
          </a-radio>
          <a-radio :style="radioStyle" value="ansible">
            ansible
          </a-radio>
          <a-radio :style="radioStyle" value="ansible-playbook">
            ansible 剧本
          </a-radio>
        </a-radio-group>
      </a-form-model-item>


      <a-form-model-item label="内容" prop="content" :rules="{required: true, message: '必须填写', trigger: 'blur'}">
        <a-popover title="内部变量提示" placement="leftTop">
          <template slot="content">
            <p>应用运行位置: ${sys_app_run_path}</p>
            <p>应用名: ${sys_app_name}</p>
            <p>应用名(忽略部分后缀): ${sys_app_name1}</p>
            <p>git commit: ${sys_app_commit}</p>
            <p>附件下载地址: ${sys_app_annex}</p>
            <p>附件名字: ${sys_app_annex_name}</p>
          </template>
          <a-input type="textarea" :auto-size="{minRows:5,maxRows: 20}" v-model="form.data.content"/>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="参数" prop="params">
        <a-input v-model="form.data.params"/>
      </a-form-model-item>

      <a-form-model-item label="关联应用" prop="app">
        <a-transfer
            :data-source="transfer.mockData"
            :list-style="{width: '47%',height: '300px',}"
            :target-keys="transfer.targetKeys"
            :render="item => item.title"
            show-search
            :filter-option="filterOption"
            @change="handleChange"
            @search="handleSearch">

          <a-button slot="footer" slot-scope="" size="small" style="float:right;margin: 5px"
                    @click="get_apps" v-if="parent == null">
            reload
          </a-button>
        </a-transfer>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
        <a-button type="primary" @click="onSubmit" :loading="uploading">
          提交
        </a-button>
        <a-button style="margin-left: 10px;" @click="resetform">
          重置
        </a-button>
      </a-form-model-item>

    </a-form-model>
  </div>

</template>

<script>
export default {
  props: {
    parent: Object,
  },
  data() {
    return {
      uploading: false,
      form: {
        data: {
          type: "bash"
        },
      },
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      transfer: {
        mockData: [],
        targetKeys: []
      },
      api: {
        url: '/apis/tasks/command/template/',
        method: 'post'
      }
    }
  },
  mounted() {
    this.get_apps()
  },
  watch: {
    parent: {
      immediate: true,
      handler: function (value) {
        if (value) {
          this.api.url = `/apis/tasks/command/template/${value.id}/`
          this.api.method = 'put'
          this.form.data = value
          const tk = []
          value.app.forEach(k => {
            tk.push(k.toString())
          })
          this.handleChange(tk)
        }
      }
    },
  },
  methods: {
    get_apps() {
      const mockData = []
      const apps = []
      this.$http.get('/apis/assets/app/').then(res => {
        for (let label in res.data) {
          res.data[label].forEach(app => {
            if (apps.includes(app[0]) === false) {
              apps.push(app[0])
              mockData.push({
                key: app[0].toString(),
                title: `${label}#${app[1]}`
              })
            }
          })
        }
        this.transfer.mockData = mockData
      })
    },
    filterOption(inputValue, option) {
      console.log('filterOption:', inputValue, option)
      return option.title.indexOf(inputValue) > -1;
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log('handleChange:', targetKeys, direction, moveKeys);
      this.transfer.targetKeys = targetKeys;
      this.form.data.app = this.transfer.targetKeys
    },
    handleSearch(dir, value) {
      console.log('handleSearch:', dir, value);
    },
    onSubmit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.uploading = true
          this.$http({
            url: this.api.url,
            method: this.api.method,
            data: this.form.data,
            type: 'json',
          }).then(() => {
            this.$message.success("处理完成")
            this.$emit("close")
          }).finally(() => {
            this.uploading = false
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetform() {
      this.$refs.Form.resetFields()
      this.transfer.targetKeys = []
    }
  }
}
</script>
