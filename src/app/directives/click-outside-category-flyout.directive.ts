import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[appClickOutsideCategoryFlyout]'
})
export class ClickOutsideCategoryFlyoutDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    const clickedInside =
      this.elementRef.nativeElement.contains(targetElement) ||
      targetElement.classList.contains('cat');
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
