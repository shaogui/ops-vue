<template>
  <div>
    <a-button type="primary" icon="edit" @click="ClickCreate">添加文件夹</a-button>
    <a-modal title="添加目录管理" :visible="visible" :confirm-loading="loading"
             @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="ruleForm"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 18 }">
        <a-form-model-item label="别名" prop="name"
                           :rules="{required: true, trigger: 'blur'}">
          <a-input v-model="ruleForm.name" autocomplete="off"/>
        </a-form-model-item>
        <a-form-model-item label="存储路径" prop="path"
                           :rules="{required: true, trigger: 'blur'}">
          <a-input v-model="ruleForm.path" autocomplete="off"/>
        </a-form-model-item>
        <a-form-model-item label="上传类型" prop="category">
          <a-select v-model="ruleForm.category" style="width: 120px">
            <a-select-option value="file">
              文件
            </a-select-option>
            <a-select-option value="folder">
              文件夹
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="访问地址" prop="url"
                           :rules="{type:'url',required: true, trigger: 'blur'}">
          <a-input v-model="ruleForm.url" required autocomplete="off"/>
        </a-form-model-item>
        <a-form-model-item label="限制类型" prop="exts">
          <a-input v-model="ruleForm.exts" autocomplete="off"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      ruleForm: {
        category: "file"
      },
      rules: {}
    }
  },
  methods: {
    ClickCreate() {
      this.visible = true
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$http.post('/apis/tools/files/directory/', this.ruleForm).then(() => {
            this.$emit("submit")
          }).finally(() => {
            this.handleCancel()
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>