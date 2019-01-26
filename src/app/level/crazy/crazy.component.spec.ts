import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrazyComponent } from './crazy.component';

describe('CrazyComponent', () => {
  let component: CrazyComponent;
  let fixture: ComponentFixture<CrazyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrazyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrazyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
