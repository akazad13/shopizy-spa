import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountModalComponent } from './update-account-modal.component';

describe('UpdateAccountModalComponent', () => {
  let component: UpdateAccountModalComponent;
  let fixture: ComponentFixture<UpdateAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
