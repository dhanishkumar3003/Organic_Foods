import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { AddressComponent } from './address/address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AddressComponent,
    ViewCartComponent,
    ViewOrdersComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
