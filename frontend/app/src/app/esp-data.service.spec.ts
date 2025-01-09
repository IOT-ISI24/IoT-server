import { TestBed } from '@angular/core/testing';

import { EspDataService } from './esp-data.service';

describe('EspDataService', () => {
  let service: EspDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
