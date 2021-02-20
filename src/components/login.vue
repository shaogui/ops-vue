<template>
  <a-form-model :model="form" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item>
      <a-input v-model="form.username" placeholder="Username">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-input v-model="form.password" type="password" placeholder="Password">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-button
          type="primary"
          html-type="submit"
          :disabled="form.username === '' || form.password === ''">
        Log in
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      const message = this.$message
      console.log('Received values of form: ', this.form);
      this.$http({
        url: '/apis/user/login/',
        method: 'post',
        type: 'json',
        data: this.form,
      }).then(res => {
        this.$store.commit("changeLogin", {Authorization: "Token " + res.data.token})
        this.$router.push(
            this.$route.params.redirect ? this.$route.params.redirect : '/'
        );
      }).catch(() => {
        message.error("请核对账号密码是否正确")
      })
    },
  },
};
</script>
