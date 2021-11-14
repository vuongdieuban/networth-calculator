import { Body, Controller, Get, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ValidatedUser } from 'src/auth/interfaces/validated-user';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';
import { CalculateNetworthRequestDto } from '../dtos/calculate-networth-request.dto';
import { NetworthViewResponseDto } from '../dtos/networth-view-response';
import { NetworthService } from '../services/networth/networth.service';
import { SelectedCurrencyService } from '../services/selected-currency/selected-currency.service';
import { ViewAdapterService } from '../services/view-adapter/view-adapter.service';

// Auth Guard will protect these endpoints and validate the token
// If valid it will reach here and also has injected req.user into Request object
@UseGuards(JwtAuthGuard)
@Controller('networth')
export class NetworthController {
  private readonly missingProfileErrorMsg =
    'This user does not have asset or liability or currency profile created';

  constructor(
    private readonly networthService: NetworthService,
    private readonly viewAdapter: ViewAdapterService,
    private readonly currencyService: SelectedCurrencyService,
  ) {}

  @Get('/supported-currencies')
  public async getAllSupportedCurrencies(): Promise<CurrencyType[]> {
    return this.currencyService.getAllSupportedCurrencies();
  }

  @Post('/calculate')
  public async calculateAndUpdateNetworthWithNewRate(
    @Req() req: Request,
    @Body() payload: CalculateNetworthRequestDto,
  ) {
    const userId = this.extractUserIdFromRequest(req);
    const updatedProfile = await this.networthService.calculateAndUpdateNetworthWithNewRate(
      userId,
      payload,
    );
    if (!updatedProfile) {
      throw new NotFoundException(this.missingProfileErrorMsg);
    }
    return this.viewAdapter.formatNetworthProfileToViewResponse(updatedProfile);
  }

  private extractUserIdFromRequest(req: Request) {
    const user = req.user as ValidatedUser;
    return user.userId;
  }

  @Get('/')
  public async getNetworthProfile(@Req() req: Request): Promise<NetworthViewResponseDto> {
    const userId = this.extractUserIdFromRequest(req);
    const profile = await this.networthService.getNetworthProfile(userId);
    if (!profile) {
      throw new NotFoundException(this.missingProfileErrorMsg);
    }
    return this.viewAdapter.formatNetworthProfileToViewResponse(profile);
  }

  @Post('/')
  public async createNetworthProfile(@Req() req: Request): Promise<NetworthViewResponseDto> {
    const userId = this.extractUserIdFromRequest(req);
    const profile = await this.networthService.createInitialNetworthProfile(userId);
    return this.viewAdapter.formatNetworthProfileToViewResponse(profile);
  }
}
