import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { UnknownHttpError } from 'src/app/shared/auth/errors/generic-http.error';
import { AuthService } from 'src/app/shared/auth/service/auth.service';
import { AuthServiceMock } from 'src/app/shared/auth/service/mock/auth.service.mock';
import { NetworthTableComponent } from '../components/networth-table/networth-table.component';
import { networthDisplayViewModelMock } from '../mock/networth-display-view-model.mock';
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

    describe('NetworthService functionality', () => {
      describe('On component init', () => {
        beforeEach(() => {
          component.ngOnInit();
        });

        it('should call networthService to getUserSelectedCurrency', () => {});
      });
    });
  });
});
