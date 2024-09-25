import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    ViewChild
} from '@angular/core';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { fromOutsideClick } from '../../../functions/rxjs/from-outside-click';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MobileMenuService } from '../../../services/mobile-menu.service';
import { VehiclePickerModalService } from '../../../services/vehicle-picker-modal.service';
import { CartService } from '../../../services/cart.service';
import { ApiModule, VehicleApi } from '../../../api';
import { IconComponent } from '../../commons/icon/icon.component';
import { MobileLogoComponent } from '../mobile-logo/mobile-logo.component';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
    selector: 'app-mobile-header',
    standalone: true,
    imports: [IconComponent, MobileLogoComponent, CommonModule, ApiModule],
    templateUrl: './mobile-header.component.html',
    styles: ``
})
export class MobileHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject<void>();

    vehiclePickerIsOpen = false;

    searchIsOpen = false;

    searchPlaceholder$!: Observable<string>;

    @HostBinding('class.mobile-header') classMobileHeader = true;

    @ViewChild('searchForm') searchForm!: ElementRef<HTMLElement>;

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLElement>;

    @ViewChild('searchIndicator') searchIndicator!: ElementRef<HTMLElement>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private vehiclesApi: VehicleApi,
        public menu: MobileMenuService,
        public vehiclePicker: VehiclePickerModalService,
        public cart: CartService,
        public wishlist: WishlistService
    ) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.zone.runOutsideAngular(() => {
            fromOutsideClick([
                this.searchForm.nativeElement,
                this.searchIndicator.nativeElement
            ])
                .pipe(
                    filter(
                        () => this.searchIsOpen && !this.vehiclePickerIsOpen
                    ),
                    takeUntil(this.destroy$)
                )
                .subscribe(() => {
                    this.zone.run(() => this.closeSearch());
                });
        });
    }

    openSearch(): void {
        this.searchIsOpen = true;

        if (this.searchInput.nativeElement) {
            this.searchInput.nativeElement.focus();
        }
    }

    closeSearch(): void {
        this.searchIsOpen = false;
    }

    openVehiclePicker(): void {}
}
