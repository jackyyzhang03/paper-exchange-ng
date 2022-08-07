import { Component, OnInit } from '@angular/core';
import { PortfolioDataSource } from '../../datasources/portfolio.datasource';

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

  constructor(public dataSource: PortfolioDataSource) { }

  ngOnInit(): void {
    this.dataSource.loadPortfolio();
  }
}
