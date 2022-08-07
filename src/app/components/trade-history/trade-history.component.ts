import { Component, OnInit } from '@angular/core';
import {
  TradeHistoryDataSource,
} from '../../datasources/trade-history.datasource.service';

export type Trade = {
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  time: number;
}

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss'],
})
export class TradeHistoryComponent implements OnInit {
  displayedColumns = ['symbol', 'type', 'shares', 'price', 'time'];

  constructor(public dataSource: TradeHistoryDataSource) { }

  ngOnInit(): void {
  }

}
