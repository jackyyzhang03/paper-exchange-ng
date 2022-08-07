import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PriceService } from '../../services/price.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent } from '../trade-dialog/trade-dialog.component';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss'],
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  price = 0;
  symbol = '';
  subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private priceService: PriceService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const symbol = convertToParamMap(params).get('symbol');
      this.subscription?.unsubscribe();
      if (symbol) {
        this.symbol = symbol;
        this.subscription = this.priceService.getPrices([symbol]).
          subscribe((data) => this.price = data.p);
      } else {
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog() {
    this.dialog.open(TradeDialogComponent, { data: { symbol: this.symbol } });
  }
}
