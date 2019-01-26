import { Component, OnInit, Input } from '@angular/core';
import { CaptchaAsset } from '../captcha.model';

@Component({
  selector: 'app-captcha-card',
  templateUrl: './captcha-card.component.html',
  styleUrls: ['./captcha-card.component.scss']
})
export class CaptchaCardComponent implements OnInit {

  @Input() captchaCard: CaptchaAsset;

  constructor() { }

  ngOnInit() {
  }

  flip(captcha: CaptchaAsset) {
  document.getElementById('Card' + captcha.id).setAttribute('style', 'transform: rotateY( 180deg );');
  }
}
