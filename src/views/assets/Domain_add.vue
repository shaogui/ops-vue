<template>
  <div>
    <a-form-model ref="Form"
                  :model="data"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 18 }">
      <a-form-model-item label="域名" prop="DomainName"
                         :rules="{ required: true, message: '必须填写', trigger: 'blur' }">
        <a-input v-model="data.DomainName"/>
      </a-form-model-item>

      <a-form-model-item label="创建时间" prop="CreationDate"
                         :rules="{ required: true, message: '必须填写', trigger: 'blur' }">
        <a-date-picker v-model="data.CreationDate"
                       style="width: 50%"/>
      </a-form-model-item>
      <a-form-model-item label="到期时间" prop="ExpirationDate"
                         :rules="{ required: true, message: '必须填写', trigger: 'blur' }">
        <a-date-picker v-model="data.ExpirationDate"
                       style="width: 50%"/>
      </a-form-model-item>

      <a-form-model-item label="企业" prop="owner">
        <a-input v-model="data.owner"/>
      </a-form-model-item>

      <a-form-model-item label="Icp号" prop="icp">
        <a-input v-model="data.icp"/>
      </a-form-model-item>

      <a-form-model-item label="备注" prop="desc">
        <a-input v-model="data.desc" type="textarea" :auto-size="{ minRows: 10 }"/>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
        <a-button type="primary" @click="onSubmit" :loading="uploading">
          提交
        </a-button>
        <a-button style="margin-left: 10px"
                  @click="resetform"> 重置
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  props: {
    todata: Object
  },
  data() {
    return {
      data: {},
      uploading: false,
    };
  },
  watch: {
    todata: {
      immediate: true,
      handler: function (val) {
        console.log("todata", val)
        if (val) {
          this.data = val
        }

      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.uploading = true;
          if (this.todata.id) {
            this.$http
                .put(`/apis/assets/domain/list/${this.todata.id}/`, {...this.data})
                .then(() => {
                  this.$message.success("已修改");
                  this.$emit("submit");
                })
                .finally(() => {
                  this.uploading = false;
                });
          } else {
            this.$http
                .post("/apis/assets/domain/list/", {...this.data})
                .then(() => {
                  this.$message.success("已添加");
                  this.$emit("submit");
                })
                .finally(() => {
                  this.uploading = false;
                });
          }

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetform() {
      this.$refs.Form.resetFields();
    },
  },
};
</script>

<style scoped></style>
