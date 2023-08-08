import request from "@/utils/Request/ec";

export function requestOnlineDeviceList(params: Params.Device.OnlineQuery & PageParam) {
    return request.get<Res.EC.page<DTOs.Device.OnlineDeviceInfo>>('/devices/onlines', {
        params
    }).then(res => res.data.data)
}

export function requestDeviceFindById(params: { id: string }) {
    return request.get<Res.EC.data<DTOs.Device.OnlineDeviceInfo>>('/devices/findById', {
        params
    }).then(res => res.data.data)
}