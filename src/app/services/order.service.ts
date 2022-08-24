import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    return this.http.post(`http://${environment.apiUrl}/orders`, order);
  }

  deleteOrderById(id: number) {
    return this.http.delete(`http://${environment.apiUrl}/orders/${id}`);
  }
}
