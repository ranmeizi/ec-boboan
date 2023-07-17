/**
 * Connection 模块，
 * 运行后建立与服务器的 websocket 链接
 * 接收服务器的一些事件
 */
var Connection = (function () {

    function Event(event, data) {
        return JSON.stringify({
            event: event,
            data: data
        })
    }

    // 运行
    function run() {

        var socket = http.newWebsocket('ws://192.168.2.1:8080', null, 2);
        // 设置type=1的时候链接参数
        socket.setCallTimeout(5);
        socket.setReadTimeout(5);
        socket.setWriteTimeout(5);
        //心跳检测
        socket.setPingInterval(1)

        //设置type=2的时候心跳检测时间
        socket.setConnectionLostTimeout(5)

        //设置有文本信息监听器
        event_handler && socket.onText(function (ws1, text) {
            try {
                const event = JSON.parse(text)
                console.log(text)
            } catch (e) {
                console.error(e)
            }
        })

        binary_handler && socket.onBinary(binary_handler)


        socket.onOpen(function () {
            // login
            const info = getDeviceInfo()
            console.log(info)
            socket.sendText(Event('identity', info))
        })

        socket.connect(10000);
        //设置自动重连
        socket.setAutoReconnect(true);

        // 保持主线程
        infinite_loop()
    }

    // 事件 handler
    function event_handler() {
 
    }

    function binary_handler(a) {
        console.log(a)
    }

    // 获取设备信息
    function getDeviceInfo() {
        var width = device.getScreenWidth();
        var height = device.getScreenHeight();
        return { width: width, height: height }
    }

    return {
        run: run
    }
})()