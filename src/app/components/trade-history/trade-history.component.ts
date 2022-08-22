import { Component, OnInit } from '@angular/core';
import {
  TradeHistoryDataSource,
} from '../../datasources/trade-history.datasource';
import { PageEvent } from '@angular/material/paginator';

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
  pageSizeOptions = [5, 10, 20];

  constructor(public dataSource: TradeHistoryDataSource) { }

  ngOnInit(): void {
  }

  handlePageEvent(event: PageEvent) {
    this.dataSource.pageIndex = event.pageIndex;
    this.dataSource.pageSize = event.pageSize;
    this.dataSource.poll();
  }
}
