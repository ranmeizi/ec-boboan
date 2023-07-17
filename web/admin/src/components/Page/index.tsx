import React, { useEffect, useMemo, useRef } from 'react'
import { useRouteMatch, match } from 'react-router-dom'
import { useActivate } from 'react-activation'
import { BackTop } from 'antd';
import { urlMap } from '../Menu/menuTree';
import { MyRoute } from '@/routes/renderRoutes';
import $EB from '@/utils/EventBus'

type PageProps = {
    className?: string,
    withoutTab?: boolean
}

export default function Page({
    children,
    className,
    withoutTab = false
}: React.PropsWithChildren<PageProps>) {

    const el = useRef<HTMLDivElement>(null)
    const cls = useMemo(() => `rvt-page ${className || ''}`, [className])

    !withoutTab && useRouterPagePushTab()

    useEffect(() => {
        // 滚动超出50显示boxshadow
        function onScroll() {
            if (el.current && el.current.scrollTop > 50) {
                (el.current?.parentNode?.querySelector('.page-shadow') as HTMLElement).style.opacity = '1'
            } else {
                (el.current?.parentNode?.querySelector('.page-shadow') as HTMLElement).style.opacity = '0'
            }
        }
        el.current?.addEventListener('scroll', onScroll)
        return () => el.current?.removeEventListener('scroll', onScroll)
    }, [])



    return <div className={cls}>
        <div className='page-shadow' />
        <BackTop target={() => el.current || window} />
        <div className='rvt-page-scroll' ref={el}>
            <div className='rvt-page-layout'>
                {children}
            </div>
        </div>
    </div>
}


// 路由页向Tab组件传递事件
export function useRouterPagePushTab() {
    const match = useRouteMatch()

    useEffect(() => {
        onPageIn(match)
    }, [])

    useActivate(() => {
        onPageIn(match)
    })
}

Page.useTabController = useTabController

function useTabController() {
    const match = useRouteMatch()
    return {
        closeCurrentPage: () => $EB.emit($EB.TYPES.PAGE_REMOVE_TAB, match?.url)
    }
}

function onPageIn(match: match) {

    // 查找
    const route: MyRoute = urlMap.get(match?.path)
    // 消息
    $EB.emit($EB.TYPES.PAGE_PUSH_TAB, {
        id: match.url,
        name: route?.name,
        title: history.state?.state?.title || route?.meta?.title || '未命名',
        icon: route?.meta?.icon || '',
    })
}
