import { Controller, Get, Put } from '@nestjs/common';

@Controller('networth')
export class NetworthController {
  @Get('/all')
  public async getLiabilityAndAsset() {}

  @Put('/liability')
  public async updateLiability() {}

  @Put('/asset')
  public async updateAsset() {}

  @Put('/currency')
  public async updateCurrency() {}
}
