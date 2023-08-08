import { WsAdapter } from '@nestjs/platform-ws'
import { MessageMappingProperties } from '@nestjs/websockets/gateway-metadata-explorer';
import { EMPTY, fromEvent, Observable } from 'rxjs';

export class OverrideWsAdapter extends WsAdapter {
    public bindMessageHandler(
        buffer: any,
        handlers: MessageMappingProperties[],
        transform: (data: any) => Observable<any>,
    ): Observable<any> {
        try {
            const message = JSON.parse(buffer.data);
            const messageHandler = handlers.find(
                handler => handler.message === message.event,
            );
            const { callback } = messageHandler;
            return transform(callback(message.data));
        } catch {
            // 尝试调用 binaryData 事件,所有问题交给 binaryData 处理
            const messageHandler = handlers.find(
                handler => handler.message === 'binaryData',
            );
            const { callback } = messageHandler;

            if (messageHandler) {
                return transform(callback(buffer.data));
            }
            return EMPTY;
        }
    }

}
