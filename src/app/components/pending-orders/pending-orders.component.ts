import { Component, OnInit } from '@angular/core';
import { OrderDataSource } from '../../datasources/order.datasource';
import { OrderService } from '../../services/order.service';
import { firstValueFrom } from 'rxjs';

export type Order = {
  id: number;
  symbol: string;
  type: string;
  shares: number;
  executionPrice: number;
  stopLimitPrice: number;
  sell: boolean;
}

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.scss'],
})
export class PendingOrdersComponent implements OnInit {
  displayedColumns = [
    'symbol',
    'buyOrSell',
    'type',
    'shares',
    'executionPrice',
    'stopLimitPrice',
    'delete'];

  constructor(public dataSource: OrderDataSource, private orderService: OrderService) { }

  ngOnInit(): void {
  }

  deleteOrder(order: Order) {
    firstValueFrom(this.orderService.deleteOrderById(order.id)).then(() => this.dataSource.poll());
  }
}
