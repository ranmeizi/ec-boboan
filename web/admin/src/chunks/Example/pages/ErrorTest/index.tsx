import React, { useEffect, useState, useMemo } from 'react'
import Page from '@/components/Page'
import { Card, Typography, Button } from 'antd'

export default function () {
    const [a, setA] = useState(1)
    useEffect(() => {
        if (a > 5) {
            throw new Error('？？')
        }
    }, [a])

    const tips = useMemo(() => {
        if (a === 1) {
            return ''
        } else if (a === 5) {
            return '真的我快不行了。。。。'
        } else if (a > 1) {
            return '我求求你别点了！！'
        }
    }, [a])

    return <Page>
        {/* 标题 */}
        <Typography.Title level={5}>尝试让a&gt;5</Typography.Title>
        {/* 内容 */}
        <Card>
            <div>a:{a}  <span>{tips}</span></div>
            <Button onClick={() => {
                setA(a + 1)
            }}>a++</Button>
        </Card>
    </Page>
}