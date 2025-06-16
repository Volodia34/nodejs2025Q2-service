import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByLogin(loginDto.login);
    if (!user) {
      throw new UnauthorizedException('Authentication failed');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Authentication failed');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      const user = await this.userService.findOne(payload.userId);
      if (!user) {
        throw new ForbiddenException('Access Denied');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: User) {
    const payload = { userId: user.id, login: user.login };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
