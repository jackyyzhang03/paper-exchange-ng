import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enum',
})
export class EnumPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace('_', ' ').toLowerCase();
  }

}
