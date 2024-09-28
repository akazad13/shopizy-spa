import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortStoryComponent } from './short-story.component';

describe('ShortStoryComponent', () => {
  let component: ShortStoryComponent;
  let fixture: ComponentFixture<ShortStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortStoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
