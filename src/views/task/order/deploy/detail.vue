<template>
  <div>
    <a-row :gutter="[0,26]">
      <a-col class="gutter-row">
        <a-steps :current="data.is_actived===1?0:5">
          <a-step status="finish" title="创建"/>

          <a-step v-if="data.verify.code === 0" title="审批" description="项目管理员"/>
          <a-step v-else title="审批" description="项目管理员" :status="data.verify.code===1?'finish':'error'"/>

          <a-step v-if="data.run.code === 0" title="部署" description="系统管理员"/>
          <a-step v-else title="部署" description="系统管理员" :status="data.run.code===1?'finish':'error'"/>

          <a-step title="工单关闭" :status="data.is_actived===1?'':'finish'"/>
        </a-steps>
      </a-col>

      <a-col class="gutter-row">
        <a-descriptions :title="`任务ID: ${data.id}`" bordered>
          <a-descriptions-item label="创建人" :span="1.5">
            {{ data.creater }}
            <a-button class="copydata" @click="ClickCopy" type="dashed"
                      data-clipboard-action="copy"
                      :data-clipboard-text="copydata">
              <a-icon type="copy"/>
              工单复制
            </a-button>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间" :span="1.5">
            {{ data.create_time }}
          </a-descriptions-item>

          <a-descriptions-item label="附件" :span="3">
            <a :href="data.annex.url" target="_blank">{{ data.annex.file }}</a>
          </a-descriptions-item>
          <a-descriptions-item label="commit号" :span="3">
            {{ data.content.commit }}
          </a-descriptions-item>
          <a-descriptions-item label="应用" :span="3">
            <a-row :gutter="[24,5]">
              <a-col v-for="(app,index) in data.app" :key="index" :span="8">
                <a-tag>{{ app.name }}</a-tag>
              </a-col>
            </a-row>
          </a-descriptions-item>
          <a-descriptions-item label="应用标签" :span="3" key="item">
            <a-tag v-for="label in uniq_label(data.app)" :key="label">{{ label }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="部署原因" :span="3" key="item">
            <div v-highlight>
              <pre><code v-html="data.content.why"></code></pre>
            </div>
          </a-descriptions-item>
          <a-descriptions-item v-for="step in data.content.steps" :label="`部署步骤${step.name}`"
                               :key="step.name"
                               :span="3">
            <div v-highlight>
              <pre><code v-html="step.text"></code></pre>
            </div>
          </a-descriptions-item>

          <template v-if="data.verify.code === 0">
            <a-descriptions-item label="审批操作" :span="3">
              <a-popconfirm title="确认执行此结果？" ok-text="Yes" cancel-text="No"
                            @confirm="form.verify_status=1;submit()">
                <a-button type="primary">允许</a-button>
              </a-popconfirm>
              |
              <a-button type="danger" @click="form.verify_status=2;visible = true">拒绝</a-button>
            </a-descriptions-item>
          </template>
          <template v-else>
            <a-descriptions-item label="审批人" :span="1.5">
              {{ data.verify.user }}
            </a-descriptions-item>
            <a-descriptions-item label="审批状态" :span="1.5">
              <a-tag :color="color[data.verify.code]">{{ data.verify.display }}</a-tag>
            </a-descriptions-item>
            <template v-if="data.verify.code === 1 && data.run.code === 0">
              <a-descriptions-item label="执行结果" :span="3">
                <a-popconfirm title="确认执行此结果？" ok-text="Yes" cancel-text="No"
                              @confirm="form.run_status=1;submit()">
                  <a-button type="primary">成功</a-button>
                </a-popconfirm>
                |
                <a-button type="danger" @click="form.run_status=2;visible = true">失败</a-button>
              </a-descriptions-item>
            </template>
            <template v-if="data.verify.code === 1 && data.run.code > 0">
              <a-descriptions-item label="操作人" :span="1.5">
                {{ data.run.user }}
              </a-descriptions-item>
              <a-descriptions-item label="执行状态" :span="1.5">
                <a-tag :color="color[data.run.code]">{{ data.run.display }}</a-tag>
              </a-descriptions-item>
            </template>
          </template>

          <a-descriptions-item v-if="data.feedback && (data.verify.code === 2 || data.run.code === 2)" label="错误反馈信息"
                               :span="3">
            <div v-highlight>
              <pre><code v-html="data.feedback"/></pre>
            </div>
          </a-descriptions-item>

        </a-descriptions>
      </a-col>


      <a-modal title="请输入拒绝/失败原因" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
               @cancel="visible=false">
        <a-form-model ref="ruleForm" :model="form">
          <a-form-model-item prop="feedback" :rules="{required: true, message: '不可为空', trigger: 'blur'}">
            <a-input type="textarea" :auto-size="{minRows:10,maxRows:20}"
                     v-model="form.feedback"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-col class="gutter-row" :class="{'hidden':hidden}">
        <h2>部署命令</h2>
        <a-tabs v-model="activeKey1" type="card">
          <a-tab-pane v-for="(value,index) in data.app" :key="index" :tab="value.name">
            <a-collapse accordion v-model="activeKey2" @change="handleChange">
              <a-collapse-panel v-for="(item,index) in value.server" :key="index"
                                :header="`主机: ${item.host} ; 路径: ${item.path}`">

                <div v-highlight v-for="bash in command[value.id]" :key="bash.id">
                  <h1>{{ bash.name }}</h1>
                  <pre><code v-html="bash.content.format({
                                 sys_app_annex:data.annex.url,
                                 sys_app_annex_name:data.annex.file,
                                 sys_app_commit:data.content.commit,
                                 sys_app_name:value.name,
                                 sys_app_name1:value.name1,
                                 sys_app_run_path:item.path})"></code></pre>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    parent: Object,
  },
  data() {
    return {
      copydata: "",
      data: {},
      form: {},
      color: {
        1: "#87d068",
        2: "#f50",
      },
      visible: false,
      confirmLoading: false,
      command: {},
      hidden: true,
      activeKey1: 0,
      activeKey2: "0",
    }
  },
  watch: {
    parent: {
      immediate: true,
      handler: function (val) {
        this.activeKey1 = 0
        this.activeKey2 = "0"
        this.data = val
        this.form = {}
      }
    },
    data: {
      immediate: true,
      handler: function (val) {
        this.hidden = val.verify.code === 1 ? val.run.code === 2 ? true : false : true
        if (!this.hidden) {
          this.Getcommand()
        }
      }
    }
  },
  methods: {
    submit() {
      this.$http.put(`/apis/tasks/order/deploy/${this.data.id}/`, {...this.form}).then(() => {
        this.from = {}
        this.visible = false
        this.$message.success("处理成功")
      }).then(() => {
        this.$http.get(`/apis/tasks/order/deploy/${this.data.id}/`).then(res => {
          this.data = res.data
        })
        this.$emit("submit")
      })
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submit()
        }
      })
    },
    handleChange() {
      this.activeKey2 = "0"
    },
    Getcommand() {
      if (this.data.verify.code === 1) {
        this.$http.get(`/apis/tasks/command/template/deploy/${this.data.id}/`).then(res => {
          this.command = res.data
        })
      } else {
        this.command = {}
      }
    },
    uniq_label(value) {
      let labels = Array()
      value.forEach(item => {
        item.label.forEach(label => {
          labels.push(label)
        })
      })
      return [...new Set(labels)]
    },
    ClickCopy() {
      let apps = Array()
      this.data.app.forEach(val => {
        apps.push(val.name)
      })

      this.copydata = '|项目|信息|\n' +
          '|---|---|\n' +
          `|创建人|${this.data.creater}|\n` +
          `|创建时间|${this.data.create_time}|\n` +
          `|附件名|${this.data.annex.file}|\n` +
          `|commit号|${this.data.content.commit}|\n` +
          `|应用|${apps.join(" , ")}|\n` +
          `|应用标签|${this.data.app[0].label.join(" , ")}|\n` +
          `|原因|${this.data.content.why}|`
      let clipboard = new this.$clipboard(".copydata");
      clipboard.on('success', () => {
        this.$message.success("复制成功")
        clipboard.destroy()
      });
      clipboard.on('error', () => {
        this.$message.warning("复制失败")
        clipboard.destroy()
      });
    }
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>