import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-filters.component.html',
  styles: ``,
})
export class MobileFiltersComponent {
  @Input() hideMobileFilters: boolean = false;
  @Output() hideMobileFiltersOutput = new EventEmitter<string>();
  hideMobileDrawer(): void {
    this.hideMobileFilters = true;
    this.hideMobileFiltersOutput.emit(
      this.hideMobileFilters ? 'close' : 'open'
    );
  }
}
