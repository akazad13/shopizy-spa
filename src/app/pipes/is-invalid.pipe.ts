import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'isInvalid',
  standalone: true,
  pure: false
})
export class IsInvalidPipe implements PipeTransform {
  transform(control: AbstractControl): any {
    return control.invalid && (control.dirty || control.touched);
  }
}
