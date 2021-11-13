import { TestBed } from '@angular/core/testing';

import { NetworthViewAdapterService } from './networth-view-adapter.service';

describe('NetworthViewAdapterService', () => {
  let service: NetworthViewAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworthViewAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
