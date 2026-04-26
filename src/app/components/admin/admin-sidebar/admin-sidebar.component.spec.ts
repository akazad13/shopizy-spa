import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminSidebarComponent } from './admin-sidebar.component';

describe('AdminSidebarComponent', () => {
  let component: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSidebarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose expected core admin navigation routes', () => {
    const routes = component.mainNav.map((item) => item.route);

    expect(routes).toContain('/admin/dashboard');
    expect(routes).toContain('/admin/products');
    expect(routes).toContain('/admin/orders');
    expect(routes).toContain('/admin/users');
    expect(routes).toContain('/admin/categories');
    expect(routes).toContain('/admin/brands');
  });

  it('should include brands menu label and route mapping', () => {
    const brandsItem = component.mainNav.find(
      (item) => item.label === 'Brands'
    );

    expect(brandsItem).toBeDefined();
    expect(brandsItem?.route).toBe('/admin/brands');
  });

  it('should keep all routes unique to avoid routerLink collisions', () => {
    const routes = component.mainNav.map((item) => item.route);
    const uniqueRoutes = new Set(routes);

    expect(uniqueRoutes.size).toBe(routes.length);
  });

  it('should have icon path data for every nav item', () => {
    expect(
      component.mainNav.every((item) => !!item.icon && item.icon.length > 0)
    ).toBeTrue();
  });
});
