import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('networth')
export class NetworthController {
  @Get('/all')
  public async getLiabilityAndAsset() {
    return 'Get all assets and liabilities';
  }

  @Put('/liability')
  public async updateLiability() {}

  @Put('/asset')
  public async updateAsset() {}

  @Put('/currency')
  public async updateCurrency() {}
}
