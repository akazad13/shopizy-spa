import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'hasError',
  pure: false
})
export class HasErrorPipe implements PipeTransform {
  transform(
    control: AbstractControl | null | undefined,
    errorName: string
  ): any {
    if (!control) return false;
    const errors = control.errors || {};
    return (
      control.invalid &&
      (control.dirty || control.touched) &&
      !!errors[errorName]
    );
  }
}
