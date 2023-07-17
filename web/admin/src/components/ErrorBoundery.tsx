import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { lru } from './Header/Tab';

class ErrorBoundery extends Component<React.PropsWithChildren<any>> {

    static getDerivedStateFromError(error: Error) {
        console.log(error)
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    state = {
        hasError: false
    }

    componentDidCatch() {
        // 你同样可以将错误日志上报给服务器
        setTimeout(() => {
            this.props.history.replace('/f/500')
        }, 500);
        // 清除lru
        const id = this.props.route.path
        if (id) {
            lru.del(id)
        }
    }

    render() {
        return this.state.hasError
            ? null
            : this.props.children

    }
}
export default withRouter(ErrorBoundery)
