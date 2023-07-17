/*
 * @Author: boboan 360969885@qq.com
 * @Date: 2022-07-22 00:52:22
 * @LastEditors: boboan 360969885@qq.com
 * @LastEditTime: 2022-07-29 15:59:51
 * @FilePath: /react-vite-template/src/components/Loading/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import CircularProgress from '@mui/material/CircularProgress';

const style: React.CSSProperties = {
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,.1)'
}

export default function Loading() {
    return <div className='f-r j-center a-center' onClick={e => e.stopPropagation()} style={style}>
        <CircularProgress style={{ color: 'white' }} />
    </div>
}

let isOpen = false
let lodingRoot: ReactDOM.Root

export function open() {
    if (isOpen) {
        return
    }

    isOpen = true
    lodingRoot = ReactDOM.createRoot(document.querySelector('.rvt-loading') as HTMLElement)
    lodingRoot.render(<Loading />)
}

export function close() {
    isOpen = false
    lodingRoot?.unmount?.()
}

// 监听history pop事件
window.addEventListener('popstate', () => {
    close()
})