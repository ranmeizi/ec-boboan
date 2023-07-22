import React, { useContext } from 'react'
import context from '@/contexts/ECws/context'
import { Input, Button, Space } from 'antd'

export default function () {
    const { url, setUrl, socket, connect } = useContext(context)
    return <Space style={{ lineHeight: 'initial' }}>
        <div>WsUrl</div>
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Basic usage" />
        {
            socket === null
                ? <Button onClick={() => connect()}>链接</Button>
                : <Button>断开</Button>
        }
    </Space>
}
