import { TestBed } from '@angular/core/testing';

import { TipodcobrosService } from './tipodcobros.service';

describe('TipodcobrosService', () => {
  let service: TipodcobrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipodcobrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
