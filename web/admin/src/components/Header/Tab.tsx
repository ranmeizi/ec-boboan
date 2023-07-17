import React, { useEffect, useRef } from 'react'
import { Tabs, Menu, Dropdown, notification } from 'antd';
import { useLocation, useHistory } from 'react-router-dom'
import { useRefState } from '@/utils/hooks/common';
import EventLRU from './LRU';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { useAliveController } from 'react-activation'
import * as Loading from '@/components/Loading'
import config from '@/config'
import $EB from '@/utils/EventBus'

Sortable.mount(new MultiDrag(), new Swap());

const capacity = Number(config.TAB_LIMIT)
// Least Recently Used
export const lru = new EventLRU<TabPane>(capacity)

const { TabPane } = Tabs;
let initPanes: TabPane[] = []
try {
    initPanes = JSON.parse(sessionStorage.getItem('rvt-tabpanes') as string) || []
} catch (e) {
    console.log(e)
}

/**
 * lru，使用lru来记录访问的权重，删除最不经常访问的tab和activation缓存
 * 依赖lru控制缓存，路由更新会自动更新lru，但是在删除时，一定记得清除lru的记录
 * 目前分3块，节点结构/tabconteroller/交互api
 */

/**
 * 注重节点结构
 */
export default function () {
    const location = useLocation()
    const history = useHistory()
    const { tabPanes, api } = useTabPane()

    // 对tab拖动排序
    useSortTab(api)

    function onChange(activeKey: string) {
        console.log('change?')
        history.replace(activeKey)
        // transition group 销毁组件有延迟，这里更新一下lru 以防万一
        const route = lru.get(activeKey)
        route && lru.put(activeKey, route as TabPane)
    }

    function onEdit(targetKey: any, action: "add" | "remove") {
        if (action === 'remove') {
            api.current.closeTab(targetKey)
        }
        return
    }

    function onMenuClick({ domEvent, key }: any, pane: TabPane) {
        domEvent.stopPropagation()
        switch (key) {
            case 'refresh':
                api.current.refresh(pane.id)
                Loading.open()
                setTimeout(() => {
                    Loading.close()
                }, 500);
                break;
            case 'closeTab':
                api.current.closeTab(pane.id)
                break;
            case 'closeOther':
                api.current.closeOther(pane.id)
                break;
            case 'closeRight':
                api.current.closeRight(pane.id)
                break;
            case 'closeAll':
                api.current.closeAll()
                break;
        }
    }

    return <div className='rvt-router-tab'>
        <Tabs
            hideAdd
            type="editable-card"
            className='sort-area'
            onChange={onChange}
            onEdit={onEdit}
            onContextMenu={(e) => {
                e.preventDefault()
            }}
            activeKey={location.pathname + location.search}
        >
            {tabPanes.map((pane: TabPane) => (
                <TabPane
                    key={pane.id}
                    tab={

                        <Dropdown
                            overlay={<Menu
                                onClick={args => onMenuClick(args, pane)}
                            >
                                <Menu.Item key="refresh">刷新</Menu.Item>
                                <Menu.Item key="closeTab">关闭</Menu.Item>
                                <Menu.Item key="closeOther">关闭其他</Menu.Item>
                                <Menu.Item key="closeRight">关闭到右侧</Menu.Item>
                                <Menu.Item key="closeAll">全部关闭</Menu.Item>
                            </Menu>}
                            trigger={['contextMenu']}
                        ><div className='rvt-tabpane'>{pane.title}</div></Dropdown>

                    }
                    closable={tabPanes.length > 1}
                />
            ))}
        </Tabs >
    </div >
}

/**
 * 注重TabController
 */
function useTabPane() {

    const [tabPanes, setTabPanes, tabPanesRef] = useRefState<TabPane[]>(initPanes)

    const api = useTabApi(tabPanes, setTabPanes)

    // 持久化
    useEffect(() => {
        tabPanes.forEach((pane) => {
            lru.put(pane.id, pane)
        })
        function setItem() {
            sessionStorage.setItem('rvt-tabpanes', JSON.stringify(tabPanesRef.current))
        }
        window.addEventListener('beforeunload', setItem)
        function onPushTab(tab: any) {
            api.current.addTab(tab)
        }
        function onRenoveTab(tabId: string) {
            api.current.closeTab(tabId)
        }
        $EB.on($EB.TYPES.PAGE_PUSH_TAB, onPushTab)
        $EB.on($EB.TYPES.PAGE_REMOVE_TAB, onRenoveTab)

        return () => {
            $EB.un($EB.TYPES.PAGE_PUSH_TAB, onPushTab)
            $EB.un($EB.TYPES.PAGE_REMOVE_TAB, onRenoveTab)
            window.removeEventListener('beforeunload', setItem)
        }
    }, [])

    return {
        tabPanes,
        api
    }
}

