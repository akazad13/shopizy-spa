import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  standalone: true,
  imports: [RouterLink, IconComponent],
  styles: ``
})
export class PromotionComponent {}
