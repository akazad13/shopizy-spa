import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'isInvalid',
  pure: false
})
export class IsInvalidPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): any {
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }
}
