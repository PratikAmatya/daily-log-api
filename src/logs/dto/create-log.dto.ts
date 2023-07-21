import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';
export class CreateLogDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
