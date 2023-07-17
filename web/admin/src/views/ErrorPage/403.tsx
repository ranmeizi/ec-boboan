import React from 'react'
import { Result, Button } from 'antd';
import Page from '@/components/Page';

export default function () {
    return <Page>
        <Result
            status="403"
            title="403"
            subTitle="对不起，您无权访问此页."
            extra={<Button type="primary">回到首页</Button>}
        />
    </Page>
}
