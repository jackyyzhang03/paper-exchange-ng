import { TestBed } from '@angular/core/testing';

import { OrderDataSource } from './order.datasource';

describe('OrderdsService', () => {
  let service: OrderDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
