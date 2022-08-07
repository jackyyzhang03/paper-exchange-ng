import { TestBed } from '@angular/core/testing';

import { PortfolioDataSource } from './portfolio.datasource';

describe('PortfolioService', () => {
  let service: PortfolioDataSource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioDataSource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
