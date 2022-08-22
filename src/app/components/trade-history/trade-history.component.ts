import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  TradeHistoryDataSource,
} from '../../datasources/trade-history.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

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
export class TradeHistoryComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['symbol', 'type', 'shares', 'price', 'time'];
  pageSizeOptions = [5, 10, 20];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  private subscriptions: Subscription[] = [];

  constructor(public dataSource: TradeHistoryDataSource) { }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.paginator!.page.subscribe((event) => {
        this.dataSource.pageIndex = event.pageIndex;
        this.dataSource.pageSize = event.pageSize;
        this.dataSource.poll();
      }),
      this.sort!.sortChange.subscribe((event) => {
        this.paginator!.firstPage();
        this.dataSource.sortName = event.active;
        this.dataSource.sortDirection = event.direction;
        this.dataSource.poll();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
