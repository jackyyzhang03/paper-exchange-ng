import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Trade } from '../components/trade-history/trade-history.component';

@Injectable({
  providedIn: 'root',
})
export class TradeHistoryDataSource implements DataSource<Trade> {
  private subject = new Subject<Trade[]>();

  constructor(private http: HttpClient) { }

  connect(collectionViewer: CollectionViewer): Observable<Trade[]> {
    firstValueFrom(
      this.http.get<{ trades: Trade[] }>('http://localhost:8080/trades')).
      then((data) => this.subject.next(data.trades));
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
