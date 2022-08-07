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
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'ticker/:symbol',
    component: StockDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: PendingOrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'trades',
    component: TradeHistoryComponent,
    canActivate: [AuthGuard],
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
