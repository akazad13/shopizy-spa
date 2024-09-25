import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSpaceComponent } from './block-space.component';

describe('BlockSpaceComponent', () => {
  let component: BlockSpaceComponent;
  let fixture: ComponentFixture<BlockSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
