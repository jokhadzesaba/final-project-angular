import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationErrorHandlingComponent } from './registration-error-handling.component';

describe('RegistrationErrorHandlingComponent', () => {
  let component: RegistrationErrorHandlingComponent;
  let fixture: ComponentFixture<RegistrationErrorHandlingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationErrorHandlingComponent]
    });
    fixture = TestBed.createComponent(RegistrationErrorHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
