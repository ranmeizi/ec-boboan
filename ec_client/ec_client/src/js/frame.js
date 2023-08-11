var Frame = (function () {
    /** 发送状态 */
    var state = 0
    var controlId = undefined
    var BEAT_TIMEOUT = 3000

    function init() {
        console.log('Frame init')
        startEnv()
        let request = image.requestScreenCapture(10000, 0);
        if (!request) {
            request = image.requestScreenCapture(10000, 0);
        }
        logd("申请截图结果... " + request)
        if (!request) {
            loge("申请截图权限失败,检查是否开启后台弹出,悬浮框等权限")
            exit()
        }
        EB.on('reqFrame', (data) => {
            if (state === 0) {
                // 开始发送画面数据哦
                state = 1

                controlId = data.controlId

                beatControl()

                function capture() {
                    if (state !== 1) {
                        return
                    }
                    let cap = image.captureScreenBitmapEx()
                    const base64 = image.bitmapBase64(cap, "jpg", 7);
                    Connection.sendFrame1(controlId, base64)
                    //图片要回收
                    // sleep(20)
                    image.recycle(cap)
                    setTimeout(capture, 24)
                }
                capture()
            }
        })


        setInterval(() => {
            console.log('frame state=' + state)
        }, 5000)
    }


    /** 为了避免发送错误id，需要定时请求 controlId 的链接是否存在 */
    function beatControl() {
        const socket = Connection.getSocket()
        const Event = Connection.Event
        if (controlId) {
            socket.sendText(Event('isOnline', {
                id: controlId
            }))

            setTimeout(beatControl, BEAT_TIMEOUT);
        }
    }


    EB.on('reqFrameStop', () => {
        if (state === 1) {
            state = 0
        }
    })


    EB.on('isOnlineRes', (data) => {
        if (data.code !== 200) {
            state = 0
            controlId = undefined
        }
    })

    return {
        init: init
    }
})()