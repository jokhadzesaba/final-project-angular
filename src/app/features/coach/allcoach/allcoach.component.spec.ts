import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcoachComponent } from './allcoach.component';

describe('AllcoachComponent', () => {
  let component: AllcoachComponent;
  let fixture: ComponentFixture<AllcoachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllcoachComponent]
    });
    fixture = TestBed.createComponent(AllcoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
