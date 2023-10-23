import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneRepMaxComponent } from './one-rep-max.component';

describe('OneRepMaxComponent', () => {
  let component: OneRepMaxComponent;
  let fixture: ComponentFixture<OneRepMaxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneRepMaxComponent]
    });
    fixture = TestBed.createComponent(OneRepMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
