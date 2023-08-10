import React, { useContext, useEffect, useRef } from 'react'
import { wsEventBus } from '@/utils/EventBus'
import { Header } from 'packet'
import { context } from '@/contexts/ECws/context'
import { throttle } from '@/utils'

type Props = {
    id: string
    cardRect?: DOMRect,
    deviceInfo?: DTOs.Device.OnlineDeviceInfo
}

export default function ({
    id,
    cardRect,
    deviceInfo
}: Props) {
    const canvas = useRef<HTMLCanvasElement>(null)
    const { sendText } = useContext(context)
    useEffect(() => {
        if (!cardRect || !deviceInfo) {
            return
        }

        // 初始化大小
        init()

        if (!canvas.current) {
            return
        }
        const el = canvas.current
        const rect = el.getBoundingClientRect()


        // 换算
        const zoom = deviceInfo.height / canvas.current.height

        function onDown(e: MouseEvent) {
            const { offsetX: x, offsetY: y } = e
            sendText('controlTouchEvent', {
                deviceId: id,
                type: 'touchDown',
                x: zoom * x,
                y: zoom * y
            })
            el.addEventListener('mousemove', onMove)
        }

        const onMove = throttle((e: MouseEvent) => {
            const { offsetX: x, offsetY: y } = e
            sendText('controlTouchEvent', {
                deviceId: id,
                type: 'touchMove',
                x: zoom * x,
                y: zoom * y
            })
        }, 30)

        // function onMove(e: MouseEvent) {
        //     const { x, y } = calcXY(rect, e.pageX, e.pageY)
        //     sendText('controlTouchEvent', {
        //         deviceId: id,
        //         type: 'touchMove',
        //         x: zoom * x,
        //         y: zoom * y
        //     })
        // }

        function onUp(e: MouseEvent) {
            el.removeEventListener('mousemove', onMove)
            const { offsetX: x, offsetY: y } = e
            sendText('controlTouchEvent', {
                deviceId: id,
                type: 'touchUp',
                x: zoom * x,
                y: zoom * y
            })
        }

        el.addEventListener('mousedown', onDown)
        el.addEventListener('mouseup', onUp)

        return () => {
            el.removeEventListener('mousedown', onDown)
            el.removeEventListener('mouseup', onUp)
            el.removeEventListener('mouseup', onUp)
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
                image.onload = function () {
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
                image.onload = function () {
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

    return <canvas
        className='device-control__canvas'
        ref={canvas}
    ></canvas>
}
