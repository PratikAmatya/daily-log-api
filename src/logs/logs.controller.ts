import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('logs')
@UseGuards(AuthGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@Body() createLogDto: CreateLogDto, @Req() req: any) {
    const decoded = req.decoded;
    return this.logsService.create(
      {
        ...createLogDto,
      },
      decoded.id,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    const decoded = req.decoded;

    return this.logsService.findAll(decoded.id);
  }
}
