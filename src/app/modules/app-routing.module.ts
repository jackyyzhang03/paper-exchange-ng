import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import {
  StockDetailsComponent,
} from '../components/stock-details/stock-details.component';
import {
  PortfolioComponent,
} from '../components/portfolio/portfolio.component';
import {
  PendingOrdersComponent,
} from '../components/pending-orders/pending-orders.component';
import {
  TradeHistoryComponent,
} from '../components/trade-history/trade-history.component';
import { AuthGuard } from '../guards/auth.guard';
import { RegisterComponent } from '../components/register/register.component';
import {
  EmailVerificationComponent,
} from '../components/email-verification/email-verification.component';
import { VerifiedGuard } from '../guards/verified.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  {
    path: 'verify',
    component: EmailVerificationComponent,
    canActivate: [AuthGuard, VerifiedGuard],
  },
  {
    path: 'ticker/:symbol',
    component: StockDetailsComponent,
    canActivate: [AuthGuard, VerifiedGuard],
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [AuthGuard, VerifiedGuard],
  },
  {
    path: 'orders',
    component: PendingOrdersComponent,
    canActivate: [AuthGuard, VerifiedGuard],
  },
  {
    path: 'trades',
    component: TradeHistoryComponent,
    canActivate: [AuthGuard, VerifiedGuard],
  },
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
  { path: '**', redirectTo: '/portfolio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
