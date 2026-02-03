import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

import { ListingsModule } from './listings/listings.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ListingsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
