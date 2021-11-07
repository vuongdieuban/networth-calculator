import { BadRequestException, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ValidatedUser } from 'src/auth/interfaces/validated-user';
import { CreateAssetLiabilityResponseDto } from './dtos/create-asset-liability-response.dto';
import { GetAssetLiabilityResponseDto } from './dtos/get-asset-liability-response.dto';
import { AssetEntity } from './entities/asset.entity';
import { LiabilityEntity } from './entities/liability.entity';
import { NetworthService, NetworthValues } from './services/networth.service';

// Auth Guard will protect these endpoints and validate the token
// Once valid it will reach here and also has injected req.user into Request object
@UseGuards(JwtAuthGuard)
@Controller('networth')
export class NetworthController {
  constructor(private readonly networthService: NetworthService) {}

  @Get('/')
  public async getLiabilityAndAssetProfile(
    @Req() req: Request,
  ): Promise<GetAssetLiabilityResponseDto> {
    const userId = this.extractUserIdFromRequest(req);
    const [asset, liability] = await this.networthService.getLiabilityAndAssetProfile(userId);

    if (!(asset && liability)) {
      throw new BadRequestException('This user does not have asset or liability profile created');
    }
    const networthValues = this.networthService.calculateNetworthValues(asset, liability);

    return this.formatGetAssetLiabilityResponse(networthValues, asset, liability);
  }

  @Post('/')
  public async createInitialAssetAndLiability(
    @Req() req: Request,
  ): Promise<CreateAssetLiabilityResponseDto> {
    const userId = this.extractUserIdFromRequest(req);
    const [asset, liability] = await this.networthService.createInitialAssetAndLiability(userId);
    return {
      userId,
      assetId: asset.id,
      liabilityId: liability.id,
    };
  }

  @Put('/liability')
  public async updateLiability() {}

  @Put('/asset')
  public async updateAsset() {}

  @Put('/currency')
  public async updateCurrency() {}

  private extractUserIdFromRequest(req: Request) {
    const user = req.user as ValidatedUser;
    return user.userId;
  }

  private formatGetAssetLiabilityResponse(
    networthValues: NetworthValues,
    asset: AssetEntity,
    liability: LiabilityEntity,
  ): GetAssetLiabilityResponseDto {
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
