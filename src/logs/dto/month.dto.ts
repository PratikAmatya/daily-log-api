import { IsNotEmpty, IsEnum } from 'class-validator';
import { ValidMonths } from 'public/months';
import { Transform } from 'class-transformer';

export class MonthDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(ValidMonths, { message: 'Invalid month value' })
  month: string;
}
