import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetail } from '../../../interfaces/product';
import { CartItem, CartService } from '../../../services/cart.service';
import { ProductApi } from '../../../api/product.api';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../../services/wishlist.service';
import { RatingComponent } from '../rating/rating.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { Subscription } from 'rxjs';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterLink,
    RatingComponent,
    IconComponent,
    FormsModule,
    SkeletonLoaderComponent
  ],
  templateUrl: './product-details.component.html',
  styles: ``,
  providers: [ProductApi]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: ProductDetail;
  mainPhotoUrl: string | null = null;
  selectedTab = 'description';
  selectedColor = '';
  selectedSize = '';
  availableSizes: string[] = [];
  availableColors: string[] = [];
  colorMap: Map<string, string> = new Map<string, string>();
  isLightboxOpen = false;

  reviewRating = 0;
  reviewHeadline = '';
  reviewComment = '';
  reviewImageUrl = '';
  reviewImageUrls: string[] = [];
  isSubmittingReview = false;
  isLoggedIn = false;
  loading = true;

  maxRating = 5.0;
  starsArray: string[] = [];
  starNumberArr: { num: number; pct: number }[] = [];

  routeSubscription!: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly cartService: CartService,
    private readonly productApi: ProductApi,
    private readonly authService: AuthService,
    private readonly wishlistService: WishlistService,
    private readonly toast: ToastService
  ) {
    this.mapColors();
    this.isLoggedIn = this.authService.loggedIn();
  }

  async ngOnInit(): Promise<void> {
    this.routeSubscription = this.activatedRoute.data.subscribe((data) => {
      this.product = data['product'];
      if (this.product != null) {
        this.mainPhotoUrl =
          this.product.productImages == null || this.product.productImages.length === 0
            ? null
            : this.product.productImages[0].imageUrl;

        this.availableSizes = this.product.sizes ? this.product.sizes.split(',') : ['Standard'];
        this.availableColors = this.product.colors ? this.product.colors.split(',') : ['Standard'];

        this.selectedColor = this.availableColors[0];
        this.selectedSize = this.availableSizes[0];

        this.calculateStarNumberArray();
      }
      this.loading = false;
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getHighlightsList(): string[] {
    if (!this.product || !this.product.highlights) {
      return [];
    }

    const raw = this.product.highlights;
    const lines = raw
      .split(/[\r\n;]+/)
      .map(line => line.replace(/^[\s•\-\*\d+\.\:]+/, '').trim())
      .filter(line => line.length > 0);

    return lines.length > 0 ? lines : [raw];
  }

  addProductToCart() {
    const cartItem: CartItem = {
      cartItemId: null,
      productId: this.product.productId,
      image: this.mainPhotoUrl || this.product.productImages?.[0]?.imageUrl,
      name: this.product.name,
      price: this.product.price,
      discount: this.product.discount,
      quantity: 1,
      color: this.selectedColor,
      size: this.selectedSize
    };
    this.cartService.addToCart(cartItem);
    this.toast.success(`Added ${this.product.name} to cart`);
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  changeProductImage(productImageUrl: string | undefined) {
    if (productImageUrl == null) {
      return;
    }
    this.mainPhotoUrl = productImageUrl;
  }

  updateTabSelection(selectedTab: string) {
    this.selectedTab = selectedTab;
  }

  calculateStarNumberArray(): void {
    this.starNumberArr = Array.from({ length: 6 }, () => ({
      num: 0,
      pct: 0
    }));
    if (this.product?.productReviews) {
      for (const review of this.product.productReviews) {
        const r = Math.floor(review.rating);
        if (r >= 1 && r <= 5) {
          this.starNumberArr[r].num++;
        }
      }
    }
    this.starNumberArr = this.starNumberArr.slice(1, 6).reverse();

    const total = this.product?.averageRating?.numRatings || 1;
    for (const element of this.starNumberArr) {
      element.pct = (element.num * 100) / total;
    }
  }

  mapColors(): void {
    this.colorMap.set('Black', 'bg-black');
    this.colorMap.set('White', 'bg-white');
    this.colorMap.set('Red', 'bg-red-500');
    this.colorMap.set('Blue', 'bg-blue-500');
    this.colorMap.set('Green', 'bg-green-600');
    this.colorMap.set('Purple', 'bg-purple-500');
    this.colorMap.set('Orange', 'bg-orange-400');
    this.colorMap.set('Gray', 'bg-gray-500');
    this.colorMap.set('Pink', 'bg-pink-400');
    this.colorMap.set('Yellow', 'bg-yellow-400');
    this.colorMap.set('Brown', 'bg-brown-600');
    this.colorMap.set('Cyan', 'bg-cyan-500');
    this.colorMap.set('Magenta', 'bg-magenta-500');
  }

  openLightbox() {
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  setReviewRating(rating: number) {
    this.reviewRating = rating;
  }

  addReviewImage() {
    if (this.reviewImageUrl.trim()) {
      this.reviewImageUrls.push(this.reviewImageUrl.trim());
      this.reviewImageUrl = '';
    }
  }

  removeReviewImage(index: number) {
    this.reviewImageUrls.splice(index, 1);
  }

  async onSubmitReview() {
    if (this.reviewRating === 0 || !this.reviewComment.trim()) {
      return;
    }

    this.isSubmittingReview = true;
    try {
      await firstValueFrom(
        this.productApi.submitReview(
          this.product.productId,
          this.reviewRating,
          this.reviewComment,
          this.reviewHeadline,
          this.reviewImageUrls
        )
      );
      this.toast.success('Review submitted successfully!');
      // Reset form on success
      this.reviewRating = 0;
      this.reviewHeadline = '';
      this.reviewComment = '';
      this.reviewImageUrls = [];
      // Refresh product
      const updatedProduct = await firstValueFrom(
        this.productApi.getProduct(this.product.productId)
      );
      this.product = updatedProduct;
      this.calculateStarNumberArray();
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      this.isSubmittingReview = false;
    }
  }

  async upvoteReview(review: any) {
    const reviewId = review.reviewId || review.id;
    if (!reviewId) return;

    try {
      await firstValueFrom(
        this.productApi.markReviewHelpful(this.product.productId, reviewId)
      );
      review.helpfulVotesCount = (review.helpfulVotesCount || 0) + 1;
      review.hasUpvoted = true;
      this.toast.success('Thank you for your feedback!');
    } catch (err) {
      console.error('Failed to upvote review', err);
    }
  }

  toggleWishlist(): void {
    const wasInWishlist = this.isInWishlist();
    this.wishlistService.toggleWishlist(this.product);
    if (!wasInWishlist) {
      this.toast.success(
        'Saved to Wishlist! Price-drop and back-in-stock alerts enabled.'
      );
    } else {
      this.toast.info('Removed from Wishlist');
    }
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.productId);
  }
}
