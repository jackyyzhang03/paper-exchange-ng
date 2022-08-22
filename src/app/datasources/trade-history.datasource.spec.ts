import { TestBed } from '@angular/core/testing';

import { TradeHistoryDataSource } from './trade-history.datasource';

describe('TradeHistoryDatasourceService', () => {
  let service: TradeHistoryDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeHistoryDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
