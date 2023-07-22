import { wsEventBus } from '@/utils/EventBus'

// 跳过几次心跳重连
const HEART_MISSING_MAX = 4
const HEART_INTERVAL = 5 * 1000

let increment = 0
let timer: number | null = null
let memo: Record<string, boolean> = {}
let connectWhenInit = () => undefined

export function start(socket: WebSocket, connect: any) {
    wsEventBus.on(wsEventBus.TYPES.WS_TEXT_MSG, receive)
    connectWhenInit = connect
    beat(socket)
}

export function stop() {
    // 还原变量值
    increment = 0
    memo = {}

    timer && clearTimeout(timer)
    timer = null
}

function beat(socket: WebSocket) {
    // 检测超过心跳次数
    if (checkMemo()) {
        // 关闭链接
        socket.close()
        // 重连
        connectWhenInit()
        return
    }

    const x = String(increment++)
    socket.send(JSON.stringify({
        event: 'sb',
        data: { x }
    }))
    memo[x] = true

    timer = window.setTimeout(() => {
        beat(socket)
    }, HEART_INTERVAL);
}

function checkMemo() {
    return Object.keys(memo).length > HEART_MISSING_MAX
}

function receive({ event, data }: any) {
    if (event === 'sb') {
        const x = data.x
        delete memo[x]
    }
}