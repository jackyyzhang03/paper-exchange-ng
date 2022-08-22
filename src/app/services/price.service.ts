import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { EMPTY, Observable } from 'rxjs';

type PriceUpdate = { s: string, p: number };

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  constructor() { }

  public getPrices(symbols: string[]) {
    if (!symbols) return EMPTY;
    const subject = webSocket('ws://localhost:8080/prices');
    subject.next({ symbols });
    return subject.asObservable() as Observable<PriceUpdate>;
  }
}
