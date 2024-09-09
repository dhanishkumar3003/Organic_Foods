import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Import LoginComponent
import { HomeComponent } from './home/home.component';
import { AddressComponent } from './address/address.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },  
  { path: 'login',  component: LoginComponent },
  { path: 'address',  component: AddressComponent },
  { path: 'cart',component: ViewCartComponent},
  { path: 'admin',component: ViewCartComponent},
  { path: 'view-order',component: ViewOrdersComponent},
  { path: 'thank-you',component: ThankYouComponent},
  { path: '',  component: HomeComponent },  
  { path: '**', redirectTo: '' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
