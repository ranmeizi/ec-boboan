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
import { Socket } from 'net';

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
    console.log(id)
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
  identity(socket: any, data: OnlineDeviceInfo): WsResponse<any> {
    const id = this.socketsServices.socketKeyMap.get(socket)
    this.socketsServices.login(id, {
      ...data,
      ip: this.ip
    })
    return {
      event: "identity",
      data: OK
    }
  }

  /** 心跳消息 人性化心跳检测，对服务器说声sb，服务器会回你一句sb */
  @SubscribeMessage('sb')
  heart(socket, data: any) {
    console.log('heart',data)
    return { event: 'sb', data }
  }

  /**
   * 请求对应端的画面帧
   */
  @SubscribeMessage('reqFrame')
  reqFrame(socket: Socket, data: ReqFeameData): WsResponse<Res.Data<null>> {
    const clientSocket = this.socketsServices.sockets.get(data.id)
    const controlId = this.socketsServices.socketKeyMap.get(socket)
    if (clientSocket) {
      clientSocket.emit('reqFrame', {
        /** 客户端应使用 controlId 向控制端发送数据 */
        controlId: controlId
      })
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

  handleMessage(client: WebSocket, message: Buffer) {
    console.log('Received binary message from client:', message);
    // 在这里处理接收到的二进制数据，您可以将其保存、处理或发送给其他客户端
  }
}


type ReqFeameData = {
  /** 设备id */
  id: string
}