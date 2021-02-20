import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import clipboard from 'clipboard'

// 自定义修改过的
import http from '@/utils/http'
import highlight from '@/utils/highlight'

// 视图插件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// 图表插件
// https://v-charts.js.org/#/en/README
// import VCharts from 'v-charts'
// Vue.use(VCharts)
// https://apexcharts.com/vue-chart-demos/
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)


// 流程图插件
// import VueMermaid from 'vue-mermaid'
// Vue.use(VueMermaid)


Vue.use(Antd);
Vue.prototype.$clipboard = clipboard;
Vue.prototype.$http = http;
Vue.config.productionTip = false
new Vue({
    router,
    store,
    http,
    highlight,
    render: h => h(App)
}).$mount('#app')


String.prototype.format = function (args) {
    var result = this;
    var reg = ""
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    reg = new RegExp("(\\${" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    // reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}