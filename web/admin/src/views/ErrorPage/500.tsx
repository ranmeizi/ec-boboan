import React from 'react'
import { Result, Button } from 'antd';
import Page from '@/components/Page';
import { lru } from '@/components/Header/Tab';

export default function (props: any) {
    function onClick() {
        props.history.replace(lru.recent?.id)
    }
    return <Page withoutTab>
        <Result
            status="500"
            title="500"
            subTitle="对不起, 页面异常，已记录日志."
            extra={<Button type="primary" onClick={onClick} >返回上一页</Button>}
        />
    </Page>
}
