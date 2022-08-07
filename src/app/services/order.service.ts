import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Order = {
  symbol: string;
  shares: number;
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  sell: boolean;
  executionPrice?: number | null | undefined;
  stopLimitPrice?: number | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(private http: HttpClient) { }

  postOrder(order: Order) {
    return this.http.post('http://localhost:8080/orders', order);
  }

  deleteOrderById(id: number) {
    return this.http.delete(`http://localhost:8080/orders/${id}`);
  }
}
