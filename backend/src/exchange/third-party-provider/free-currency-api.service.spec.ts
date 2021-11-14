import { HttpService } from '@nestjs/axios';
import { FreeCurrencyApiRatesProvider } from './free-currency-api.service';
import * as mockRates from '../local/mock-rates-data.json';
import { of } from 'rxjs';
import { CurrencyType } from 'src/shared/constants/currency-type.enum';

describe('FreeCurrencyApiRatesProvider', () => {
  let ratesService: FreeCurrencyApiRatesProvider;
  let httpServiceMock: HttpService;
  const supportedCurrencies = Object.values(CurrencyType);

  const apiKeyMock = 'abc';
  process.env.API_KEY = apiKeyMock;

  beforeEach(async () => {
    httpServiceMock = new HttpService();
    httpServiceMock.get = jest.fn().mockImplementation((url: string) => {
      const currency = new URL(url).searchParams.get('base_currency') as string;
      // mocking FreeCurrency api response data shape
      return of({ data: { data: (mockRates as any)[currency] } });
    });

    ratesService = new FreeCurrencyApiRatesProvider(httpServiceMock);
  });

  it('should be defined', () => {
    expect(ratesService).toBeDefined();
  });

  describe('Remote API calls', () => {
    it('should make API calls to get exchange rates for all of supported currencies', async () => {
      const spy = jest.spyOn(httpServiceMock, 'get');
      await ratesService.loadRatesIntoCache();

      expect(spy).toHaveBeenCalledTimes(supportedCurrencies.length);
    });

    it('should include base_currency in the url when making api calls', async () => {
      const spy = jest.spyOn(httpServiceMock, 'get');
      await ratesService.loadRatesIntoCache();

      const url = spy.mock.calls[0][0];
      expect(url).toContain(`&base_currency=${CurrencyType.CAD}`);
    });

    it('should include apikey in the url when making api calls', async () => {
      const spy = jest.spyOn(httpServiceMock, 'get');
      await ratesService.loadRatesIntoCache();

      const url = spy.mock.calls[0][0];
      expect(url).toContain(`apikey=${apiKeyMock}`);
    });

    it('should store the rates data into memory cache', async () => {
      expect.assertions(supportedCurrencies.length);
      await ratesService.loadRatesIntoCache();

      const promises = supportedCurrencies.map(async (currency) => {
        const rateInCache = await ratesService.getRate(currency, CurrencyType.CAD);
        const rateInMockData = (mockRates as any)[currency][CurrencyType.CAD];
        expect(rateInCache).toEqual(rateInMockData);
      });

      await Promise.all(promises);
    });
  });
});
