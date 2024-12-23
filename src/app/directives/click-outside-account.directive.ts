import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[appClickOutsideAccount]'
})
export class ClickOutsideAccountDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    const clickedInside =
      this.elementRef.nativeElement.contains(targetElement) ||
      targetElement.classList.contains('account-dropdown-btn');
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
