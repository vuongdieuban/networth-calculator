import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrencyType } from './shared/constants/currency-type.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService: HttpService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
