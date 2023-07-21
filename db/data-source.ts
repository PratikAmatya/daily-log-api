import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});
// Creating an instance of ConfigService
const configService = new ConfigService();

// Creating an instance of DataSourceOptions
export const dataSourceOptions: DataSourceOptions = {
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  type: configService.get<string>('DB_TYPE') as 'mysql' | 'mariadb',
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
