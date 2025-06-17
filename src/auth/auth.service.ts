import { ForbiddenException, Injectable } from '@nestjs/common';
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
    const saltRounds = parseInt(
      this.configService.get<string>('CRYPT_SALT') || '10',
    );
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    return this.userService.create({
      login: createUserDto.login,
      password: hashedPassword,
    });
  }

  async login(loginUserDto: LoginDto) {
    const user = await this.userService.findOneByLogin(loginUserDto.login);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'), // Use configService instead of process.env
      });

      const user = await this.userService.findOneByLogin(payload.login);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      return this.generateTokens(user);
    } catch (e) {
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
