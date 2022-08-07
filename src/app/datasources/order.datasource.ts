import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Order } from '../components/pending-orders/pending-orders.component';
import { firstValueFrom, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderDataSource implements DataSource<Order> {
  private subject = new Subject<Order[]>();

  constructor(private http: HttpClient) { }

  connect(collectionViewer: CollectionViewer): Observable<Order[]> {
    this.poll();
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  poll() {
    firstValueFrom(
      this.http.get<{ orders: Order[] }>('http://localhost:8080/orders')).
      then(data => this.subject.next(data.orders));
  }
}
