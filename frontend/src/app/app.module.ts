import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routes/app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { NetworthComponent } from './pages/networth/networth.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [NetworthComponent, LoginComponent, AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
