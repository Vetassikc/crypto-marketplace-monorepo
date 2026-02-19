import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/create-listing.dto';
import { Prisma } from '@repo/database';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(createListingDto: CreateListingDto) {
    const { price, ...rest } = createListingDto;
    return this.prisma.listing.create({
      data: {
        ...rest,
        price: new Prisma.Decimal(price),
      },
    });
  }

  async findAll(params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    sellerId?: string;
  }) {
    const { query, minPrice, maxPrice, category, sortBy, sortOrder, sellerId } =
      params;

    const where: Prisma.ListingWhereInput = {};

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice) where.price.lte = new Prisma.Decimal(maxPrice);
    }

    const orderBy: Prisma.ListingOrderByWithRelationInput = {};
    if (sortBy) {
      // Allow sorting by price or createdAt
      if (sortBy === 'price') orderBy.price = sortOrder || 'asc';
      if (sortBy === 'date') orderBy.createdAt = sortOrder || 'desc';
    } else {
      // Default sort
      orderBy.createdAt = 'desc';
    }

    return this.prisma.listing.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            wallets: true,
          },
        },
      },
    });
    return listing;
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
    const { price, ...rest } = updateListingDto;

    const data: Prisma.ListingUpdateInput = { ...rest };
    if (price) {
      data.price = new Prisma.Decimal(price);
    }

    return this.prisma.listing.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.listing.delete({
      where: { id },
    });
  }
}
