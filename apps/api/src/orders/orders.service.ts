import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@repo/database';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        listingId: createOrderDto.listingId,
        buyerId: createOrderDto.buyerId,
        status: createOrderDto.txHash ? 'PAID' : 'PENDING', // Auto-set to PAID if crypto tx exists
        txHash: createOrderDto.txHash,
      },
      include: {
        listing: true,
        buyer: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findAll(buyerAddress?: string) {
    const where: Prisma.OrderWhereInput = {};

    if (buyerAddress) {
      where.buyer = {
        wallets: {
          some: {
            address: buyerAddress,
          },
        },
      };
    }

    return this.prisma.order.findMany({
      where,
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
