import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountApi } from '../../../api';
import { WishlistService } from '../../../services/wishlist.service';
import { CartService } from '../../../services/cart.service';
import { UrlService } from '../../../services/url.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styles: ``
})
export class HeaderComponent implements OnInit {
    email$: Observable<string | null>;

    departmentsLabel$!: Observable<string>;

    constructor(
        private account: AccountApi,
        public wishlist: WishlistService,
        public cart: CartService,
        public url: UrlService
    ) {
        this.email$ = this.account.user$.pipe(map((x) => (x ? x.email : null)));
    }

    ngOnInit(): void {}
}
