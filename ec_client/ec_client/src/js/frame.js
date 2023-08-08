var Frame = (function () {
    var state = 0

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

                const { height, width } = deviceInfo
                // function capture(){
                //     let cap = image.captureScreen(1, 0, 0, width, height)
                //     const base64 = image.toBase64Format(cap, "jpg", 35);
                //     Connection.sendFrame1(data.controlId, base64)
                //     //图片要回收
                //     // sleep(20)
                //     image.recycle(cap)
                //     setTimeout(capture,50)
                // }
                function capture(){
                    let cap = image.captureScreenBitmapEx()
                    const base64 =  image.bitmapBase64(cap,"jpg",15);
                    Connection.sendFrame1(data.controlId, base64)
                    //图片要回收
                    // sleep(20)
                    image.recycle(cap)
                    setTimeout(capture,30)
                }
                capture()
            }
        })
    }

    return {
        init: init
    }
})()