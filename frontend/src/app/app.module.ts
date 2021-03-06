import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './pages/login/components/login-form/login-form.component';
import { RegisterFormComponent } from './pages/login/components/register-form/register-form.component';
import { NetworthTableComponent } from './pages/networth/components/networth-table/networth-table.component';
import { ErrorComponent } from './pages/error/error.component';
import { AuthHeaderInterceptor } from './shared/auth/interceptors/auth-header.interceptor';
import { AttachWithCredentialsHeaderInterceptor } from './shared/interceptors/attach-withcredentials-header.interceptor';
import { LoginComponent } from './pages/login/screen/login.component';
import { NetworthComponent } from './pages/networth/screen/networth.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworthComponent,
    LoginComponent,
    LoginFormComponent,
    RegisterFormComponent,
    NetworthTableComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AttachWithCredentialsHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
