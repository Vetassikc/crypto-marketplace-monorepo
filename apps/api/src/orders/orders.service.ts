import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        listingId: createOrderDto.listingId,
        buyerId: createOrderDto.buyerId,
        status: 'PENDING',
      },
      include: {
        listing: true,
        buyer: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        listing: true,
        buyer: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        listing: true,
        buyer: true,
      },
    });
  }
}