/**
 * 注重Tab交互的api
 */
function useTabApi(tabPanes: TabPane[], setTabPanes: React.Dispatch<React.SetStateAction<TabPane[]>>) {
    const history = useHistory()

    const { drop, refresh } = useAliveController()

    const api = useRef<{
        refresh: typeof refresh,
        addTab: typeof addTab,
        closeTab: typeof closeTab,
        closeAll: typeof closeAll,
        closeRight: typeof closeRight,
        closeOther: typeof closeOther,
        swapTab: typeof swapTab
    }>({
        refresh,
        addTab,
        closeTab,
        closeAll,
        closeRight,
        closeOther,
        swapTab
    })



    useEffect(() => {
        function dropRoute(id: string) {
            drop(id)
        }
        lru.addEventListener('afterDelete', dropRoute)
        return () => {
            lru.removeEventListener('afterDelete', dropRoute)
        }
    }, [])

    useEffect(() => {
        Object.assign(api.current, {
            refresh,
            addTab,
            closeTab,
            closeAll,
            closeRight,
            closeOther,
            swapTab
        })
    }, [tabPanes])

    // 添加一个tab
    function addTab(tab: TabPane) {
        const findTab = tabPanes.find((item) => item.id === tab.id);
        if (!findTab) {
            if (lru.map.size >= capacity) {
                const uselessTab = lru.leastRecentUsed
                notification.open({
                    message: '系统提示',
                    description: <div>
                        <p>为了系统流畅，请不要打开超过{capacity}个页面</p>
                        <p>系统已自动为您关闭最不常访问的页面：《{uselessTab?.title}》</p>
                    </div>
                });
                setTabPanes([...tabPanes.filter(item => item.id !== uselessTab?.id), tab])
            } else {
                setTabPanes([...tabPanes, tab])
            }

        }
        lru.put(tab.id, tab)
    }

    // 删除一个tab
    function closeTab(tabId: string) {
        if (tabPanes.length === 1 && tabId === config.HOME_PAGE) {
            return
        }

        setTabPanes(tabPanes.filter((item) => item.id !== tabId))
        // 清除lru
        lru.del(tabId)

        // 从lru中取出最近一次的页面
        const tab: TabPane | undefined = lru.recent
        tab?.id
            ? history.replace(tab?.id)
            : history.replace(config.HOME_PAGE)
    }
    // 关闭所有tab
    function closeAll() {
        // is Homepage
        if (lru.recent?.id === config.HOME_PAGE) {
            setTabPanes(tabPanes.filter(item => item.id === config.HOME_PAGE))
        } else {
            setTabPanes([])
            // 清除lru
            tabPanes.forEach((item) => lru.del(item.id))
            history.replace(config.HOME_PAGE)
        }
    }
    // 关闭右侧tab
    function closeRight(tabId: string) {
        const index = tabPanes.findIndex((item) => item.id === tabId);
        const newTabPanes: TabPane[] = []
        tabPanes.forEach((item, i) => {
            if (i > index) {
                // 清除lru
                lru.del(item.id)
            } else {
                newTabPanes.push(item)
            }
        })
        setTabPanes(newTabPanes)
    }
    // 关闭其他
    function closeOther(tabId: string) {
        const findTab = tabPanes.find((item) => item.id === tabId);
        const newTabPanes: TabPane[] = []
        tabPanes.forEach((item) => {
            if (item !== findTab) {
                // 清除缓存
                lru.del(item.id)
            } else {
                newTabPanes.push(item)
            }
        })
        setTabPanes(newTabPanes)
    }
    // 改变tab排序
    function swapTab(sIndex: number, eIndex: number) {
        const newTab = [...tabPanes]
        newTab.splice(eIndex, 0, newTab.splice(sIndex, 1)[0])
        setTabPanes(newTab)
    }
    return api
}

function useSortTab(api: any) {
    useEffect(() => {
        const el = document.querySelector('.sort-area .ant-tabs-nav-list')
        if (!el) {
            return
        }
        new Sortable(el as HTMLElement, {
            draggable: ".ant-tabs-tab",
            animation: 200,
            onEnd: function ({ newIndex, oldIndex }) {
                api.current.swapTab(oldIndex, newIndex)
            },
        })
    }, [])
}
