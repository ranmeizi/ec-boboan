/**
 * Connection 模块，
 * 运行后建立与服务器的 websocket 链接
 * 接收服务器的一些事件
 */
var deviceInfo
var Connection = (function () {
    var socket

    function Event(event, data) {
        return JSON.stringify({
            event: event,
            data: data
        })
    }

    // 运行
    function run() {

        socket = http.newWebsocket('ws://192.168.2.1:8080', null, 2);
        // socket = http.newWebsocket('ws://192.168.1.6:8080', null, 2);

        // 设置type=1的时候链接参数
        socket.setCallTimeout(5);
        socket.setReadTimeout(5);
        socket.setWriteTimeout(5);
        //心跳检测
        socket.setPingInterval(1)

        //设置type=2的时候心跳检测时间
        socket.setConnectionLostTimeout(5)

        //设置有文本信息监听器
        socket.onText(function (ws1, text) {
            try {
                const event = JSON.parse(text)
                event_handler(event)
            } catch (e) {
                console.log(e)
            }
        })

        binary_handler && socket.onBinary(binary_handler)


        socket.onOpen(function () {
            // login
            deviceInfo = getDeviceInfo()
            socket.sendText(Event('identity', deviceInfo))
        })

        socket.connect(10000);
        //设置自动重连
        socket.setAutoReconnect(true);

        // 保持主线程
        infinite_loop()
    }

    // 事件 handler
    function event_handler(e) {
        const { event, data } = e
        EB.emit(event, data)
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

    function sendFrame(destination, base64) {

        /** 本级由 identity 获得的唯一标识 */
        const source = UniqueId
        const header = {
            event: 0,
            source: source,
            destination: destination
        }
        // console.log(typeof data,Object.prototype.toString.call(data))
        // console.log(packet.arrayBufferToString(data))

        /** 封包 加上 header */
        // const packedData = packet.packData(header, data)

        // socket.sendBinary(packedData)
        // socket.sendBinary(packedData.getBytes());
        // socket.sendBinary(java.io.ByteArrayInputStream(data));
        // socket.sendBinary((new java.lang.Buffer(packedData)).getBytes());
        // console.log(base64)
        socket.sendText(Event('jsonBase64Frame', {
            source: source,
            destination: destination,
            frame: base64
        }))

    }
    function sendFrame1(destination, base64) {

        /** 本级由 identity 获得的唯一标识 */
        const source = UniqueId
        const header = {
            event: 0,
            source: source,
            destination: destination
        }
        // console.log(typeof data,Object.prototype.toString.call(data))
        // console.log(packet.arrayBufferToString(data))

        /** 封包 加上 header */
        // const packedData = packet.packData(header, data)

        // socket.sendBinary(packedData)
        // socket.sendBinary(packedData.getBytes());
        // socket.sendBinary(java.io.ByteArrayInputStream(data));
        // socket.sendBinary((new java.lang.Buffer(packedData)).getBytes());
        // console.log(base64)
        socket.sendBinary(java.lang.String('00' + source + destination + base64).getBytes());
    }

    return {
        run: run,
        sendFrame: sendFrame,
        sendFrame1: sendFrame1,
        getSocket: () => socket,
        Event:Event
    }
})()

var packet = (function () {
    const EVENT_LENGTH = 2
    const SOURCE_LENGTH = 20
    const DESTINATION_LENGTH = 20
    const HEADER_LENGTH = EVENT_LENGTH + SOURCE_LENGTH + DESTINATION_LENGTH

    function arrayToBuffer(array) {
        const buffer = new ArrayBuffer(array.length);
        const view = new DataView(buffer);

        for (let i = 0; i < array.length; i++) {
            view.setUint8(i, array[i]);
        }

        return buffer;
    }

    function arrayBufferToString(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        let string = '';

        for (let i = 0; i < uint8Array.length; i++) {
            string += String.fromCharCode(uint8Array[i]);
        }

        return string;
    }

    function stringToArrayBuffer(str) {
        const buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each character (UTF-16)
        const view = new DataView(buffer);

        for (let i = 0; i < str.length; i++) {
            view.setUint16(i * 2, str.charCodeAt(i), true); // true indicates little-endian
        }

        return buffer;
    }

    /**
     * 封包
     */
    function packData(header, data) {
        data = arrayToBuffer(data)
        // event 补0
        const event = header.event.toString().padStart(2, '0')
        // source / destination
        const { source, destination } = header

        const combinedBuffer = new ArrayBuffer(HEADER_LENGTH + data.byteLength)

        const dataView = new DataView(combinedBuffer);

        const headerBytes = stringToArrayBuffer(event + source + destination)

        for (let i = 0; i < headerBytes.length; i++) {
            dataView.setUint8(i, headerBytes[i]);
        }

        // Copy the data bytes to the combined ArrayBuffer
        for (let i = 0; i < data.byteLength; i++) {
            dataView.setUint8(HEADER_LENGTH + i, data[i]);
        }

        return combinedBuffer;
    }

    /**
     * 解包
     * 解不出来就可以丢了
     */
    function unpackData(combinedBuffer) {

        const eventBytes = new Uint8Array(combinedBuffer, 0, EVENT_LENGTH)

        const event = parseInt(stringToArrayBuffer(eventBytes));

        const senderBytes = new Uint8Array(combinedBuffer, EVENT_LENGTH, SOURCE_LENGTH)

        const source = stringToArrayBuffer(senderBytes);

        const destinationBytes = new Uint8Array(combinedBuffer, EVENT_LENGTH + SOURCE_LENGTH, DESTINATION_LENGTH)

        const destination = stringToArrayBuffer(destinationBytes);

        const dataBytes = new Uint8Array(combinedBuffer, HEADER_LENGTH, combinedBuffer.byteLength - HEADER_LENGTH);

        return {
            header: {
                event: event,
                source: source,
                destination: destination
            },
            data: dataBytes
        }
    }
    return {
        packData: packData,
        unpackData: unpackData,
        arrayBufferToString: arrayBufferToString
    }
})()