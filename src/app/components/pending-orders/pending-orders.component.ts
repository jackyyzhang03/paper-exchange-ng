import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { OrderDataSource } from '../../datasources/order.datasource';
import { OrderService } from '../../services/order.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
export class PendingOrdersComponent implements AfterViewInit, OnDestroy {
  displayedColumns = [
    'symbol',
    'buyOrSell',
    'type',
    'shares',
    'executionPrice',
    'stopLimitPrice',
    'delete'];

  pageSizeOptions = [5, 10, 20];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    public dataSource: OrderDataSource, private orderService: OrderService) { }

  deleteOrder(order: Order) {
    firstValueFrom(this.orderService.deleteOrderById(order.id)).
      then(() => this.dataSource.poll());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.paginator!.page.subscribe((event) => {
        this.dataSource.pageIndex = event.pageIndex;
        this.dataSource.pageSize = event.pageSize;
        this.dataSource.poll();
      }),
      this.sort!.sortChange.subscribe((event) => {
        this.paginator!.firstPage();
        this.dataSource.sortName = event.active;
        this.dataSource.sortDirection = event.direction;
        this.dataSource.poll();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
