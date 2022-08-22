import { Component, OnInit } from '@angular/core';
import { PortfolioDataSource } from '../../datasources/portfolio.datasource';
import { PageEvent } from '@angular/material/paginator';

export type Holding = {
  symbol: string;
  shares: number;
  bookValue: number;
  marketValue: number;
  price: number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  displayedColumns = [
    'symbol',
    'shares',
    'price',
    'bookValue',
    'marketValue',
    'gain',
    'return'];

  pageSizeOptions = [5, 10, 20];

  constructor(public dataSource: PortfolioDataSource) { }

  ngOnInit(): void {
    this.loadPage();
  }

  handlePageEvent(event: PageEvent) {
    this.dataSource.pageIndex = event.pageIndex
    this.dataSource.pageSize = event.pageSize;
    this.loadPage();
  }

  loadPage() {
    this.dataSource.loadPage();
  }
}
