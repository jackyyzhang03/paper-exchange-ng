import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OhlcChartComponent } from './ohlc-chart.component';

describe('OhlcChartComponent', () => {
  let component: OhlcChartComponent;
  let fixture: ComponentFixture<OhlcChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OhlcChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OhlcChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
