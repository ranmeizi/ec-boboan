import React, { CSSProperties } from 'react'
import { Typography, Popover, Card } from 'antd'

const gridStyle: CSSProperties = {
    width: '33。3%',
    textAlign: 'center',
    cursor: 'pointer',
    padding: '12px'
};

export default function () {
    return <div>
        {/* 标题 */}
        <Typography.Title level={5}>训练师卡片</Typography.Title>
        {/* 手上的精灵 */}
        <div className='f-r f-w mb-16'>
            <Popover content='Lv.49 哈克龙'>
                <div className='pkm-icon id-148' />
            </Popover>
            <Popover content='Lv.52 哈克龙'>
                <div className='pkm-icon id-148' />
            </Popover>
            <Popover content='Lv.57 暴鲤龙'>
                <div className='pkm-icon id-130' />
            </Popover>
            <Popover content='Lv.66 化石翼龙'>
                <div className='pkm-icon id-142' />
            </Popover>
            <Popover content='Lv.70 快龙'>
                <div className='pkm-icon id-149' />
            </Popover>
            <Popover content='Lv.62 班基拉斯'>
                <div className='pkm-icon id-248' />
            </Popover>
        </div>
        {/* 菜单 */}
        <Card>
            <Card.Grid style={gridStyle}>图鉴</Card.Grid>
            <Card.Grid style={gridStyle}>宝可梦</Card.Grid>
            <Card.Grid style={gridStyle}>训练师</Card.Grid>
            <Card.Grid style={gridStyle}>通讯录</Card.Grid>
            <Card.Grid style={gridStyle}>背包</Card.Grid>
            <Card.Grid style={gridStyle}>记录</Card.Grid>
        </Card>
    </div>
}