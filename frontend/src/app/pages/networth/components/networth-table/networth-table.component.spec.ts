import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  networthDisplayViewModelMock,
  selectedCurrencyMock,
  supportedCurrenciesMock,
} from '../../mocks/networth-display-view-model.mock';
import { AssetViewDetails, LiabilityViewDetails } from '../../models/networth-display-view.model';
import { NetworthTableComponent } from './networth-table.component';

describe('NetworthTableComponent', () => {
  let component: NetworthTableComponent;
  let fixture: ComponentFixture<NetworthTableComponent>;
  let currencyPipe: CurrencyPipe;

  const queryElementByCss = (selector: string) => {
    return fixture.debugElement.query(By.css(selector)).nativeElement;
  };

  const queryAllElementByCss = (selector: string) => {
    return fixture.debugElement.queryAll(By.css(selector)).map((el) => el.nativeElement);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSelectModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [NetworthTableComponent],
      providers: [CurrencyPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworthTableComponent);
    component = fixture.componentInstance;

    component.networthViewData = networthDisplayViewModelMock;
    component.selectedCurrency = selectedCurrencyMock;
    component.supportedCurrencies = supportedCurrenciesMock;

    currencyPipe = TestBed.inject(CurrencyPipe);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('networthViewData rendering', () => {
    describe('asset and liabilities', () => {
      it('should render input forms with initial value for assets and liabilities', () => {
        expect.hasAssertions();

        const assertInputExist = (category: AssetViewDetails | LiabilityViewDetails) => {
          const input: HTMLInputElement = queryElementByCss(`input[id="${category.fieldName}"]`);
          expect(input).toBeTruthy();
          expect(input.id).toBe(category.fieldName);
          expect(input.value).toBe(category.amount);
        };

        const { assets, liabilities } = networthDisplayViewModelMock;
        const { cashAndInvestments, longTermAssets } = assets;
        const { longTermDebts, shortermLiabilities } = liabilities;

        cashAndInvestments.forEach((category) => assertInputExist(category));
        longTermAssets.forEach((category) => assertInputExist(category));
        longTermDebts.forEach((category) => assertInputExist(category));
        shortermLiabilities.forEach((category) => assertInputExist(category));
      });

      it('should render and format totalNetworth, totalAssets and totalLiabilities', () => {
        const totalAssetsEl: HTMLElement = queryElementByCss('.total-assets');
        const totalLiabilitiesEl: HTMLElement = queryElementByCss('.total-liabilities');
        const totalNetworthEl: HTMLElement = queryElementByCss('.total-networth');

        const { totalAssets, totalLiabilities, totalNetworth } = networthDisplayViewModelMock;
        expect(totalAssetsEl.innerHTML).toBe(currencyPipe.transform(totalAssets));
        expect(totalLiabilitiesEl.innerHTML).toBe(currencyPipe.transform(totalLiabilities));
        expect(totalNetworthEl.innerHTML).toBe(currencyPipe.transform(totalNetworth));
      });
    });

    describe('currencies', () => {
      const getCurrencyDropdownSelector = (): HTMLSelectElement => {
        return queryElementByCss('#currency-selector');
      };

      const getCurrencyDropdownOptions = (): HTMLOptionElement[] => {
        return queryAllElementByCss('.currency-option');
      };

      it('should render all currency on display as the default selected currency', () => {
        expect.hasAssertions();
        const currencyOnDisplay: HTMLElement[] = queryAllElementByCss('.selected-currency');
        currencyOnDisplay.forEach((el) => {
          expect(el.innerHTML).toBe(selectedCurrencyMock);
        });
      });

      it('should render user selected currency as default value for the drop down', () => {
        const select = getCurrencyDropdownSelector();
        select.click();
        fixture.detectChanges();
        expect(select.innerHTML).toContain(selectedCurrencyMock);

        const currenciesWithoutUserSelected = supportedCurrenciesMock.filter(
          (currency) => currency !== selectedCurrencyMock
        );
        expect(select.innerHTML).not.toContain(currenciesWithoutUserSelected[1]);
      });

      it('should render all supportedCurrencies as drop down options', () => {
        const select = getCurrencyDropdownSelector();
        select.click();
        fixture.detectChanges();

        const currencyOptions = getCurrencyDropdownOptions();
        expect(currencyOptions.length).toBeGreaterThan(0);
        expect(currencyOptions.length).toEqual(supportedCurrenciesMock.length);

        currencyOptions.forEach((option) => {
          const currencyText = option.innerHTML.trim();
          expect(supportedCurrenciesMock.includes(currencyText)).toBe(true);
        });
      });

      it('should change template display and the currencyForm value when select a currency option', () => {
        const select = getCurrencyDropdownSelector();
        select.click();
        fixture.detectChanges();

        const currencyOptions = getCurrencyDropdownOptions();
        const selectedOption = currencyOptions[2];
        // make sure we not select the same one as the input selected currency
        expect(selectedOption.innerHTML).not.toBe(selectedCurrencyMock);
        selectedOption.click();
        fixture.detectChanges();

        const selectedCurrency = selectedOption.innerHTML;
        expect(component.currencyFormControl.value).toBe(selectedCurrency);
      });
    });
  });

  describe('Calculate button behaviour', () => {
    it('should render the calculate button', () => {
      const calculateButton: HTMLButtonElement = queryElementByCss('.calculate-button');
      expect(calculateButton).toBeTruthy();
    });

    it('should emit converted form value into CalculateNetworthRequest object when clicked', () => {
      const spy = jest.spyOn(component.calculateNetworthSubmitted, 'emit');
      const calculateButton: HTMLButtonElement = queryElementByCss('.calculate-button');
      calculateButton.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);

      const request = spy.mock.calls[0][0];
      expect(request?.fromCurrency).toBeDefined();
      expect(request?.toCurrency).toBeDefined();
      expect(request?.assets).toBeDefined();
      expect(request?.assets?.chequing).not.toBeNaN();
      expect(request?.assets?.savingsForTaxes).not.toBeNaN();
      expect(request?.assets?.rainyDayFund).not.toBeNaN();
      expect(request?.assets?.savingsForFun).not.toBeNaN();
      expect(request?.assets?.savingsForTravel).not.toBeNaN();
      expect(request?.assets?.savingsForPersonalDevelopment).not.toBeNaN();
      expect(request?.assets?.investment1).not.toBeNaN();
      expect(request?.assets?.investment2).not.toBeNaN();
      expect(request?.assets?.investment3).not.toBeNaN();
      expect(request?.assets?.primaryHome).not.toBeNaN();
      expect(request?.assets?.secondaryHome).not.toBeNaN();
      expect(request?.assets?.other).not.toBeNaN();

      expect(request?.liabilities).toBeDefined();
      expect(request?.liabilities.creditCard1).not.toBeNaN();
      expect(request?.liabilities.creditCard1MonthlyPayment).not.toBeNaN();
      expect(request?.liabilities.creditCard2).not.toBeNaN();
      expect(request?.liabilities.creditCard2MonthlyPayment).not.toBeNaN();
      expect(request?.liabilities.mortgage1).not.toBeNaN();
      expect(request?.liabilities.mortgage1MonthlyPayment).not.toBeNaN();
      expect(request?.liabilities.mortgage2).not.toBeNaN();
      expect(request?.liabilities.mortgage2MonthlyPayment).not.toBeNaN();
      expect(request?.liabilities.lineOfCredit).not.toBeNaN();
      expect(request?.liabilities.lineOfCreditMonthlyPayment).not.toBeNaN();
      expect(request?.liabilities.investmentLoan).not.toBeNaN();
      expect(request?.liabilities.investmentLoanMonthlyPayment).not.toBeNaN();
    });
  });
});
