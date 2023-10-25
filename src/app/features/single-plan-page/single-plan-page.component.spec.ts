import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePlanPageComponent } from './single-plan-page.component';

describe('SinglePlanPageComponent', () => {
  let component: SinglePlanPageComponent;
  let fixture: ComponentFixture<SinglePlanPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinglePlanPageComponent]
    });
    fixture = TestBed.createComponent(SinglePlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
