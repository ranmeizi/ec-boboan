import React, { useEffect, useRef, useState } from 'react'
import { createContext } from "react";
import { wsEventBus } from '@/utils/EventBus/index'
import * as HeartBeat from './heartbeat'
import { unpackData } from 'packet';

const initState: WsContext = {
    socket: null,
    url: '',
    setUrl: () => undefined,
    connect: () => undefined,
    disconnect: () => undefined,
    sendText: () => undefined
}

type WsContext = {
    socket: WebSocket | null,
    url: string,
    setUrl: (url: string) => void
    connect: () => void
    disconnect: () => void
    sendText: (event: string, data: any) => void
}

const context = createContext(initState)

const Provider = context.Provider

function WsProvider(props: React.PropsWithChildren) {
    /** 是否与服务器链接 */
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [url, setUrl] = useState('ws://192.168.2.1:8080')
    // const [url, setUrl] = useState('ws://192.168.1.6:8080')


    /** ws 链接 */
    function connect() {
        if (socket) {
            return false
        }

        /** TODO 控制端需要特殊的校验 */
        const ws = new WebSocket(url, ['control'])
        ws.binaryType = 'arraybuffer'

        ws.addEventListener('open', function () {
            wsEventBus.emit(wsEventBus.TYPES.WS_OPEN, undefined)
            HeartBeat.start(ws, connect)
        })

        ws.addEventListener('close', function () {
            wsEventBus.emit(wsEventBus.TYPES.WS_CLOSE, undefined)
            setSocket(null)
            HeartBeat.stop()
        })

        ws.addEventListener('message', async function (event) {
            if (typeof event.data === 'string') {
                wsEventBus.emit(wsEventBus.TYPES.WS_TEXT_MSG, JSON.parse(event.data))
            } else {
                // 解包
                try {
                    const { header, data } = unpackData(event.data)

                    wsEventBus.emit(wsEventBus.TYPES.WS_BINARY_MSG, {
                        ...header,
                        data
                    })
                } catch (e) {
                    // 丢弃
                    console.log(e)
                }

            }
        })

        setSocket(ws)
    }

    function disconnect() {
        console.log('断开？', socket)
        socket?.close()
    }

    function sendText(event: string, data: any) {
        socket?.send(JSON.stringify({
            event: event,
            data: data
        }))
    }

    return <Provider value={{
        socket,
        url,
        setUrl,
        connect,
        disconnect,
        sendText
    }}>
        {props.children}
    </Provider>
}

export default context
export {
    context,
    WsProvider as Provider
}