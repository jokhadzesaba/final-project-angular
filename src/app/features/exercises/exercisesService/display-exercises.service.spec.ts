import { TestBed } from '@angular/core/testing';

import { DisplayExercisesService } from './display-exercises.service';

describe('DisplayExercisesService', () => {
  let service: DisplayExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayExercisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
