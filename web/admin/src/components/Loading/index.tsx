import React from 'react'
import ReactDOM from 'react-dom'
import { Spin } from 'antd'

const style: JssSheet<string> = {
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(255,255,255,.6)'
    }
}

export default function Loading() {
    return <div style={style.root}>
        <Spin />
    </div>
}

let isOpen = false

export function open() {
    if (isOpen) {
        return
    }

    isOpen = true
    ReactDOM.render(<Loading />, document.querySelector('.rvt-loading'))
}

export function close() {
    isOpen = false
    ReactDOM.unmountComponentAtNode(document.querySelector('.rvt-loading') as Element)
}

// 监听history pop事件
window.addEventListener('popstate', () => {
    close()
})