import React from 'react'
import { lazy } from 'react'
import MainView from '../layouts/MainView'
import { MyRoute } from '@/routes/renderRoutes'
import System from '@/chunks/System'
import Example from '@/chunks/Example'
import { Redirect } from 'react-router-dom'
import { eachRoute } from '@/components/Menu/menuTree'
import EPage403 from '@/views/ErrorPage/403'
import EPage500 from '@/views/ErrorPage/500'
import Login from '@/views/Login'
import Homepage from '@/views/Homepage'
import DeviceList from '@/views/Device/List'

const SystemModule = new System()
const ExampleModule = new Example()

// 嵌套路由都脑残。。

const routes: MyRoute[] = [
    {
        path: '/',
        exact: true,
        render: () => <Redirect to='/f/sys/user' />
    },
    {
        path: ['/login', '/login/:id'],
        exact: true,
        component: Login
    },
    {
        path: '/f',
        component: MainView,
        routes: [
            {
                path: '/f/403',
                isTransition: true,
                component: EPage403
            },
            {
                path: '/f/500',
                isTransition: true,
                component: EPage500
            },
            {
                name: 'HOMEPAGE',
                parent: 'root',
                path: '/f/homepage',
                isTransition: true,
                meta: {
                    icon: 'Html5Outlined',
                    title: '工作台',
                    sort: 1,
                    permission: '10001'
                },
                component: Homepage
            },
            {
                name: 'SYSTEM',
                parent: 'root',
                meta: {
                    icon: 'SettingOutlined',
                    title: '系统管理',
                    sort: 5,
                    // permission: '50000'
                },
            },
            {
                name: 'USER',
                parent: 'SYSTEM',
                path: '/f/sys/user',
                isCache: true,
                isTransition: true,
                meta: {
                    icon: 'UserOutlined',
                    title: '用户管理',
                    sort: 1,
                    // permission: '50001'
                },
                component: lazy(() => SystemModule.get('UserList'))
            },
            {
                name: 'ROLE',
                parent: 'SYSTEM',
                path: '/f/sys/role',
                isCache: true,
                isTransition: true,
                meta: {
                    icon: 'ApartmentOutlined',
                    title: '权限管理',
                    sort: 9,
                    // permission: '50002'
                },
                component: lazy(() => SystemModule.get('RoleList'))
            },
            {
                name: 'LOG',
                parent: 'SYSTEM',
                path: '/f/sys/log',
                isCache: true,
                isTransition: true,
                meta: {
                    icon: 'CloudServerOutlined',
                    title: '日志管理',
                    sort: 3,
                    // permission: '50003'
                },
                component: lazy(() => SystemModule.get('LogList'))
            },
            {
                name: 'EXAMPLE',
                parent: 'root',
                meta: {
                    icon: 'AntDesignOutlined',
                    title: '示例页面',
                    sort: 2,
                    permission: 'example-1'
                }
            },
            {
                name: 'EXAMPLE_LIST',
                parent: 'EXAMPLE',
                path: '/f/example/list',
                isCache: true,
                isTransition: true,
                meta: {
                    icon: 'InsertRowAboveOutlined',
                    title: '列表页',
                    sort: 1,
                    permission: 'example-2'
                },
                component: lazy(() => ExampleModule.get('List'))
            },
            {
                name: 'EXAMPLE_ERROR',
                parent: 'EXAMPLE',
                path: '/f/example/err',
                isCache: true,
                isTransition: true,
                meta: {
                    icon: 'BugOutlined',
                    title: '报错页面',
                    sort: 1
                },
                component: lazy(() => ExampleModule.get('ErrorTest'))
            },
            {
                name: 'DEVICE_LIST',
                parent: 'root',
                path: '/f/device/list',
                isCache: true,
                isTransition: true,
                meta: {
                    icon: 'ClusterOutlined',
                    title: '在线设备',
                    sort: 1
                },
                component: DeviceList
            },
        ],
    }
]

routes.forEach(route => eachRoute(route, 1))

export default routes
