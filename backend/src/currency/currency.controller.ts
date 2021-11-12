import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ValidatedUser } from 'src/auth/interfaces/validated-user';
import { UserSelectedCurrencyResponseDto } from './dtos/user-selected-currency.dto';
import { SelectedCurrencyService } from './services/selected-currency/selected-currency.service';

@UseGuards(JwtAuthGuard)
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: SelectedCurrencyService) {}

  @Get('/')
  public async getOrCreateUserSelectedCurrency(
    @Req() req: Request,
  ): Promise<UserSelectedCurrencyResponseDto> {
    const userId = this.extractUserIdFromRequest(req);
    const selectedCurrency = await this.currencyService.getOrCreateUserSelectedCurrency(userId);
    const allSupportedCurrencies = this.currencyService.getAllSupportedCurrencies();
    return {
      userId,
      selectedCurrency: selectedCurrency.currency,
      supportedCurrencies: allSupportedCurrencies,
    };
  }

  private extractUserIdFromRequest(req: Request) {
    const user = req.user as ValidatedUser;
    return user.userId;
  }
}
