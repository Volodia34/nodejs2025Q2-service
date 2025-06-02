import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const existingUser = this.users.find(
      (user) => user.login === createUserDto.login,
    );
    if (existingUser) {
      throw new HttpException('Login already exists', HttpStatus.CONFLICT);
    }

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
