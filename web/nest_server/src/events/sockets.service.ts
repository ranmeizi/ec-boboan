import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * 记录在线设备
 */
@Injectable()
export class SocketsService {
    // 给每个链接一个名字
    socketKeyMap = new Map()

    sockets = new Map()
    
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