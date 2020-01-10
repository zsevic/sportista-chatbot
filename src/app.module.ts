import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
