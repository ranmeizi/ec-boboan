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
                function capture(){
                    let cap = image.captureScreen(3, 0, 0, width, height)
                    const base64 = image.toBase64Format(cap, "jpg", 10);
                    Connection.sendFrame(data.controlId, base64)
                    //图片要回收
                    // sleep(20)
                    image.recycle(cap)
                    setTimeout(capture,20)
                }
                capture()
                // while (true) {
                //     // let cap = image.captureScreenBitmap("jpg", 0, 0, width, height, 50);
                //     // let cap = image.captureFullScreen()
                //     let cap = image.captureScreen(3, 0, 0, width, height)
                //     // logd("截图数据: " + typeof cap)
                //     // let w = cap.getWidth();
                //     // let h = cap.getHeight();
                //     // let mPixels = image.getPixelsBitmap(cap, w * h, 0, w, 0, 0, w, h);
                //     // console.log(typeof mPixels,Object.prototype.toString.call(mPixels))
                //     const base64 = image.toBase64Format(cap, "png", 30);
                //     Connection.sendFrame(data.controlId, base64)
                   
                //     //图片要回收
                //     image.recycle(cap)

                //     sleep(1000)
                // }
            }
        })
    }

    return {
        init: init
    }
})()