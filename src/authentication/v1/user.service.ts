// Nest Packages
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Third-party Packages
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcryptjs';

// Custom Packages
import { PrismaService } from '@app/prisma/prisma.service';
import { JwtPayload } from '@app/types';
import { UserV1SigninDto, UserV1SignupDto } from './dto';
import { TokenAuthResponse } from './response';
import { UserAuthV1Repository } from './user.repository';

@Injectable()
export class UserAuthV1Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: UserAuthV1Repository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: UserV1SignupDto): Promise<TokenAuthResponse> {
    const encryptedPassword = await bcrypt.hash(dto.password, 10);
    const userCredential = {
      ...dto,
      password: encryptedPassword,
    };
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...userCredential,
          signupType: 'LOCAL',
        },
        select: {
          id: true,
        },
      });
      const accessToken = await this.issueToken({ id: newUser.id });
      return new TokenAuthResponse(accessToken);
    } catch (err) {
      // Prisma Unique constraint
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credential already taken');
        }
      }
      // Else
      throw err;
    }
  }

  async signin(dto: UserV1SigninDto): Promise<TokenAuthResponse> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    if (!findUser) {
      throw new UnauthorizedException('Invalid credential');
    }
    const passwordValidation = await bcrypt.compare(
      dto.password,
      findUser.password,
    );
    if (!passwordValidation) {
      throw new UnauthorizedException('Invalid credential');
    }
    const accessToken = await this.issueToken({ id: findUser.id });
    return new TokenAuthResponse(accessToken);
  }

  private async issueToken(payload: JwtPayload): Promise<string> {
    const accessToken = await this.jwt.signAsync(payload);
    return accessToken;
  }
}
