import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  formGroup = new FormGroup({
    ticker: new FormControl(''),
  });
  filteredOptions: Observable<string[]> | undefined;
  private options: string[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  search() {
    if (this.options.includes(this.formGroup.value.ticker || '')) {
      this.router.navigateByUrl(`ticker/${this.formGroup.value.ticker}`).
        then(() => this.formGroup.controls.ticker.setValue(''));
    }
  }

  ngOnInit(): void {
    firstValueFrom(
      this.http.get<{ symbols: string[] }>(`http://${environment.apiUrl}/symbols`)).
      then(data => this.options = data.symbols).
      then(() => this.options.sort());
    this.filteredOptions = this.formGroup.controls.ticker.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || '')),
    );
  }

  private filter(value: string) {
    return this.options.filter(
      option => option.toUpperCase().startsWith(value.toUpperCase()));
  }

}
