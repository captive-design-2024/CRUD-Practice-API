// Nest Packages
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

// Third-party Packages
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private context = 'Prisma-Debug';
  private logger = new Logger(this.context);

  /**
   * Set logging as emitting event instead of stdout
   *
   * https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging#event-based-logging
   */
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    // Add prisma query loggging
    Object.assign(
      this,
      this.$on('query', (event) => {
        this.logger.debug(
          `Query - [${event.timestamp}] - ${event.query}, Duration - ${event.duration}ms`,
        );
      }),
      this.$on('error', (event) => {
        this.logger.error(`Error - [${event.timestamp}] - ${event.message}`);
      }),
      this.$on('warn', (event) => {
        this.logger.warn(`Warn - [${event.timestamp}] - ${event.message}`);
      }),
    );
    await this.$connect();
  }
}
