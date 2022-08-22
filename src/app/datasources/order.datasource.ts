import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Order } from '../components/pending-orders/pending-orders.component';
import { Observable, Subject, tap } from 'rxjs';
import { Page } from './portfolio.datasource';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class OrderDataSource implements DataSource<Order> {
  private subject = new Subject<Order[]>();
  private totalElements = 0;
  public pageIndex = 0;
  public pageSize = 10;
  public sortName = 'symbol';
  public sortDirection: SortDirection = 'asc';

  constructor(private http: HttpClient) { }

  connect(collectionViewer: CollectionViewer): Observable<Order[]> {
    this.poll();
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  poll() {
    this.http.get<Page<Order>>('http://localhost:8080/orders',
      {
        params: {
          page: this.pageIndex,
          size: this.pageSize,
          sort: this.sortName + ',' + this.sortDirection,
        },
      }).
      pipe(tap((page) => this.totalElements = page.totalElements)).
      subscribe((page) => this.subject.next(page.content));
  }

  length() {
    return this.totalElements;
  }
}
