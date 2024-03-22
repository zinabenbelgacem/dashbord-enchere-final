import { TestBed } from '@angular/core/testing';

import { EnchereService } from './enchers-service.service';

describe('EnchersServiceService', () => {
  let service: EnchereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnchereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
