import { Component } from '@angular/core';
import { UrlService } from '../../services/url.service';
import { BlockSpaceComponent } from '../../shared/components/block-space/block-space.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [BlockSpaceComponent, RouterModule],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
    constructor(public url: UrlService) {}
}
