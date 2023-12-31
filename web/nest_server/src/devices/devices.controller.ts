import { Controller, Get, Query } from '@nestjs/common';
import { SocketsService } from '../events/sockets.service'
import { Res } from 'src/util/response';

@Controller('devices')
export class DevicesController {
    constructor(
        private readonly socketsService: SocketsService,
    ) { }

    @Get('onlines')
    queryOnlines(
        @Query('pageNum') pageNum = 1,
        @Query('pageSize') pageSize = 20,
        @Query('ipAddr') ipAddr
    ) {

        const allDevice = Array.from(this.socketsService.onlineMap).map(([id, data]) => {
            return {
                id,
                ...data
            }
        })

        let data = allDevice

        if (ipAddr) {
            data = data.filter(item => {
                const regexp = new RegExp(ipAddr)
                return regexp.test(item.ip)
            })
        }

        // 分页
        let page = data.filter((item, index) => {
            if (index >= (pageNum - 1) * pageSize && index < pageNum * pageSize) {
                return true
            }

            return false
        })

        return Res.data({
            list: page,
            total: data.length,
            pageNumber: pageNum,
            pageSize
        })
    }

    @Get('findById')
    findById(@Query('id') id) {
        const deviceInfo = this.socketsService.onlineMap.get(id)

        if (deviceInfo) {
            return Res.data({
                ...deviceInfo,
                id
            })
        } else {
            return Res.error(`查询不到 id = ${id}的数据`)
        }
    }
}
