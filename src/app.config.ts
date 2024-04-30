// Nest Packages
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Third-party Packges
import * as bcrypt from 'bcryptjs';

// Custom Packages
import { LocalGuard } from './authentication/guard/local.guard';
import { PrismaService } from './prisma/prisma.service';
import { CommonResponseInterceptor } from './common/interceptors';

// Warning: Do not user this in production
export async function initializeAdminAccount<
  T extends INestApplication = INestApplication,
>(app: T) {
  const adminEmail = 'admin@admin.com';
  const adminPW = await bcrypt.hash('admin', 10);

  // Create or Update admin user
  const prisma = app.get<PrismaService>(PrismaService);
  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      password: adminPW,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Admin',
      signupType: 'LOCAL',
    },
  });
}

export function nestAppConfig<T extends INestApplication = INestApplication>(
  app: T,
) {
  app.enableCors({
    origin: '*',
  });

  // Get reflector
  const reflector = app.get<Reflector>(Reflector);

  // Use global guard
  app.useGlobalGuards(new LocalGuard(reflector));

  // Use class validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector), // Class-Serializer Interceptor
    new CommonResponseInterceptor(), // Response Payload Interceptor
  );

  // Enable versioning as URI
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Set class-validator option
  app.useGlobalPipes(
    new ValidationPipe({
      skipNullProperties: true,
      whitelist: true,
    }),
  );

  // Set class-transformer global serializer interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
}
