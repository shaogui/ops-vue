<template>
  <div>
    <a-form-model :model="form" :label-col="{span: 1}" :wrapper-col="{span: 3}">
      <a-form-model-item label="马甲包" prop="PkgMjb">
        <a-select v-model="form.PkgMjb">
          <a-select-option v-for="(pkg,index) in PkgMjb" :key="index">
            {{ pkg.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>

    <div>
      <h1>业务相关数据</h1>
      <yewu1 :data="pkg"/>
      <br/>
      <a-card>
        <yewu2 :data="pkg"/>
      </a-card>
    </div>

    <div>
      <h1>任务相关数据</h1>
      <renwu1 :data="pkg"/>
      <br/>
      <a-card>
        <renwu2 :data="pkg"/>
      </a-card>
      <br/>
      <a-card>
        <renwu3 :data="pkg"/>
      </a-card>
      <br/>
      <a-card>
        <renwu4 :data="pkg"/>
      </a-card>
    </div>

    <div>
      <h1>用户相关数据</h1>
      <yonghu1 :data="pkg"/>
    </div>

  </div>
</template>

<script>
import yewu1 from "@/views/dashboard/yewu1";
import Yewu2 from "@/views/dashboard/yewu2";
import Renwu1 from "@/views/dashboard/renwu1";
import Renwu2 from "@/views/dashboard/renwu2";
import Renwu3 from "@/views/dashboard/renwu3";
import Renwu4 from "@/views/dashboard/renwu4";
import Yonghu1 from "@/views/dashboard/yonghu1";

export default {
  data() {
    return {
      form: {
        PkgMjb: "",
      },
    }
  },
  computed: {
    pkg: {
      get() {
        try {
          return this.PkgMjb[this.form.PkgMjb]
        } catch {
          return {}
        }
      }
    }
  },
  watch: {},
  components: {
    Yonghu1,
    Renwu4,
    Renwu3,
    Renwu2,
    Renwu1,
    yewu1,
    Yewu2,
  },
  mounted() {
    this.get_PkgMjb()
  },
  methods: {
    get_PkgMjb() {
      this.$http.get(`/apis/dashboard/PkgMjb/`).then(res => {
        this.PkgMjb = res.data
        this.form.PkgMjb = 0
      })
    },
  },
}
</script>

<style scoped>

</style>