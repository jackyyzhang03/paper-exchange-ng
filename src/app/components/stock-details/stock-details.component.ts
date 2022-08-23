import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PriceService, TimeUnit } from '../../services/price.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent } from '../trade-dialog/trade-dialog.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

type ChartRangeOption = {
  unit: TimeUnit;
  number: number;
  resolution: string;
  label: string;
}

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss'],
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  ranges: ChartRangeOption[] = [
    {
      unit: 'day',
      number: 1,
      resolution: '1',
      label: '1D',
    },
    {
      unit: 'day',
      number: 5,
      resolution: '5',
      label: '5D',
    },
    {
      unit: 'day',
      number: 10,
      resolution: '15',
      label: '10D',
    },
    {
      unit: 'month',
      number: 1,
      resolution: '60',
      label: '1M',
    },
    {
      unit: 'month',
      number: 3,
      resolution: 'D',
      label: '3M',
    },
    {
      unit: 'month',
      number: 6,
      resolution: 'D',
      label: '6M',
    },
    {
      unit: 'year',
      number: 1,
      resolution: 'D',
      label: '1Y',
    },
    {
      unit: 'year',
      number: 5,
      resolution: 'D',
      label: '5Y',
    },
    {
      unit: 'all',
      number: 0,
      resolution: 'D',
      label: 'All',
    },
  ];

  price = 0;
  symbol = '';
  subscription: Subscription | undefined;
  selected = this.ranges[0];

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
    this.subscription?.unsubscribe();
  }

  openDialog() {
    this.dialog.open(TradeDialogComponent, { data: { symbol: this.symbol } });
  }

  handleToggle(event: MatButtonToggleChange) {
    this.selected = this.ranges[event.value];
  }
}
