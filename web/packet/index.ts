/**
 * ECServerPacket封包
 * 
 * |       |        event      |        source       |     destination       |
 * |  ---- |        ----       |          ----       |         ----          |
 * |  含义 |       事件名称      |         来源id       |         目的id        |
 * |  大小 |        2字节       |         20字节       |          20字节        |
 * |  来源 | EnumEventType 枚举 | 由服务端base64id库生成 |  由服务端base64id库生成 |
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
    source: string
    destination: string
}

const EVENT_LENGTH = 2
const SOURCE_LENGTH = 20
const DESTINATION_LENGTH = 20
const HEADER_LENGTH = EVENT_LENGTH + SOURCE_LENGTH + DESTINATION_LENGTH

/**
 * 封包
 */
function packData(header: Header, data: ArrayBuffer) {
    // event 补0
    const event = header.event.toString().padStart(2, '0')
    // source / destination
    const { source, destination } = header

    const combinedBuffer = new ArrayBuffer(HEADER_LENGTH + data.byteLength)

    const dataView = new DataView(combinedBuffer);

    const te = new TextEncoder()

    const headerBytes = te.encode(event + source + destination)

    for (let i = 0; i < headerBytes.length; i++) {
        dataView.setUint8(i, headerBytes[i]);
    }

    // Copy the data bytes to the combined ArrayBuffer
    for (let i = 0; i < data.byteLength; i++) {
        // @ts-ignore
        dataView.setUint8(HEADER_LENGTH + i, data[i]);
    }

    return combinedBuffer;
}

/**
 * 解包
 * 解不出来就可以丢了
 */
function unpackData(combinedBuffer: ArrayBuffer): { header: Header, data: ArrayBuffer } {

    const eventBytes = new Uint8Array(combinedBuffer, 0, EVENT_LENGTH)

    const event = parseInt(new TextDecoder().decode(eventBytes));

    const senderBytes = new Uint8Array(combinedBuffer, EVENT_LENGTH, SOURCE_LENGTH)

    const source = new TextDecoder().decode(senderBytes);
    console.log('source',source)

    const destinationBytes = new Uint8Array(combinedBuffer, EVENT_LENGTH + SOURCE_LENGTH, DESTINATION_LENGTH)

    const destination = new TextDecoder().decode(destinationBytes);

    const dataBytes = new Uint8Array(combinedBuffer, HEADER_LENGTH, combinedBuffer.byteLength - HEADER_LENGTH);

    return {
        header: {
            event,
            source,
            destination
        },
        data: dataBytes
    }
}

export { packData, unpackData, EnumEventType,Header }