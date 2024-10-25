import { Pipe, PipeTransform } from '@angular/core';
import { CategoryTree } from '../interfaces/category';

@Pipe({
  name: 'toIterable',
  standalone: true
})
export class ToIterablePipe implements PipeTransform {
  transform(value: CategoryTree): any[] {
    return value.children || [];
  }
}
