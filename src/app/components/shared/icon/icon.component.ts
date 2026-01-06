import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styles: ``
})
export class IconComponent {
  @Input() icon = '';
  @Input() classNames = '';
}
