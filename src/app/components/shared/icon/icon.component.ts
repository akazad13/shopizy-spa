import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon',
    imports: [CommonModule],
    templateUrl: './icon.component.html',
    styles: ``
})
export class IconComponent {
  @Input() icon: string = '';
  @Input() classNames: string = '';

  constructor() {}
}
