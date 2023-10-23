import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachRegistrationComponent } from './coach-registration.component';

describe('CoachRegistrationComponent', () => {
  let component: CoachRegistrationComponent;
  let fixture: ComponentFixture<CoachRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoachRegistrationComponent]
    });
    fixture = TestBed.createComponent(CoachRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
