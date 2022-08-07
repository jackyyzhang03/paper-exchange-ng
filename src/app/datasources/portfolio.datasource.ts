import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Holding } from '../components/portfolio/portfolio.component';
import { firstValueFrom, Observable, ReplaySubject, Subscription } from 'rxjs';
import { PriceService } from '../services/price.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataSource implements DataSource<Holding> {

  private subject = new ReplaySubject<Holding[]>(1);
  private holdings: Holding[] = [];
  private priceSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private priceService: PriceService) {}

  getHoldings() {
    return this.http.get<{ holdings: { symbol: string, shares: number, adjustedCostBase: number }[] }>(
      'http://localhost:8080/portfolio');
  }

  loadPortfolio() {
    firstValueFrom(this.getHoldings()).then((data) => {
      const symbols: string[] = [];
      this.holdings = data.holdings.map(dto => {
        symbols.push(dto.symbol);
        return {
          symbol: dto.symbol,
          shares: dto.shares,
          bookValue: dto.adjustedCostBase * dto.shares,
          marketValue: 0,
          price: 0,
        };
      });
      this.priceSubscription = this.priceService.getPrices(symbols).
        subscribe((priceUpdate) => {
          const holding = this.holdings.find(
            holding => holding.symbol === priceUpdate.s);
          if (holding) {
            holding.marketValue = priceUpdate.p * holding.shares;
            holding.price = priceUpdate.p;
            this.subject.next(this.holdings);
          }
        });
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<Holding[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.priceSubscription?.unsubscribe();
  }

  getHolding(symbol: string) {
    return this.http.get<Holding>(`http://localhost:8080/portfolio/holdings/${symbol}`);
  }
}

function shareNumberValidator() {

}
