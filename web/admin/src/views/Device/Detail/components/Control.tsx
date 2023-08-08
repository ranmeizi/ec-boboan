import React, { useEffect, useRef } from 'react'
import { wsEventBus } from '@/utils/EventBus'
import { Header } from 'packet'

type Props = {
    cardRect?: DOMRect,
    deviceInfo?: DTOs.Device.OnlineDeviceInfo
}

export default function ({
    cardRect,
    deviceInfo
}: Props) {
    const canvas = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (cardRect && deviceInfo) {
            // 初始化大小
            init()
        }
    }, [cardRect, deviceInfo])

    useEffect(() => {
        function handleBinaryMessage({
            source,
            data
        }: Header & { data: ArrayBuffer }) {
            if (source === deviceInfo?.id) {
                // 绘图
                const base64 = new TextDecoder().decode(data);
                const image = new Image()
                image.src = 'data:image/jpeg;base64,' + base64
                // 绘图
                const ctx = canvas.current?.getContext('2d')
                image.onload=function(){
                    ctx?.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.current!.width, canvas.current!.height)
                }
            }
        }

        function handleJsonBase64Frame({ event, data }: any) {
            if (event === 'jsonBase64Frame') {
                const image = new Image()
                image.src = 'data:image/jpeg;base64,' + data.frame
                // 绘图
                const ctx = canvas.current?.getContext('2d')
                image.onload=function(){
                    ctx?.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.current!.width, canvas.current!.height)
                }
            }
        }
        wsEventBus.on(wsEventBus.TYPES.WS_BINARY_MSG, handleBinaryMessage)
        wsEventBus.on(wsEventBus.TYPES.WS_TEXT_MSG, handleJsonBase64Frame)
        return () => {
            wsEventBus.un(wsEventBus.TYPES.WS_BINARY_MSG, handleBinaryMessage)
            wsEventBus.un(wsEventBus.TYPES.WS_TEXT_MSG, handleJsonBase64Frame)
        }
    }, [deviceInfo])

    function init() {
        if (!canvas.current) {
            return
        }
        // 按高度缩放
        canvas.current.height = cardRect!.height
        canvas.current.width = cardRect!.height / deviceInfo!.height * deviceInfo!.width
    }

    return <canvas className='device-control__canvas' ref={canvas}></canvas>
}
