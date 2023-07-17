import React from 'react'
import { Statistic, Row, Col } from 'antd'

export default function () {
    return <Row>
        <Col span={6}><Statistic title="遇到的宝可梦" value={251} /></Col>
        <Col span={6}><Statistic title="捕获的宝可梦" value={29} /></Col>
        <Col span={6}><Statistic title="图鉴完成度" value={5} suffix="%" /></Col>
        <Col span={6}><Statistic
            title={<div>加油！距离<span style={{ color: 'red' }}>学习装置</span></div>}
            value={21}
            suffix={<div style={{
                color: 'rgba(0, 0, 0, 0.45)',
                fontSize: '14px'
            }}>只宝可梦</div>}
        /></Col>
    </Row>
}
