import axios from "axios";
import store from "@/store";
import router from "@/router";
import {message} from "ant-design-vue";

axios.defaults.baseURL = ''
//请求拦截器
axios.interceptors.request.use(config => {
    //判断是否存在token，如果存在将每个页面的header都添加token
    if (store.state.Authorization) {
        if (router.currentRoute.name !== 'login') {
            config.headers['Authorization'] = store.state.Authorization
        }
        // config.headers.put['Authorization'] = store.state.Authorization
    }
    return config;
}, error => {
    // 请求错误
    return Promise.reject(error);
});
//respone拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => { //默认除了2XX之外都为错误
        if (error.response) {
            console.log('拦截器错误 :', error.response)
            switch (error.response.status) {
                case 400:
                case 403:
                    for (let k in error.response.data) {
                        message.error(`${k} ${error.response.data[k]}`)
                    }
                    break
                case 401:
                    router.push({
                        name: 'login', params: {redirect: router.currentRoute.fullPath}
                    })
                    break
                default:
                    message.error("请求异常")
                    console.log()

            }
        }
        return Promise.reject(error.response);
    }
);

export default axios