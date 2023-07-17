import { Controller, Get } from '@nestjs/common';
import { SocketsService } from '../events/sockets.service'

@Controller('devices')
export class DevicesController {
    constructor(
        private readonly socketsService: SocketsService,
    ) { }

    @Get('onlines')
    queryOnlines() {
        return {
            list: Array.from(this.socketsService.onlineMap).map(([id, data]) => {
                return {
                    id,
                    ...data
                }
            })
        }
    }
}
