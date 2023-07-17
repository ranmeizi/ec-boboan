import React from 'react'
import { makeStyles } from '@/theme/useThemeStyle'
import jieniguiImg from '@/assets/images/jng.png'
import { Card } from 'antd'
import Page from '@/components/Page'
import Statistic from './components/Statistic'
import Todo from './components/Todo'
import Trends from './components/Trends'
import TrainerCard from './components/TrainerCard'
import Help from './components/Help'
import FengMianImg from '@/assets/images/fengmian.jpg'
import './style.less'

// 例子 怎样使用cssinjs theme
const useStyle = makeStyles((theme) => ({
    header: {
        padding: '16px 24px',
        width: '100%',
        color: '#fff',
        fontWeight: 600,
        backgroundColor: '#788bb1',
        backgroundImage: `url(${jieniguiImg})`,
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        backgroundOrigin: 'content-box',
        marginBottom: '16px'
    },
    left: {
        flex: 3
    },
    right: {
        marginLeft: '14px',
        flex: 1,
        color: theme.fc.header
    },
    fengmian: {
        width: '100%',
        cursor: 'pointer',
        borderRadius: '4px',
        overflow: 'hidden'
    }
}))

export default function () {
    const styles = useStyle()
    return <Page>
        {/* 头部 */}
        <div style={styles.header}>
            <div style={{ fontSize: '18px' }}>hi,辛苦啦,训练师</div>
            <div>今天有没有遇到好吃的宝可梦呢？派蒙给你做甜甜花酿鲤鱼王好不好</div>
        </div>
        <div className='f-r'>
            {/* 内容 */}
            <div style={styles.left}>
                {/* 统计 */}
                <Card className='mb-16'>
                    <Statistic />
                </Card>
                {/* 待办 */}
                <Card className='mb-16'>
                    <Todo />
                </Card>
                {/* 动态 */}
                <Card className='mb-16'>
                    <Trends />
                </Card>
                {/* 常用 */}
                <Card>
                    不常用的，反正你也不看
                </Card>
            </div>
            {/* 边栏 */}
            <div style={styles.right}>
                {/* 训练师卡片 */}
                <Card className='mb-16'>
                    <TrainerCard />
                </Card>
                <div className='mb-16' style={styles.fengmian}>
                    <img src={FengMianImg} style={{ width: '100%' }} />
                </div>
                <Card>
                    <Help />
                </Card>
            </div>
        </div>
    </Page>
}
