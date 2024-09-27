import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockProductsColumnsComponent } from './block-products-columns.component';

describe('BlockProductsColumnsComponent', () => {
  let component: BlockProductsColumnsComponent;
  let fixture: ComponentFixture<BlockProductsColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockProductsColumnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockProductsColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
