import React, { useContext, useEffect, useRef, useState } from 'react'
import Page from '@/components/Page'
import { Card, Typography } from 'antd'
import useFrameState from './useFrameState'
import { requestDeviceFindById } from '@/services/ec/device'
import { useParams } from 'react-router-dom'
import './style.less'
import Control from './components/Control'

export default function () {
    const [info, setInfo] = useState<DTOs.Device.OnlineDeviceInfo>()
    const { id } = useParams<{ id: string }>()
    const { state, startFrame, stopFrame } = useFrameState(id)
    const [cardRect, setCardRect] = useState<DOMRect>()

    useEffect(() => {
        // 获取device信息
        getData()
        // 获取card高度
        getCardRect()

        startFrame()
        return () => {
            console.log('关闭了')
            stopFrame()
        }
    }, [])

    /** 获取设备宽高信息 */
    function getData() {
        requestDeviceFindById({ id }).then(res => {
            setInfo(res)
        })
    }

    function getCardRect() {
        const rect = document.querySelector('.device-control-root')?.getBoundingClientRect()

        rect && setCardRect(rect)
    }

    return <Page className='device-page'>
        {/* 标题 */}
        <Typography.Title level={5}>设备控制</Typography.Title>
        {/* 内容 */}
        <Card className='inner-card'>
            <div className='device-control-root'>
                <Control cardRect={cardRect} deviceInfo={info} />
            </div>
        </Card>
    </Page>
}