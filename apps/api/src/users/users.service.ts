import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async login(loginUserDto: LoginUserDto) {
    const { address, network } = loginUserDto;

    // 1. Try to find an existing wallet
    const existingWallet = await this.prisma.wallet.findUnique({
      where: { address },
      include: { user: true },
    });

    if (existingWallet) {
      return existingWallet.user;
    }

    // 2. If no wallet, create new User AND Wallet
    // We use a transaction or nested create to ensure consistency
    const newUser = await this.prisma.user.create({
      data: {
        role: 'BUYER',
        wallets: {
          create: {
            address,
            network,
          },
        },
      },
    });

    return newUser;
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { wallets: true },
    });
  }
}
