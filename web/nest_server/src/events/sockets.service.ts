import { Injectable } from '@nestjs/common';
import { Socket } from 'net';

/**
 * 记录在线设备
 */
@Injectable()
export class SocketsService {
    // 给每个链接一个名字
    socketKeyMap = new Map<Socket, string>()

    sockets = new Map<string, Socket>()

    onlineMap: Map<string, OnlineDeviceInfo> = new Map()

    async login(id: string, data: OnlineDeviceInfo) {
        this.onlineMap.set(id, data)
    }

    async logout(id: string) {
        this.onlineMap.delete(id)
    }
}

export type OnlineDeviceInfo = {
    width: number,
    height: number,
    ip?: string
}