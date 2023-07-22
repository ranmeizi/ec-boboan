// request 请求参数类型
declare namespace Params {
    export namespace Device {
        type OnlineQuery = {
            /** ip地址，模糊查询 */
            ipAddr: string
        }
    }
}
// response 传输对象类型
declare namespace DTOs {
    export namespace Device {
        type OnlineDeviceInfo = {
            width: number,
            height: number,
            ip?: string
        }
    }
}
// 公共类型
declare namespace Types {
    export namespace Device {

    }
}