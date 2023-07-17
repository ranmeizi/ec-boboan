import React from 'react'
import { List, Typography, Button, Tag, Col } from 'antd'

const list = [
    {
        name: '[主线任务]击败四大天王',
        level: 'high',
        color: 'red',
        content: '参加联盟的宝可梦对战比赛，击败四大天王',
        comp: '(0/1)'
    },
    {
        name: '[日常]遗失的bb机',
        level: 'low',
        color: 'green',
        content: '短裤小子五郎的bb机又找不到了',
        comp: '(0/1)'
    },
    {
        name: '[节日任务]年年有鱼',
        level: 'high',
        color: 'red',
        content: '过年啦过年啦！去愤怒之湖捕捉20条鲤鱼王',
        comp: '(14/20)'
    },
    {
        name: '[日常]姐姐答应你',
        level: 'low',
        color: 'green',
        content: '24号路的大姐姐答应你给你奖励，先帮姐姐清理一下高跟鞋吧',
        comp: '(0/1)'
    },
    {
        name: '存钱',
        level: 'low',
        color: 'green',
        content: '钱太多了，给妈妈寄过去点吧',
        comp: '(0/65535)'
    }
]

export default function () {
    return <div>
        {/* 标题 */}
        <Typography.Title level={5}>待办事项</Typography.Title>
        <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
                <List.Item>
                    <Col span={4}>{item.name}</Col>
                    <Col span={12}>{item.content}</Col>
                    <Col span={4}><Tag color={item.color} >{item.level}</Tag></Col>
                    <Col span={4}>完成度：{item.comp}</Col>
                </List.Item>
            )}
        />
        <div className='f-r j-center'>
            <Button type='link'>查看更多</Button>
        </div>
    </div>
}