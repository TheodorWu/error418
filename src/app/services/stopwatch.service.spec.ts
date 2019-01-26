import { TestBed } from '@angular/core/testing';

import { StopwatchService } from './stopwatch.service';

describe('StopwatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StopwatchService = TestBed.get(StopwatchService);
    expect(service).toBeTruthy();
  });
});
