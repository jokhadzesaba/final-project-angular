import { TestBed } from '@angular/core/testing';

import { RegistrationUpdateDeleteEditService } from './registration-update-delete-edit.service';

describe('RegistrationUpdateDeleteEditService', () => {
  let service: RegistrationUpdateDeleteEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationUpdateDeleteEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
