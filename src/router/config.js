import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'

// 路由配置
const options = {
    routes: [
        {
            path: '/login',
            name: '登录页',
            component: () => import('@/views/login')
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/views/exception/404'),
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/views/exception/403'),
        },
        {
            path: '/',
            name: '首页',
            component: TabsView,
            redirect: '/login',
            children: [

                {
                    path: 'gen',
                    name: '代码生成器',
                    meta: {
                        icon: 'form',
                        page: {
                            cacheAble: false
                        }
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'generator',
                            name: '代码生成',
                            component: () => import('@/views/gen/generator')
                        },
                        {
                            path: 'datasource',
                            name: '数据源管理',
                            component: () => import('@/views/gen/datasource')
                        },
                        {
                            path: 'fieldType',
                            name: '字段类型映射',
                            component: () => import('@/views/gen/fieldType')
                        },
                        {
                            path: 'baseClass',
                            name: '基类管理',
                            component: () => import('@/views/gen/baseClass')
                        }
                    ]
                },
            ]
        },
    ]
}

export default options
