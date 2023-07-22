import React, { useEffect, useRef, useState } from 'react'
import { createContext } from "react";
import { wsEventBus } from '@/utils/EventBus/index'
import * as HeartBeat from './heartbeat'

const initState: WsContext = {
    socket: null,
    url: '',
    setUrl: () => undefined,
    connect: () => undefined
}

type WsContext = {
    socket: WebSocket | null,
    url: string,
    setUrl: (url: string) => void
    connect: () => void
}

const context = createContext(initState)

const Provider = context.Provider

function WsProvider(props: React.PropsWithChildren) {
    /** 是否与服务器链接 */
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [url, setUrl] = useState('ws://localhost:8080')

    /** ws 链接 */
    function connect() {
        if (socket) {
            return false
        }

        /** TODO 控制端需要特殊的校验 */
        const ws = new WebSocket(url, ['control'])

        ws.addEventListener('open', function () {
            wsEventBus.emit(wsEventBus.TYPES.WS_OPEN, undefined)
        })

        ws.addEventListener('close', function () {
            wsEventBus.emit(wsEventBus.TYPES.WS_CLOSE, undefined)
            setSocket(null)
            HeartBeat.stop()
        })

        ws.addEventListener('message', function (event) {
            if (typeof event.data === 'string') {
                wsEventBus.emit(wsEventBus.TYPES.WS_TEXT_MSG, JSON.parse(event.data))
            } else {
                wsEventBus.emit(wsEventBus.TYPES.WS_BINARY_MSG, JSON.parse(event.data))
            }
        })

        setSocket(ws)

        HeartBeat.start(ws, connect)
    }

    return <Provider value={{
        socket,
        url,
        setUrl,
        connect
    }}>
        {props.children}
    </Provider>
}

export default context
export {
    context,
    WsProvider as Provider
}