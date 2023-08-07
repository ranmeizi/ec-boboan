import React, { PropsWithChildren, useContext } from 'react'
import { context } from './context'
import { Modal } from 'antd'

type Props = {

}

export default function ({
    children
}: PropsWithChildren<Props>) {
    const { socket } = useContext(context)
    return <div onClick={(e) => {
        if (!socket) {
            // 弹窗提示
            Modal.warn({
                content: '请先链接websocket'
            })
        }
    }}>
        <div style={{ pointerEvents: socket ? 'initial' : 'none' }}>
            {children}
        </div>
    </div>
}
