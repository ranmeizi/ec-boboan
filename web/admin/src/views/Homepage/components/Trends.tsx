import React from 'react'
import { List, Typography, Button, Col, Avatar } from 'antd'

const list = [
    {
        name: '短裤小子五郎',
        picture: 'https://s1.52poke.wiki/wiki/thumb/e/eb/VS_%E7%9F%AD%E8%A3%A4%E5%B0%8F%E5%AD%90_ORAS.png/180px-VS_%E7%9F%AD%E8%A3%A4%E5%B0%8F%E5%AD%90_ORAS.png',
        desc: '隔壁大姐姐真好看',
        content: '你还好吗，昨天我在124号路上遇到了野生的迷唇姐，嗨呀，差一点点就抓到了。'
    },
    {
        name: '登山男',
        picture: 'https://s1.52poke.wiki/wiki/f/fd/%E7%99%BB%E5%B1%B1%E7%94%B7_OD_BWB2W2.png',
        desc: '努力，勤奋，付出',
        content: '哎。昨天我的小拳石不吃不喝，可把我吓坏了，下次见面决一死战吧。'
    },
    {
        name: '富家少爷',
        picture: 'https://s1.52poke.wiki/wiki/thumb/3/33/VS_%E5%AF%8C%E5%AE%B6%E5%B0%91%E7%88%BA_XY.png/200px-VS_%E5%AF%8C%E5%AE%B6%E5%B0%91%E7%88%BA_XY.png',
        desc: 'iphone13可真沉，手好酸',
        content: '最近还好吗？我爸爸昨天刚给我买了一辆跑车，咱们在跑车上来一场比试吧！'
    },
    {
        name: '香氛姐姐',
        picture: 'https://s1.52poke.wiki/wiki/thumb/7/74/VS_%E9%A6%99%E6%B0%9B%E5%A7%90%E5%A7%90_ORAS.png/200px-VS_%E9%A6%99%E6%B0%9B%E5%A7%90%E5%A7%90_ORAS.png',
        desc: '臭臭花香水团购价¥135',
        content: '我的臭臭花今天开花了，分泌了很多香水，下次见面也给你一点吧！'
    },
    {
        name: '大姐姐',
        picture: 'https://s1.52poke.wiki/wiki/thumb/6/60/VS_%E5%A4%A7%E5%A7%90%E5%A7%90_XY.png/180px-VS_%E5%A4%A7%E5%A7%90%E5%A7%90_XY.png',
        desc: '姐喜欢你',
        content: '什么时候再来找姐姐玩呀？'
    }
]

export default function () {
    return <div>
        {/* 标题 */}
        <Typography.Title level={5}>动态</Typography.Title>
        <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
                <List.Item
                    actions={[<a key="list-loadmore-edit">回复ta</a>, <a key="list-loadmore-more">查看更多</a>]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.picture} />}
                        title={<a href="https://ant.design">{item.name}</a>}
                        description={item.desc}
                    />
                    <Col span={12}>{item.content}</Col>
                </List.Item>
            )}
        />
        <div className='f-r j-center'>
            <Button type='link'>查看更多</Button>
        </div>
    </div>
}