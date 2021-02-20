<template>
  <div>
    <a-row type="flex" justify="center" align="middle" class="box">
      <a-col :span="4">
        <Login/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Login from '@/components/login'

export default {
  data() {
    return {};
  },
  components: {Login},
};
</script>

<style scoped>
.box {
  height: 100vh;
  background-image: url(~@/assets/c8e2a7aa21a7eb6d13adf8083f50aef3.jpg);
  background-attachment: fixed;
  background-size: cover;
}

</style>