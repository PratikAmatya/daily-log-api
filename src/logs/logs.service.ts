import { Injectable } from '@nestjs/common';
import { Log } from './entities/log.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Log) private logRepository: Repository<Log>,
  ) {}

  async create(createLogDto: CreateLogDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const newLog = this.logRepository.create(createLogDto);
    newLog.user = user;

    //Returns new User
    const createdLog = await this.logRepository.save(newLog);
    return {
      log: createdLog,
    };
  }

  async findAll(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['logs'],
    });
    return {
      status: 'sucess',
      data: user.logs.reverse(),
    };
  }
}
