import React, { useEffect, useMemo, useState } from 'react'
import { Menu } from 'antd'
import { menuTree, nameMap } from './menuTree'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as icons from '@ant-design/icons'
import $EB from '@/utils/EventBus'
import MenuTitleBadge from './MenuTitleBadge'

const appSelector = (state: any) => state.app

function sortMenu(menuList: MenuItem[]) {
    menuList.sort((a, b) => a.sort - b.sort)
    menuList.forEach(item => {
        sortMenu(item.children)
    })
}

/**
 * 菜单
 * 有2种方式改变active
 * 1. 点击
 * 2. 路由变化
 */
export default function () {

    const history = useHistory()

    const appState = useSelector(appSelector)

    const sMenu = useMemo(() => {
        sortMenu(menuTree)
        return menuTree
    }, [])

    const renderMenu = (menus: MenuItem[]) => {
        return menus.map(item => {
            if (item.permission && !appState.permission.includes(item.permission)) {
                return null
            }
            return item.children.length > 0
                ? <Menu.SubMenu
                    key={item.id}
                    title={item.title}
                    icon={item.icon
                        ? React.createElement((icons[item.icon as keyof typeof icons] as React.ComponentType))
                        : null}>
                    {renderMenu(item.children)}
                </Menu.SubMenu>
                : <Menu.Item
                    onClick={() => history.replace(item.url as string)}
                    key={item.id}
                    icon={item.icon
                        ? React.createElement((icons[item.icon as keyof typeof icons] as React.ComponentType))
                        : null}
                >
                    <MenuTitleBadge name={item.id}>
                        {item.title}
                    </MenuTitleBadge>
                </Menu.Item>
        }
        )
    }

    const menu = useMemo(() => {
        return renderMenu(sMenu)
    }, [appState.permission, sMenu])

    return <Menu
        {...useMenuController()}
        mode="inline"
        theme={appState.theme}
    >
        {menu}
    </Menu>
}

// 封装 Menu props
function useMenuController() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [openKeys, setOpenKeys] = useState<string[]>([])

    useEffect(() => {
        // 监听路由改变修改menu key
        function onPageIn({ name }: any) {
            if (!name) {
                // []数组路由，会搜索不到route，那么视为放弃 name 搜索
                return
            }
            setSelectedKeys([name])

            try {
                setOpenKeys(findParentKeys(name) as string[])
            } catch (e) {
                console.log(e)
            }
        }
        $EB.on($EB.TYPES.PAGE_PUSH_TAB, onPageIn)
        return () => {
            $EB.un($EB.TYPES.PAGE_PUSH_TAB, onPageIn)
        }
    }, [])

    function onSelect({ selectedKeys }: any) {
        setSelectedKeys(selectedKeys)
    }

    function onOpenChange(newOpenKeys: string[]) {
        if (newOpenKeys.length > 0) {
            // 寻找出现1次的key
            const key = findOnce(newOpenKeys.concat(openKeys))
            console.log(key, '^')
            setOpenKeys([key])
        } else {
            setOpenKeys([])
        }
    }

    return {
        selectedKeys,
        openKeys,
        onOpenChange,
        onSelect
    }
}

// 寻找 pid 数组
function findParentKeys(id: string) {
    const parentKeys = []
    for (; ;) {
        const key = findPid(id)
        if (!key) {
            throw '这不是一个menu'
        }
        if (key === 'root') {
            return parentKeys
        }
        parentKeys.push(key)
        id = key
    }
}

function findPid(id: string) {
    const menu = nameMap.get(id)
    if (!menu) {
        return
    }

    return menu.parent
}

// 寻找出现1次的字符串
function findOnce(arr: string[]) {
    const obj = arr.reduce((memo, curr) => {
        if (memo[curr]) {
            delete memo[curr]
        } else {
            memo[curr] = 1
        }
        return memo
    }, {} as Record<string, any>)

    return Object.keys(obj)[0]
}