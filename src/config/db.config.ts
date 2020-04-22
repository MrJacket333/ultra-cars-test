import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'UltraCars',  
  synchronize: Boolean(process.env.DB_SYNC) || true,
  entities: [`${__dirname}/../**/entities/*.entity{.ts,.js}`]
}

export { dbConfig };