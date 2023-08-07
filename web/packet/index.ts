/**
 * ECServerPacket封包
 * ｜ event 2  ｜ sender20 ｜
 * 
 * |       |  event 2  | sender 20  |
 * |  ---- |  ----  | ----  |
 * |  含义 | 事件名称  | 发送着 |
 * |  大小 | 2字节  | 单元格 |
 * |  来源 | EnumEventType 枚举 | 由服务端base64id库生成 |
 */
const md = ''

/** 
 * 事件类型 最大2个字节，0-99 可以定义100个
 */
enum EnumEventType {
    frameEvent = 0
}

type Header = {
    event: EnumEventType
    sender: string
}

const EVENT_LENGTH = 2
const SENDER_LENGTH = 20
const HEADER_LENGTH = EVENT_LENGTH + SENDER_LENGTH

/**
 * 封包
 */
function packData(header: Header, data: ArrayBuffer) {
    // event 补0
    const event = header.event.toString().padStart(2, '0')
    // sender
    const sender = header.sender

    const combinedBuffer = new ArrayBuffer(HEADER_LENGTH + data.byteLength)

    const dataView = new DataView(combinedBuffer);

    const te = new TextEncoder()

    const headerBytes = te.encode(event + sender)

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
function unpackData(combinedBuffer: ArrayBuffer): { header: Header, data: ArrayBuffer } {
    const dataView = new DataView(combinedBuffer);

    const eventBytes = new Uint8Array(combinedBuffer, 0, EVENT_LENGTH)

    const event = parseInt(new TextDecoder().decode(eventBytes));

    const senderBytes = new Uint8Array(combinedBuffer, EVENT_LENGTH, SENDER_LENGTH)

    const sender = new TextDecoder().decode(senderBytes);
    console.log(event, sender)

    const dataBytes = new Uint8Array(combinedBuffer, HEADER_LENGTH, combinedBuffer.byteLength - HEADER_LENGTH);

    return {
        header: {
            event,
            sender
        },
        data: dataBytes
    }
}

export { packData, unpackData }