import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-mobile-logo',
    standalone: true,
    imports: [],
    templateUrl: './mobile-logo.component.html',
    styles: ``
})
export class MobileLogoComponent {
    @HostBinding('class.mobile-logo') classMobileLogo = true;

    constructor() {}
}
