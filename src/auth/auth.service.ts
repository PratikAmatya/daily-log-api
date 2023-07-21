import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signup(signupUserDto: SignupUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: signupUserDto.email,
      },
    });

    if (user) {
      throw new NotAcceptableException('Duplicate user email');
    }

    const newUser = this.userRepository.create(signupUserDto);
    const createdUser = (await this.userRepository.save(newUser)) as User;

    const payload = {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.firstName + ' ' + createdUser.lastName,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    return {
      user: createdUser,
      token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.validPassword(loginUserDto.password)) {
      throw new ForbiddenException('Invalid password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '2d' });
    return {
      user,
      token,
    };
  }
}
