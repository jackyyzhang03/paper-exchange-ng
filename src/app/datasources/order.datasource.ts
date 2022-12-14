import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Order } from '../components/pending-orders/pending-orders.component';
import { Observable, Subject, tap } from 'rxjs';
import { Page } from './portfolio.datasource';
import { SortDirection } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderDataSource implements DataSource<Order> {
  public pageIndex = 0;
  public pageSize = 10;
  public sortName = 'symbol';
  public sortDirection: SortDirection = 'asc';
  private subject = new Subject<Order[]>();
  private totalElements = 0;

  constructor(private http: HttpClient) { }

  connect(collectionViewer: CollectionViewer): Observable<Order[]> {
    this.poll();
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  poll() {
    this.http.get<Page<Order>>(`http://${environment.apiUrl}/orders`,
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
