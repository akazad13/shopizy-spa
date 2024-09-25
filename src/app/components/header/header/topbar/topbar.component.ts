import { Component, HostBinding, Input } from '@angular/core';

export type TopbarLayout = 'spaceship-start' | 'spaceship-end';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [],
    providers: [],
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
    @Input() layout: TopbarLayout;

    @HostBinding('class.topbar') classTopbar = true;

    @HostBinding('class.topbar--spaceship-start')
    get classTopbarSpaceshipStart(): boolean {
        return this.layout === 'spaceship-start';
    }

    @HostBinding('class.topbar--spaceship-end')
    get classTopbarSpaceshipEnd(): boolean {
        return this.layout === 'spaceship-end';
    }

    constructor(
        public language: LanguageService,
        public compare: CompareService
    ) {}
}
