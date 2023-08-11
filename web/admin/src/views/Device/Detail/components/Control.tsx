import React, { useContext, useEffect, useRef } from 'react'
import { wsEventBus } from '@/utils/EventBus'
import { Header } from 'packet'
import { context } from '@/contexts/ECws/context'
import { throttle } from '@/utils'
import { HomeOutlined, LeftOutlined, MenuOutlined } from '@ant-design/icons'
type Props = {
    id: string
    deviceInfo?: DTOs.Device.OnlineDeviceInfo
}

export default function ({
    id,
    deviceInfo
}: Props) {
    const canvas = useRef<HTMLCanvasElement>(null)
    const { sendText } = useContext(context)

    useEffect(() => {
        if (!deviceInfo) {
            return
        }

        if (!canvas.current) {
            return
        }
        const el = canvas.current
        const rect = el.getBoundingClientRect()

        console.log(rect)

        // 初始化大小
        // 按高度缩放
        const h = rect.height
        const w = rect.height / deviceInfo!.height * deviceInfo!.width
        el.style.height = h + 'px'
        el.style.width = w + 'px'
        el.height = h
        el.width = w

        // 换算
        const zoom = deviceInfo.height / el.height

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
        }, 150)

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
                    ctx?.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h)
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
                    ctx?.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h)
                }
            }
        }
        wsEventBus.on(wsEventBus.TYPES.WS_BINARY_MSG, handleBinaryMessage)
        wsEventBus.on(wsEventBus.TYPES.WS_TEXT_MSG, handleJsonBase64Frame)

        el.addEventListener('mousedown', onDown)
        el.addEventListener('mouseup', onUp)
        el.addEventListener('mouseout',onUp)

        return () => {
            el.removeEventListener('mousedown', onDown)
            el.removeEventListener('mouseup', onUp)
            el.removeEventListener('mouseout',onUp)
            wsEventBus.un(wsEventBus.TYPES.WS_BINARY_MSG, handleBinaryMessage)
            wsEventBus.un(wsEventBus.TYPES.WS_TEXT_MSG, handleJsonBase64Frame)
        }
    }, [deviceInfo])

    function emitSysEvent(type:'systemHome'|'systemBack'|'systemRecent'){
        sendText('controlActionEvent',{
            type:type,
            deviceId: id,
        })
    }

    return <div className='device-control__root f-c full-height'>
        <canvas
            className='device-control__canvas'
            ref={canvas}
        ></canvas>
        {/* 虚拟home */}
        <div className='device-control__virtual f-r j-around a-center'>
            <div className='divice-control__icon-button f-r j-around a-center' onClick={()=>emitSysEvent('systemHome')}>
                <LeftOutlined />
            </div>
            <div className='divice-control__icon-button f-r j-around a-center' onClick={()=>emitSysEvent('systemBack')}>
                <HomeOutlined />
            </div>
            <div className='divice-control__icon-button f-r j-around a-center' onClick={()=>emitSysEvent('systemRecent')}>
                <MenuOutlined />
            </div>
        </div>
    </div>
}