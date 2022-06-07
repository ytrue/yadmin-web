// 视图组件
const view = {
    tabs: () => import('@/layouts/tabs'),
    blank: () => import('@/layouts/BlankView')
}

// 路由组件注册
const routerMap = {
    login: {
        authority: '*',
        path: '/login',
        component: () => import('@/views/login')
    },
    root: {
        path: '/',
        name: '首页',
        redirect: '/login',
        component: view.tabs
    },

    gen: {
        name: '代码生成器',
        icon: 'form',
        component: view.blank
    },
    gen_generator: {
        path: 'generator',
        name: '代码生成',
        component: () => import('@/views/gen/generator')
    },
    gen_datasource: {
        path: 'datasource',
        name: '数据源管理',
        component: () => import('@/views/gen/datasource')
    },
    gen_fieldType: {
        path: 'fieldType',
        name: '字段类型映射',
        component: () => import('@/views/gen/fieldType')
    },
    gen_baseClass: {
        path: 'baseClass',
        name: '基类管理',
        component: () => import('@/views/gen/baseClass')
    },

}
export default routerMap

