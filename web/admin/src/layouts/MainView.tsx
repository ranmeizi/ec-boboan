import React, { PureComponent } from 'react'
import TransitionRoutes from '@/routes/renderRoutes'
import { Layout } from 'antd';
import Menu from '@/components/Menu'
import Header from '@/components/Header';
import './style.less'
import backImg from '@/assets/images/back.jpg'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import HeaderTab from '@/components/Header/Tab';

import { makeStyles } from '@/theme/useThemeStyle'

// 例子 怎样使用cssinjs theme
const useStyle = makeStyles((theme) => ({
    t1: {
        color: theme.fc.text
    },
    t2: {
        color: theme.fc.text
    }
}))

function Logo({ collapsed }: any) {
    const styles = useStyle()
    return <div className='logo'>
        <div className='t1' style={collapsed ? { fontSize: '12px', ...styles.t1 } : styles.t1}>{collapsed ? 'R' : 'React-Vite-Template'}</div>
        <div className='t2' style={styles.t2}>{collapsed ? '' : 'boboan'}</div>
        <div className='box2'>
            <img src={backImg} className='avatar-back' />
        </div>
        <div className='box'>
            <div className='avatar'></div>
        </div>
    </div >
}

class MainView extends PureComponent<any> {

    static getDerivedStateFromError() {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    state = {
        hasError: false
    }

    render() {
        const { hasError } = this.state
        return (
            <Layout style={{ height: '100%', width: '100%' }}>
                <Layout.Sider theme={this.props.theme} collapsed={this.props.collapsed}>
                    <Logo collapsed={this.props.collapsed} />
                    <Menu />
                </Layout.Sider>
                <Layout>
                    <Layout.Header style={{ background: '#fff' }}>
                        <Header />
                    </Layout.Header>
                    <Layout.Content className='rvt-content'>
                        <div><HeaderTab /></div>
                        {
                            hasError
                                ? <Redirect to='/f/500'></Redirect>
                                : <div className='rvt-router-view'>
                                    <div className='rvt-loading' />
                                    <TransitionRoutes {...this.props.route} />
                                </div>
                        }
                    </Layout.Content>
                </Layout>
            </Layout>
        )
    }
}

export default connect((state: any) => ({
    collapsed: state.app.collapsed,
    theme: state.app.theme
}))(MainView)