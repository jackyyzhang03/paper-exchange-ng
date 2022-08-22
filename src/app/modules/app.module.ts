import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from '../components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../services/auth.interceptor';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  StockDetailsComponent,
} from '../components/stock-details/stock-details.component';
import {
  TradeDialogComponent,
} from '../components/trade-dialog/trade-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  PortfolioComponent,
} from '../components/portfolio/portfolio.component';
import { MatTableModule } from '@angular/material/table';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  SearchBarComponent,
} from '../components/search-bar/search-bar.component';
import {
  PendingOrdersComponent,
} from '../components/pending-orders/pending-orders.component';
import {
  TradeHistoryComponent,
} from '../components/trade-history/trade-history.component';
import { EnumPipe } from '../services/enum.pipe';
import { RegisterComponent } from '../components/register/register.component';
import {
  EmailVerificationComponent,
} from '../components/email-verification/email-verification.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StockDetailsComponent,
    TradeDialogComponent,
    PortfolioComponent,
    NavbarComponent,
    SearchBarComponent,
    PendingOrdersComponent,
    TradeHistoryComponent,
    EmailVerificationComponent,
    EnumPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}
