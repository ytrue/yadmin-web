// 路由组件注册
const routerMap = {
    login: {
        authority: '*',
        path: '/login',
        component: () => import('@/views/login')
    },

    system: {
        path: 'system',
        icon: 'lock',
        name: '权限管理',
        component: import('@/layouts/BlankView'),
    },
        system_user: {
            path: 'user',
            icon: 'user',
            name: '管理员',
            component: () => import('@/views/system/user')
        },
        system_role: {
            path: 'role',
            icon: 'team',
            name: '角色',
            component: () => import('@/views/system/role')
        },
        system_menu: {
            path: 'menu',
            icon: 'menu',
            name: '菜单',
            component: () => import('@/views/system/menu')
        },
        system_log: {
            path: 'log',
            icon: 'solution',
            name: '操作日志',
            component: () => import('@/views/system/log')
        },

    gen: {
        name: '代码生成器',
        icon: 'form',
        component: import('@/layouts/BlankView')
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

