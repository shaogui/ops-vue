import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const routes = [
    {
        path: '/',
        name: '/',
        redirect: {name: 'serverlist'},
        component: () => import('@/components/Layout'),
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                meta: {
                    title: "数据大盘",
                    icon: "dashboard"
                },
                component: () => import('@/views/dashboard/index'),
            },
            {
                path: 'assets',
                name: 'assets',
                meta: {
                    title: "资产信息",
                },
                component: () => import('@/components/route-view'),
                children: [
                    {
                        path: 'serverlist',
                        name: 'serverlist',
                        meta: {
                            title: "服务器列表",
                        },
                        component: () => import('@/views/assets/serverlist')
                    },
                    {
                        path: 'appslist',
                        name: 'appslist',
                        meta: {
                            title: "应用列表",
                        },
                        component: () => import('@/views/assets/applist')
                    },
                    {
                        path: 'Domain-ICP',
                        name: 'Domain-ICP',
                        meta: {
                            title: "域名管理",
                        },
                        component: () => import('@/views/assets/Domain')
                    },

                ]
            },
            {
                path: 'tools',
                name: 'tools',
                meta: {
                    title: "小工具",
                    icon: "tool"
                },
                component: () => import('@/components/route-view'),
                children: [
                    {
                        path: 'cdn',
                        name: 'cdn',
                        meta: {
                            title: "CDN刷新",
                            icon: "cloud-sync"
                        },
                        component: () => import('@/views/tools/cdn')
                    },
                    {
                        path: 'directory',
                        name: 'directory',
                        meta: {
                            title: "文件上传/url生成",
                            icon: "cloud-upload"
                        },
                        component: () => import('@/views/tools/directory')
                    },
                ]
            },
            {
                path: 'task',
                name: 'task',
                meta: {
                    title: "任务中心",
                    icon: "deployment-unit"
                },
                component: () => import('@/components/route-view'),
                children: [
                    {
                        path: 'app_deploy',
                        name: 'app_deploy',
                        meta: {
                            title: "应用部署",
                            icon: ""
                        },
                        component: () => import('@/views/task/app_deploy')
                    },
                    {
                        path: 'template',
                        name: 'template',
                        meta: {
                            title: "命令管理",
                            icon: ""
                        },
                        component: () => import('@/views/task/template')
                    },

                ]
            },
            {
                path: 'editor',
                name: 'editor',
                meta: {
                    title: "编辑器",
                    icon: "highlight"
                },
                component: () => import('@/components/route-view'),
                children: [
                    {
                        path: 'word',
                        name: 'word',
                        meta: {
                            title: "内容编辑器",
                            icon: ""
                        },
                        component: () => import('@/views/editor/word')
                    },
                    {
                        path: 'flow',
                        name: 'flow',
                        meta: {
                            title: "流程编辑器",
                            icon: ""
                        },
                        component: () => import('@/views/editor/flow')
                    },
                    {
                        path: 'mind',
                        name: 'mind',
                        meta: {
                            title: "脑图编辑器",
                            icon: ""
                        },
                        component: () => import('@/views/editor/mind')
                    },
                    {
                        path: 'graphs',
                        name: 'graphs',
                        meta: {
                            title: "拓扑图编辑器",
                            icon: ""
                        },
                        component: () => import('@/views/editor/graphs')
                    },
                ]
            },
        ]
    },
    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/login')
    },
    {
        path: '/wechat',
        name: 'wechat',
        meta: {
            title: "微信小程序流量主",
            icon: "wechat"
        },
        component: () => import('@/views/tools/wechat')
    },
]


const router = new VueRouter({
    routes
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('Authorization');
    console.log('token', token, to.path, from.path)
    if (token === 'null' || token === '' || token === null) {
        if (to.name === 'login' || to.name === 'wechat') {
            next()
        } else {
            next({replace: true, name: 'login', params: {redirect: to.path}})
        }
    } else {
        next();
    }
});
export default router
