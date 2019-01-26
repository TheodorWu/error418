import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaCardComponent } from './captcha-card.component';

describe('CaptchaCardComponent', () => {
  let component: CaptchaCardComponent;
  let fixture: ComponentFixture<CaptchaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptchaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
