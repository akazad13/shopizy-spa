import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html'
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'card' | 'form' | 'list' = 'table';
  @Input() rows: number = 5;
  @Input() columns: number = 3;

  get rowsArray(): number[] {
    return Array(this.rows)
      .fill(0)
      .map((_, i) => i);
  }

  get colsArray(): number[] {
    return Array(this.columns)
      .fill(0)
      .map((_, i) => i);
  }
}
