import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({ selector: '[appClickOutsideAccount]' })
export class ClickOutsideAccountDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const clickedInside =
        this.elementRef.nativeElement.contains(target) ||
        target.classList.contains('account-dropdown-btn');
      if (!clickedInside) {
        this.clickOutside.emit();
      }
    }
  }
}
