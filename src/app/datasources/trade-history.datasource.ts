import { Injectable } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { map, Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Trade } from '../components/trade-history/trade-history.component';
import { Page } from './portfolio.datasource';
import { SortDirection } from '@angular/material/sort';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TradeHistoryDataSource implements DataSource<Trade> {
  public pageIndex = 0;
  public pageSize = 10;
  public sortName = 'time';
  public sortDirection: SortDirection = 'desc';
  private subject = new Subject<Trade[]>();
  private totalElements = 0;

  constructor(private http: HttpClient) { }

  connect(collectionViewer: CollectionViewer): Observable<Trade[]> {
    this.poll();
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  poll() {
    this.http.get<Page<Trade>>(`http://${environment.apiUrl}/trades`,
      {
        params: {
          page: this.pageIndex,
          size: this.pageSize,
          sort: this.sortName + ',' + this.sortDirection,
        },
      }).pipe(
      tap((page) => this.totalElements = page.totalElements),
      map((page) => page.content),
    ).subscribe((trades) => this.subject.next(trades));
  }

  length() {
    return this.totalElements;
  }
}
