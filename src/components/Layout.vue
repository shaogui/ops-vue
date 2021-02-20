<template>
  <a-layout id="components-layout-demo-custom-trigger" class="layout">

    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo"/>
      <a-menu theme="dark" mode="inline" :open-keys="openKeys" @openChange="onOpenChange"
              :defaultSelectedKeys="defaultSelectedKeys">
        <template v-for="(item) in routes">
          <a-sub-menu v-if="item.children" :key="item.name">
            <span slot="title">
              <a-icon v-if="item.meta.icon" :type="item.meta.icon"/>
              <a-icon v-else type="container"/>
              <span>{{ item.meta.title }}</span>
            </span>
            <a-menu-item v-for="item2 in item.children" :key="item2.name">
              <a-icon v-if="item2.meta.icon" :type="item2.meta.icon"/>
              <span v-if="item2.meta">{{ item2.meta.title }}</span>
              <span v-else>{{ item2.name }}</span>
              <router-link :to='{name:item2.name}'></router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.name">
            <a-icon v-if="item.meta.icon" :type="item.meta.icon"/>
            <span v-if="item.meta">{{ item.meta.title }}</span>
            <span v-else>{{ item.name }}</span>
            <router-link :to='{name:item.name}'></router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-row>
          <a-col :span="1">
            <a-icon class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="() => (collapsed = !collapsed)"/>
          </a-col>
          <a-col :span="2" :offset="21">
            <UserNav/>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import {routes} from "@/router"
import UserNav from './user-nav'

export default {
  data() {
    return {
      rootSubmenuKeys: [],
      openKeys: [this.$router.currentRoute.matched[1].name],
      defaultSelectedKeys: [this.$router.currentRoute.name],
      collapsed: false,
      routes: routes[0].children,
    };
  },
  components: {UserNav},
  mounted() {
    this.routes.findIndex(item => {
      this.rootSubmenuKeys.push(item.name)
    })
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
