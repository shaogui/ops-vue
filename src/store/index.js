import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // token 存储
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        // 加载中状态
        iconLoading: {
            cdn: false
        }
    },
    mutations: {
        // 检测token是否变化
        changeLogin(state, user) {
            state.Authorization = user.Authorization;
            localStorage.setItem('Authorization', user.Authorization);
        },
        // 改变iconLoading
        changeiconLoading(state, payload) {
            state.iconLoading[payload.path] = payload.bool
        }
    },
    actions: {},
    modules: {},
    // 属性获取
    getters: {
        iconLoading: state => payload => {
            return state.iconLoading[payload]
        }
    }
})
