import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMRCalculatorComponent } from './bmr-calculator.component';

describe('BMRCalculatorComponent', () => {
  let component: BMRCalculatorComponent;
  let fixture: ComponentFixture<BMRCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BMRCalculatorComponent]
    });
    fixture = TestBed.createComponent(BMRCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
