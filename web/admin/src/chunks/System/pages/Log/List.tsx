import React from 'react'
import Page from '@/components/Page'

export default function () {
    return <Page>
        我是日志模块 <input type="text" />
        {
            Array(1000).fill(<div>这喝鸡汤多是一件美事</div>)
        }
    </Page>
}