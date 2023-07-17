import React from 'react'
import { Badge } from 'antd'
import { useSelector } from 'react-redux'

type Props = {
    name: string
}

const messageSelector = (state: any) => state.app.message

// 这个组件统计 message 中的计数
export default function ({
    name,
    children
}: React.PropsWithChildren<Props>) {
    const message = useSelector(messageSelector) || {}
    return <Badge
        size='small'
        count={message[name] || 0}
        className='rvt-menu-badge'
        offset={[10, 0]}
    >{children}</Badge>
}
