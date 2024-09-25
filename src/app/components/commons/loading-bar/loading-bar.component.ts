import {
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

function isNavigationStart(event: Event): boolean {
    return event instanceof NavigationStart;
}

function isNavigationEnd(event: Event): boolean {
    return (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
    );
}

@Component({
    selector: 'app-loading-bar',
    standalone: true,
    imports: [],
    template: `
        <div class="loading-bar" #bar>
            <div class="loading-bar__inner"></div>
        </div>
    `,
    styles: ``
})
export class LoadingBarComponent implements OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject();

    @ViewChild('bar') bar!: ElementRef;

    get element(): HTMLElement {
        return this.bar.nativeElement;
    }

    constructor(private router: Router, private zone: NgZone) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        let timer: string | number | NodeJS.Timeout | undefined;

        this.zone.runOutsideAngular(() => {
            this.router.events
                .pipe(takeUntil(this.destroy$))
                .subscribe((event: any) => {
                    if (isNavigationStart(event)) {
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            this.element.classList.remove(
                                'loading-bar--start',
                                'loading-bar--complete',
                                'loading-bar--reset'
                            );
                            this.element.getBoundingClientRect(); // force reflow
                            this.element.classList.add('loading-bar--start');
                        }, 50);
                    }

                    if (isNavigationEnd(event)) {
                        clearTimeout(timer);
                        if (
                            this.element.classList.contains(
                                'loading-bar--start'
                            )
                        ) {
                            this.element.classList.remove('loading-bar--start');
                            this.element.classList.add('loading-bar--complete');
                        }
                    }
                });
        });
    }
}
