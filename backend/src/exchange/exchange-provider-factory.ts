import { HttpService } from '@nestjs/axios';
import { FreeCurrencyApiRatesProvider } from './third-party-provider/free-currency-api.service';
import { LocalRatesProvider } from './local/local-rates.service';

export function exchangeProviderFactory(httpService: HttpService) {
  const providerName = process.env.EXCHANGE_PROVIDER;
  if (providerName === 'free-currency') {
    return new FreeCurrencyApiRatesProvider(httpService);
  } else {
    return new LocalRatesProvider();
  }
}
