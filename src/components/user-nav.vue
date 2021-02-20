<template>
  <div>
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        {{ data.name }}
        <a-icon type="down"/>
      </a>
      <a-menu slot="overlay">
        <a-menu-item>
          <a href="javascript:;" @click="visible=true">个人资料</a>
        </a-menu-item>
        <a-menu-item>
          <a :href="`${this.$http.defaults.baseURL}/admin`" target="_blank">管理后台</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;" @click="logout">退出登录</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>

    <a-drawer title="个人信息" width="30%"
              :visible="visible"
              @close="visible=false">
      <UserProfile :form="data"/>
    </a-drawer>
  </div>
</template>

<script>
import UserProfile from './user-profile'

export default {
  name: "user-nav",
  data() {
    return {
      data: {},
      visible: false
    }
  },
  components: {
    UserProfile
  },
  mounted() {
    this.getuserinfo()
  },
  methods: {
    getuserinfo() {
      this.$http({
        url: '/apis/user/info/',
        method: "get",
        type: "json"
      }).then(res => {
        console.log(res.data)
        this.data = res.data
        this.data["name"] = res.data.first_name + res.data.last_name
      })
    },
    logout() {
      this.$http({
        url: '/apis/user/logout/',
        method: "get",
        type: "json"
      }).then(res => {
        console.log(res.data)
      })
    },
    userprofile() {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>