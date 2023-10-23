import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCoachInfoComponent } from './single-coach-info.component';

describe('SingleCoachInfoComponent', () => {
  let component: SingleCoachInfoComponent;
  let fixture: ComponentFixture<SingleCoachInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleCoachInfoComponent]
    });
    fixture = TestBed.createComponent(SingleCoachInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
