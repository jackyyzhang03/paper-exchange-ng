import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { PortfolioDataSource } from '../../datasources/portfolio.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

export type Holding = {
  symbol: string;
  shares: number;
  bookValue: number;
  marketValue: number;
  price: number;
  gain: number;
  return: number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements AfterViewInit, OnDestroy {
  displayedColumns = [
    'symbol',
    'shares',
    'price',
    'bookValue',
    'marketValue',
    'gain',
    'return'];

  pageSizeOptions = [5, 10, 20];

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  private subscriptions: Subscription[] = [];

  constructor(public dataSource: PortfolioDataSource) { }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.paginator!.page.subscribe((event) => {
        this.dataSource.pageIndex = event.pageIndex;
        this.dataSource.pageSize = event.pageSize;
        this.dataSource.sortAndPage();
      }),
      this.sort!.sortChange.subscribe((event) => {
        this.paginator!.firstPage();
        this.dataSource.sortName = event.active as keyof Holding;
        this.dataSource.sortDirection = event.direction;
        this.dataSource.sortAndPage();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
