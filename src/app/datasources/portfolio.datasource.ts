import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Holding } from '../components/portfolio/portfolio.component';
import {
  BehaviorSubject,
  map,
  mergeMap,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { PriceService } from '../services/price.service';
import { SortDirection } from '@angular/material/sort';
import { environment } from '../../environments/environment';

type HoldingDto = { symbol: string, shares: number, adjustedCostBase: number }

export type Page<T> = {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: string;
  size: number;
  sort: { empty: boolean, sorted: boolean, unsorted: boolean };
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataSource implements DataSource<Holding> {
  public pageIndex = 0;
  public pageSize = 10;
  public sortName: keyof Holding = 'symbol';
  public sortDirection: SortDirection = 'asc';
  private subject = new BehaviorSubject<Holding[]>([]);
  private holdings: Holding[] = [];
  private priceSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private priceService: PriceService) {}

  getHoldings() {
    return this.http.get<HoldingDto[]>(
      `http://${environment.apiUrl}/portfolio`);
  }

  loadPortfolio() {
    this.priceSubscription = this.getHoldings().pipe(
      map((holdings) => holdings.map(dtoToHolding)),
      tap((holdings) => this.holdings = holdings),
      map((holdings) => holdings.map((dto) => dto.symbol)),
      mergeMap((symbols) => this.priceService.getPrices(symbols)),
    ).subscribe((priceUpdate) => {
      const holding = this.holdings.find(
        holding => holding.symbol === priceUpdate.s);
      if (holding) {
        holding.marketValue = priceUpdate.p * holding.shares;
        holding.price = priceUpdate.p;
        holding.gain = holding.marketValue - holding.bookValue;
        holding.return = holding.gain / holding.bookValue;
        this.sortAndPage();
      }
    });
  }

  sortAndPage() {
    this.holdings.sort(holdingComparator(this.sortName, this.sortDirection));
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    const holdings = this.holdings.slice(start, end);
    this.subject.next(holdings);
  }

  connect(collectionViewer: CollectionViewer): Observable<Holding[]> {
    this.loadPortfolio();
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.priceSubscription?.unsubscribe();
  }

  getHolding(symbol: string) {
    return this.http.get<Holding>(
      `http://${environment.apiUrl}/portfolio/holdings/${symbol}`);
  }

  length() {
    return this.holdings.length;
  }
}

function dtoToHolding(dto: HoldingDto) {
  return {
    symbol: dto.symbol,
    shares: dto.shares,
    bookValue: dto.adjustedCostBase * dto.shares,
    marketValue: 0,
    price: 0,
    gain: 0,
    return: 0,
  };
}

function holdingComparator(
  sortName: keyof Holding, direction: 'asc' | 'desc' | '') {
  const ascending = direction !== 'desc';
  return (a: Holding, b: Holding) => {
    const x = a[sortName];
    const y = b[sortName];
    if (typeof x === 'number' && typeof y === 'number') {
      return ascending ? x - y : y - x;
    } else if (typeof x === 'string' && typeof y === 'string') {
      return ascending ? x.localeCompare(y) : y.localeCompare(x);
    } else {
      throw new Error('Arguments must be of the same type (number or string))');
    }
  };
}
