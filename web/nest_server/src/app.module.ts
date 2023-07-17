import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';
import { DevicesController } from './devices/devices.controller';
import { SocketsService } from './events/sockets.service'

@Module({
  imports: [EventsModule],
  controllers: [AppController, DevicesController],
  providers: [AppService, EventsGateway, SocketsService],
})
export class AppModule { }
