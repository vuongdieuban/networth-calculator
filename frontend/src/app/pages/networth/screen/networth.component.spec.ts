import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { UserUnauthenticatedError } from 'src/app/shared/auth/errors/auth.error';
import { UnknownHttpError } from 'src/app/shared/auth/errors/generic-http.error';
import { AuthService } from 'src/app/shared/auth/service/auth.service';
import { AuthServiceMock } from 'src/app/shared/auth/service/mock/auth.service.mock';
import { NetworthTableComponent } from '../components/networth-table/networth-table.component';
import { CalculateNetworthRequest } from '../dtos/calculate-networth-request.dto';
import {
  networthDisplayViewModelMock,
  selectedCurrencyMock,
  supportedCurrenciesMock,
} from '../mock/networth-display-view-model.mock';
import { NetworthServiceMock } from '../services/networth/mock/networth.service.mock';
import { NetworthService } from '../services/networth/networth.service';
import { NetworthComponent } from './networth.component';

describe('NetworthComponent', () => {
  let component: NetworthComponent;
  let fixture: ComponentFixture<NetworthComponent>;
  let authService: AuthService;
  let networthService: NetworthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: NetworthService, useClass: NetworthServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworthComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    networthService = TestBed.inject(NetworthService);
    router = TestBed.inject(Router);
    router.navigate = jest.fn();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('NetworthTable rendering', () => {
    it('should not render networth table if networtViewData is undefined', () => {
      component.networthViewData = undefined;
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.directive(NetworthTableComponent));
      expect(el).toBeFalsy();
    });

    it('should not render networth table if networtViewData is defined', () => {
      component.networthViewData = networthDisplayViewModelMock;
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.directive(NetworthTableComponent));
      expect(el).toBeTruthy();
    });
  });

  describe('NetworthComponent behaviour', () => {
    describe('Logout functionality', () => {
      it('should call authService.logout when Logout button is clicked', fakeAsync(() => {
        const spy = jest.spyOn(authService, 'logout');

        const logoutButton = fixture.debugElement.query(By.css('.logout-button'));
        logoutButton.nativeElement.click();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalled();
      }));

      it('should go to login page if logout is success', fakeAsync(() => {
        const routerSpy = jest.spyOn(router, 'navigate');
        jest.spyOn(authService, 'logout').mockReturnValue(of(void 0));

        component.handleLogoutClick();
        expect(routerSpy).toHaveBeenCalledWith(['login']);
      }));

      it('should go to error page if logout throw error', fakeAsync(() => {
        const routerSpy = jest.spyOn(router, 'navigate');
        jest.spyOn(authService, 'logout').mockReturnValue(throwError(new UnknownHttpError()));

        component.handleLogoutClick();
        expect(routerSpy).toHaveBeenCalledWith(['error']);
      }));
    });

    describe('On component init', () => {
      beforeEach(() => {
        component.networthViewData = undefined;
        component.supportedCurrencies = [];
        component.selectedCurrency = '';
      });

      it('should call networthService.getUserSelectedCurrency and store the response data', fakeAsync(() => {
        const spy = jest.spyOn(networthService, 'getUserSelectedCurrency').mockReturnValue(
          of({
            userId: 'abc',
            selectedCurrency: selectedCurrencyMock,
            supportedCurrencies: supportedCurrenciesMock,
          })
        );
        component.ngOnInit();

        expect(spy).toHaveBeenCalled();
        expect(component.selectedCurrency).toBe(selectedCurrencyMock);
        expect(component.supportedCurrencies).toBe(supportedCurrenciesMock);
      }));

      it('should call networthService.getOrCreateNetworthProfile and store the response data', fakeAsync(() => {
        const spy = jest
          .spyOn(networthService, 'getOrCreateNetworthProfile')
          .mockReturnValue(of(networthDisplayViewModelMock));

        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
        expect(component.networthViewData).toBe(networthDisplayViewModelMock);
      }));

      it('should go to login page if networthService throw UserUnauthenticatedError', () => {
        const routerSpy = jest.spyOn(router, 'navigate');
        jest
          .spyOn(networthService, 'getUserSelectedCurrency')
          .mockReturnValue(throwError(new UserUnauthenticatedError()));

        component.ngOnInit();
        expect(routerSpy).toHaveBeenCalledWith(['login']);
      });

      it('should go to error page if networthService throw unknown error', () => {
        const routerSpy = jest.spyOn(router, 'navigate');
        jest
          .spyOn(networthService, 'getUserSelectedCurrency')
          .mockReturnValue(throwError(new Error()));

        component.ngOnInit();
        expect(routerSpy).toHaveBeenCalledWith(['error']);
      });
    });

    describe('On networth calculate request submitted', () => {
      beforeEach(() => {
        component.networthViewData = undefined;
      });

      it('should call networthSerivce.calculateNetworthProfile with the calculateRequest', fakeAsync(() => {
        const mockCaculateRequest = {} as CalculateNetworthRequest;
        const spy = jest.spyOn(networthService, 'calculateNetworthProfile');

        component.handleCalculateNetworthSubmitted(mockCaculateRequest);
        expect(spy).toHaveBeenCalledWith(mockCaculateRequest);
      }));

      it('should store calculate response into component.networthViewData', fakeAsync(() => {
        const mockCaculateRequest = {} as CalculateNetworthRequest;
        jest
          .spyOn(networthService, 'calculateNetworthProfile')
          .mockReturnValue(of(networthDisplayViewModelMock));

        component.handleCalculateNetworthSubmitted(mockCaculateRequest);
        expect(component.networthViewData).toBe(networthDisplayViewModelMock);
      }));
    });
  });
});
