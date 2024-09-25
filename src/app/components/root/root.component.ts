import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    DesktopHeaderVariant,
    HeaderService,
    MobileHeaderVariant
} from '../../services/header.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoadingBarComponent } from '../commons/loading-bar/loading-bar.component';
import { MobileHeaderComponent } from '../mobile/mobile-header/mobile-header.component';

export interface RootComponentData {
    desktopHeader: DesktopHeaderVariant;
    mobileHeader: MobileHeaderVariant;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LoadingBarComponent, RouterModule, MobileHeaderComponent],
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss'
})
export class RootComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute, public header: HeaderService) {}

    ngOnInit(): void {
        this.route.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
                this.header.setDesktopVariant(
                    data.desktopHeader || 'spaceship/one'
                );
                this.header.setMobileVariant(data.mobileHeader || 'one');
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
