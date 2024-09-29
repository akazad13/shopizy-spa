import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropcartComponent } from './dropcart.component';
import { provideRouter } from '@angular/router';

describe('DropcartComponent', () => {
  let component: DropcartComponent;
  let fixture: ComponentFixture<DropcartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropcartComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DropcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
