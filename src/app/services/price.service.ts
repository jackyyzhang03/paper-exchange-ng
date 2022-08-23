import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { EMPTY, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

type PriceUpdate = { s: string, p: number };

type Candles = {
  t: number[],
  o: number[],
  h: number[],
  c: number[],
  l: number[],
  v: number[],
}

export type CandlestickData = {
  candles: number[][]; // [t, o, h, l, c]
  volume: number[][]; // [t, v]
}

export type TimeUnit = 'day' | 'week' | 'month' | 'year' | 'all';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  constructor(private http: HttpClient) { }

  public getPrices(symbols: string[]) {
    if (!symbols) return EMPTY;
    const subject = webSocket('ws://localhost:8080/prices');
    subject.next({ symbols });
    return subject.asObservable() as Observable<PriceUpdate>;
  }

  public getCandles(
    symbol: string, unit: TimeUnit, resolution: string, number: number) {
    return this.http.get<Candles>(
      `http://localhost:8080/candles/${symbol}`,
      { params: { unit, resolution, number } }).
      pipe(
        tap(candles => candles.t = candles.t.map(t => t * 1000)), // convert from seconds to milliseconds
        map((candles): CandlestickData => ({
          candles: candles.t.map(
            (t, i) => [
              t,
              candles.o[i],
              candles.h[i],
              candles.l[i],
              candles.c[i]]),
          volume: candles.v.map((v, i) => [candles.t[i], v]),
        })),
      );
  }
}
