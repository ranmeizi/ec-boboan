import React from 'react'
import { Typography, Space, Divider } from 'antd'
import { QuestionCircleOutlined, AntDesignOutlined, VideoCameraOutlined } from '@ant-design/icons'

export default function () {
    return <div>
        {/* 标题 */}
        <Typography.Title level={5}>帮助</Typography.Title>
        <Space direction='vertical'>
            <p>如何理解layout组件</p>
            <p>合理拆分组件</p>
            <p>为什么需要异步模块</p>
            <p>前端开发规范</p>
            <p>如何描述清楚你的组件</p>
            <p>如何写出难以维护的代码</p>
            <p>说相声讲究说学逗唱</p>
            <p>天津人吃煎饼不加烤肠</p>
        </Space>
        <Divider />
        {/* 标题 */}
        <Typography.Title level={5}>其他帮助</Typography.Title>
        <Space direction='vertical'>
            <a href=""><QuestionCircleOutlined />&nbsp;新手指引</a>
            <a href=""><VideoCameraOutlined />&nbsp;视频演示</a>
            <a href=""><AntDesignOutlined />&nbsp;产品文档</a>
        </Space>
    </div>
}