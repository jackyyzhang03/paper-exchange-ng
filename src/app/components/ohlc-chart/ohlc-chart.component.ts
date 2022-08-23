import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PriceService, TimeUnit } from '../../services/price.service';
import { StockChart } from 'angular-highcharts';

@Component({
  selector: 'app-ohlc-chart',
  templateUrl: './ohlc-chart.component.html',
  styleUrls: ['./ohlc-chart.component.scss'],
})
export class OhlcChartComponent implements OnChanges {
  @Input() symbol = '';
  @Input() unit: TimeUnit = 'day';
  @Input() number: number = 1;
  @Input() resolution: string = '1';
  chart: StockChart | undefined;

  constructor(private priceService: PriceService) { }

  loadChart() {
    this.priceService.getCandles(this.symbol, this.unit, this.resolution,
      this.number).
      subscribe((datasource) => {
        const groupingUnits: [string, number[]][] = [
          [
            'second',
            [1, 2, 5, 10, 15, 30],
          ], [
            'minute',
            [1, 2, 5, 10, 15, 30],
          ], [
            'hour',
            [1, 2, 3, 4, 6, 8, 12],
          ], [
            'day',
            [1],
          ], [
            'week',
            [1],
          ], [
            'month',
            [1, 3, 6],
          ], [
            'year',
            [1],
          ]];

        this.chart = new StockChart({
          rangeSelector: {
            enabled: false,
          },
          yAxis: [
            {
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'OHLC',
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                enabled: true,
              },
            },
            {
              labels: {
                align: 'right',
                x: -3,
              },
              title: {
                text: 'Volume',
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2,
            },
          ],
          tooltip: {
            split: true,
          },
          series: [
            {
              type: 'candlestick',
              name: this.symbol,
              data: datasource.candles,
              dataGrouping: {
                units: groupingUnits,
                groupPixelWidth: 20,
              },
            },
            {
              type: 'column',
              name: 'Volume',
              data: datasource.volume,
              yAxis: 1,
              dataGrouping: {
                units: groupingUnits,
              },
            },
          ],
          time: {
            useUTC: false,
          },
          credits: {
            enabled: false,
          },
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadChart();
  }
}
