import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ValidatedUser } from 'src/auth/interfaces/validated-user';
import { CalculateNetworthRequestDto } from './dtos/calculate-networth-request.dto';
import { NetworthViewResponseDto } from './dtos/networth-view-response';
import { NetworthProfile, NetworthService } from './services/networth/networth.service';

// Auth Guard will protect these endpoints and validate the token
// Once valid it will reach here and also has injected req.user into Request object
@UseGuards(JwtAuthGuard)
@Controller('networth')
export class NetworthController {
  constructor(private readonly networthService: NetworthService) {}

  @Get('/')
  public async getNetworthProfile(@Req() req: Request): Promise<NetworthViewResponseDto> {
    const userId = this.extractUserIdFromRequest(req);

    const profile = await this.networthService.getNetworthProfile(userId);
    if (!profile) {
      throw new BadRequestException('This user does not have asset or liability profile created');
    }
    return this.formatNetworthProfileToViewResponse(profile);
  }

  @Post('/create')
  public async createInitialAssetAndLiability(
    @Req() req: Request,
  ): Promise<NetworthViewResponseDto> {
    const userId = this.extractUserIdFromRequest(req);
    // TODO: create user selected currency profile
    const profile = await this.networthService.createInitialNetworthProfile(userId);
    return this.formatNetworthProfileToViewResponse(profile);
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
      throw new BadRequestException('This user does not have asset or liability profile created');
    }
    return this.formatNetworthProfileToViewResponse(updatedProfile);
  }

  private extractUserIdFromRequest(req: Request) {
    const user = req.user as ValidatedUser;
    return user.userId;
  }

  private formatNetworthProfileToViewResponse(profile: NetworthProfile): NetworthViewResponseDto {
    const { networthValues, asset, liability } = profile;
    const { totalAssets, totalLiabilities, totalNetworth } = networthValues;

    return {
      totalNetworth,
      assets: {
        totalAssets,
        cashAndInvestments: {
          chequing: asset.chequing,
          savingsForTaxes: asset.savingsForTaxes,
          rainyDayFund: asset.rainyDayFund,
          savingsForFun: asset.savingsForFun,
          savingsForTravel: asset.savingsForTravel,
          savingsForPersonalDevelopment: asset.savingsForPersonalDevelopment,
          investment1: asset.investment1,
          investment2: asset.investment2,
          investment3: asset.investment3,
        },
        longTermAssets: {
          primaryHome: asset.primaryHome,
          secondaryHome: asset.secondaryHome,
          other: asset.other,
        },
      },
      liabilities: {
        totalLiabilities,
        shortTermLiabilities: {
          creditCard1: liability.creditCard1,
          creditCard1MonthlyPayment: liability.creditCard1MonthlyPayment,
          creditCard2: liability.creditCard2,
          creditCard2MonthlyPayment: liability.creditCard2MonthlyPayment,
        },
        longTermDebt: {
          mortgage1: liability.mortgage1,
          mortgage1MonthlyPayment: liability.mortgage1MonthlyPayment,
          mortgage2: liability.mortgage2MonthlyPayment,
          mortgage2MonthlyPayment: liability.mortgage2MonthlyPayment,
          lineOfCredit: liability.lineOfCredit,
          lineOfCreditMonthlyPayment: liability.lineOfCreditMonthlyPayment,
          investmentLoan: liability.investmentLoan,
          investmentLoanMonthlyPayment: liability.investmentLoanMonthlyPayment,
        },
      },
    };
  }
}
