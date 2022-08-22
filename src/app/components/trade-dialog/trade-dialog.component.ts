import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PortfolioDataSource } from '../../datasources/portfolio.datasource';
import { firstValueFrom } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';

type OrderType = {
  value: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  view: string;
}

@Component({
  selector: 'app-trade-dialog',
  templateUrl: './trade-dialog.component.html',
  styleUrls: ['./trade-dialog.component.scss'],
})
export class TradeDialogComponent implements OnInit {
  types: OrderType[] = [
    { value: 'MARKET', view: 'Market' },
    { value: 'LIMIT', view: 'Limit' },
    { value: 'STOP', view: 'Stop' },
    { value: 'STOP_LIMIT', view: 'Stop limit' }];

  orderForm = new FormGroup({
    shares: new FormControl(null, [Validators.required]),
    type: new FormControl(this.types[0].value, [Validators.required]),
    executionPrice: new FormControl({ value: null, disabled: true },
      [Validators.required]),
    stopLimitPrice: new FormControl({ value: null, disabled: true },
      [Validators.required]),
    sell: new FormControl(false, [Validators.required]),
  });

  sharesErrorStateMatcher = new SharesErrorStateMatcher();
  ownedShares = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { symbol: string },
    private dialogRef: MatDialogRef<TradeDialogComponent>,
    private orderService: OrderService,
    private portfolioDataSource: PortfolioDataSource) { }

  submitOrder() {
    const symbol = this.data.symbol;
    const {
      shares,
      type,
      executionPrice,
      stopLimitPrice,
      sell,
    } = this.orderForm.value;
    if (symbol && shares && type && sell != null) {
      this.orderService.postOrder(
        { symbol, shares, type, executionPrice, stopLimitPrice, sell }).
        subscribe();
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    firstValueFrom(this.portfolioDataSource.getHolding(this.data.symbol)).
      then((holding => {
        this.ownedShares = holding.shares;
        this.orderForm.addValidators(shareQuantityValidator(this.ownedShares));
      }));

    this.orderForm.controls.type.valueChanges.subscribe((value) => {
      if (value === 'MARKET') {
        this.orderForm.controls.executionPrice.disable();
        this.orderForm.controls.stopLimitPrice.disable();
      } else if (value === 'STOP_LIMIT') {
        this.orderForm.controls.executionPrice.enable();
        this.orderForm.controls.stopLimitPrice.enable();
      } else {
        this.orderForm.controls.executionPrice.enable();
        this.orderForm.controls.stopLimitPrice.disable();
      }
    });
  }
}

function shareQuantityValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.get('sell')!.value && control.get('shares')!.value > max) {
      return { insufficientShares: true };
    }
    return null;
  };
}

class SharesErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && (control.dirty || control.touched || isSubmitted) &&
      (control.invalid ||
        (form && form.errors && form.errors['insufficientShares'])));
  }
}
