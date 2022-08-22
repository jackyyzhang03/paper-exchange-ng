import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Holding } from '../components/portfolio/portfolio.component';
import {
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  Subscription,
  tap,
} from 'rxjs';
import { PriceService } from '../services/price.service';

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
  private subject = new ReplaySubject<Holding[]>(1);
  private holdings: Holding[] = [];
  private priceSubscription: Subscription | undefined;
  private totalElements = 0;
  public pageIndex = 0;
  public pageSize = 10;

  constructor(private http: HttpClient, private priceService: PriceService) {}

  getHoldings(pageIndex: number, pageSize: number) {
    return this.http.get<Page<HoldingDto>>(
      'http://localhost:8080/portfolio',
      { params: { page: pageIndex, size: pageSize } });
  }

  loadPage() {
    this.priceSubscription?.unsubscribe();
    this.getHoldings(this.pageIndex, this.pageSize).pipe(
      tap((page) => this.totalElements = page.totalElements),
      map((page) => page.content.map(dto => ({
        symbol: dto.symbol,
        shares: dto.shares,
        bookValue: dto.adjustedCostBase * dto.shares,
        marketValue: 0,
        price: 0,
      }))),
      tap((holdings) => this.subject.next(this.holdings = holdings)),
      map((holdings) => holdings.map((dto) => dto.symbol)),
      mergeMap((symbols) => this.priceService.getPrices(symbols)),
    ).subscribe((priceUpdate) => {
      const holding = this.holdings.find(
        holding => holding.symbol === priceUpdate.s);
      if (holding) {
        holding.marketValue = priceUpdate.p * holding.shares;
        holding.price = priceUpdate.p;
        this.subject.next(this.holdings);
      }
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<Holding[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.priceSubscription?.unsubscribe();
  }

  getHolding(symbol: string) {
    return this.http.get<Holding>(
      `http://localhost:8080/portfolio/holdings/${symbol}`);
  }

  length() {
    return this.totalElements;
  }
}
