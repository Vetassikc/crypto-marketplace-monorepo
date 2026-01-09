import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDbStatus(): Promise<string> {
    try {
      const count = await this.prisma.user.count();
      return `Database Connected! User count: ${count}`;
    } catch (error) {
      return `Database Connection Failed: ${error}`;
    }
  }
}
