import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket,
  OnGatewayConnection
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'
import { OnlineDeviceInfo, SocketsService } from './sockets.service'
import * as base64id from 'base64id'
import { unpackHeader, unpackData } from 'packet'

@WebSocketGateway(8080)
export class EventsGateway {
  constructor(
    private readonly socketsServices: SocketsService,
  ) {

  }

  // 链接ip地址
  private ip?: string

  @WebSocketServer()
  server: Server;

  handleConnection(socket, req) {
    this.ip = req.socket.remoteAddress;
    this.connect(socket)

    // control 为控制端的 admin，为他注册特殊的链接类型
    if (req.headers['sec-websocket-protocol'] === 'control') {
      console.log('控制端上线啦')
    }
  }

  handleDisconnect(socket) {
    console.log('disconnect')
    this.disconnect(socket)
  }

  /**
   * socket connect
   */
  connect(socket) {
    // 连接时创建唯一的id
    const id = base64id.generateId()
    this.socketsServices.socketKeyMap.set(socket, id)
    this.socketsServices.sockets.set(id, socket)
  }

  /**
   * socket disconnect
   * 在这里注销登录
   */
  disconnect(socket) {
    const id = this.socketsServices.socketKeyMap.get(socket)
    this.socketsServices.logout(id)
    this.socketsServices.socketKeyMap.delete(socket)
    this.socketsServices.sockets.delete(id)
  }

  /**
   * 设备登陆
   * connection 之后，设备获取一些基本信息，做上线登陆
   * 登陆的设备被存放于 onlineMap 中
   */
  @SubscribeMessage('identity')
  identity(socket: any, data: OnlineDeviceInfo): WsResponse<Res.Data<{ id: string }>> {
    const id = this.socketsServices.socketKeyMap.get(socket)
    this.socketsServices.login(id, {
      ...data,
      ip: this.ip
    })
    return {
      event: "identity",
      data: {
        code: OK,
        msg: '登陆成功',
        data: {
          id
        }
      }
    }
  }

  /** 心跳消息 人性化心跳检测，对服务器说声sb，服务器会回你一句sb */
  @SubscribeMessage('sb')
  heart(socket, data: any) {
    return { event: 'sb', data }
  }

  /**
   * 请求对应端的画面帧
   * 
   * 画面接入流程
   * 1. 控制端发送 reqFrame 到 app
   * 2. app 得到控制端 id 进入发送状态，同时控制端接受到 reqFrameRes 进入接受状态
   *    a. app 发送状态 每3s 发送一次 带有控制端id 的 isOnline 请求，若4次没有响应，就结束发送
   *    b. 控制端接收状态  10s 没有接收到对应id发送的画面，就推出接收态
   * 3. 控制端点击按钮结束时，控制端发送 reqFrameStop ， app 收到退出发送态
   */
  @SubscribeMessage('reqFrame')
  reqFrame(socket: WebSocket, data: ReqFeameData): WsResponse<Res.Data<null>> {
    console.log('reqFrame', data)
    const clientSocket = this.socketsServices.sockets.get(data.id)
    const controlId = this.socketsServices.socketKeyMap.get(socket)

    if (clientSocket) {
      console.log('clientSocket emit', data.id)
      clientSocket.send(JSON.stringify({
        event: 'reqFrame',
        /** 客户端应使用 controlId 向控制端发送数据 */
        data: {
          controlId
        }
      }))
      return {
        event: 'reqFrameRes',
        data: {
          code: 200,
          msg: '请求成功',
          data: null
        }
      }
    } else {
      return {
        event: 'reqFrameRes',
        data: {
          code: 400,
          msg: '设备不在线',
          data: null
        }
      }
    }
  }

  /** 请求对应app端停止发送画面 */
  @SubscribeMessage('reqFrameStop')
  reqFrameStop(socket: WebSocket, data: ReqFeameStopData): WsResponse<Res.Data<boolean>> {
    console.log('reqFrameStop', data)
    const clientSocket = this.socketsServices.sockets.get(data.id)
    // const controlId = this.socketsServices.socketKeyMap.get(socket)
    if (clientSocket) {
      clientSocket.send(JSON.stringify({
        event: 'reqFrameStop',
        /** 客户端应使用 controlId 向控制端发送数据 */
        data: {}
      }))
      return {
        event: 'reqFrameStopRes',
        data: {
          code: 200,
          msg: '请求成功',
          data: true
        }
      }
    } else {
      return {
        event: 'reqFrameStopRes',
        data: {
          code: 400,
          msg: '设备不在线',
          data: false
        }
      }
    }
  }

  /** 查询链接在线状态 */
  @SubscribeMessage('isOnline')
  isOnline(socket: WebSocket, data: IsOnlineData): WsResponse<Res.Data<boolean>> {
    const clientSocket = this.socketsServices.sockets.get(data.id)

    if (clientSocket) {
      return {
        event: 'isOnline',
        data: {
          code: 200,
          msg: '在线',
          data: true
        }
      }
    } else {
      return {
        event: 'reqFrameStopRes',
        data: {
          code: 400,
          msg: '不在线',
          data: false
        }
      }
    }
  }

  @SubscribeMessage('jsonBase64Frame')
  jsonBase64Frame(socket: WebSocket, data: JsonBase64FrameData) {
    const { destination } = data
    const destSocket = this.socketsServices.sockets.get(destination)
    destSocket.send(JSON.stringify({
      event: 'jsonBase64Frame',
      data: data
    }))
  }

  @SubscribeMessage('controlTouchEvent')
  controlTouchEvent(socket: WebSocket, data: ControlTouchEvent) {
    const {deviceId}=data
    const deviceSocket = this.socketsServices.sockets.get(deviceId)

    deviceSocket.send(JSON.stringify({
      event: 'controlTouchEvent',
      data: data
    }))
  }

  @SubscribeMessage('binaryData')
  handleBinaryData(socket: WebSocket, @MessageBody() message: Buffer) {
    try {
      // 转发给 destination
      const { destination } = unpackHeader(message.buffer)
      // console.log('destination', destination)
      const socket = this.socketsServices.sockets.get(destination)
      socket.send(message)
    } catch (e) {
      // console.log(e)
    }
  }
}
type JsonBase64FrameData = {
  source: string,
  destination: string,
  frame: string
}

type ControlTouchEvent = {
  type: 'touchDown' | 'touchMove' | 'touchUp',
  deviceId: string,
  x: number,
  y: number
}

type ReqFeameData = {
  /** 设备id */
  id: string
}

type ReqFeameStopData = {
  /** 设备id */
  id: string
}

type IsOnlineData = {
  /** 设备id */
  id: string
}
